// scripts/cop_check.js — Confirmation of Payee via TrueLayer Verification API
import 'dotenv/config';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

// 1️⃣ Supabase client (Service Role Key)
const supabase = createClient(
  process.env.SUPA_URL,
  process.env.SUPA_SERVICE_ROLE_KEY
);

// 2️⃣ TrueLayer sandbox URLs & creds
const TL_AUTH_URL = process.env.TRUELAYER_SANDBOX_AUTH_URL;   // https://auth.truelayer-sandbox.com
const TL_API_URL  = process.env.TRUELAYER_SANDBOX_API_URL;    // https://api.truelayer-sandbox.com
const TL_CLIENT   = process.env.TRUELAYER_CLIENT_ID;
const TL_SECRET   = process.env.TRUELAYER_CLIENT_SECRET;

// 3️⃣ OAuth2: obtain access token (verification scope)
async function getTrueLayerToken() {
  console.log('➡️ Fetching TrueLayer token…');
  const res = await fetch(`${TL_AUTH_URL}/connect/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'client_credentials',
      client_id:     TL_CLIENT,
      client_secret: TL_SECRET,
      scope:         'verification'
    })
  });
  const json = await res.json();
  if (!json.access_token) throw new Error(`Token error: ${JSON.stringify(json)}`);
  console.log('🗝️ TrueLayer access_token:', json.access_token.slice(0,30)+"…");
  return json.access_token;
}

// 4️⃣ Call Verification API’s “verify” endpoint
async function checkCoP(companyNumber, accessToken) {
  const url = `${TL_API_URL}/verification/v1/verify`;
  console.log('📡 Calling CoP URL →', url);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type':  'application/json',
      'Accept':        'application/json'
    },
    body: JSON.stringify({ name: companyNumber })
  });

  const status = res.status;
  const text   = await res.text();
  console.log(`CoP Response (status ${status}):`, text || '<empty>');
  try {
    return { status, data: JSON.parse(text) };
  } catch {
    return { status, error:'Invalid JSON', body:text };
  }
}

// 5️⃣ Main: poll invoice_requests, run CoP, push events
async function main() {
  const { data: requests, error } = await supabase
    .from('invoice_requests')
    .select('id, company_number')
    .eq('cop_checked', false)
    .limit(50);
  if (error) throw error;
  console.log(`➡️ Found ${requests.length} invoice_requests to process`);
  if (!requests.length) return console.log('ℹ️ No pending CoP checks');

  const token = await getTrueLayerToken();

  for (const req of requests) {
    try {
      console.log(`➡️ Processing ID ${req.id}, company ${req.company_number}`);
      const { status, data, error } = await checkCoP(req.company_number, token);
      const verified  = data?.verified === true;
      const eventType = verified ? 'cop-verified' : 'cop-mismatch';

      await supabase.from('events').insert({
        company_number: req.company_number,
        source:         'cop',
        event_type:     eventType,
        payload:        data ?? { status, error }
      });

      await supabase
        .from('invoice_requests')
        .update({ cop_checked: true })
        .eq('id', req.id);

      console.log(`✅ ID ${req.id}: ${eventType}`);
    } catch (err) {
      console.error(`❌ ID ${req.id} error:`, err);
      // mark checked anyway
      await supabase
        .from('invoice_requests')
        .update({ cop_checked: true })
        .eq('id', req.id);
    }
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
