//app/api/auth/callback/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPA_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  
  if (!code) {
    return NextResponse.json(
      { error: 'Missing code' },
      { status: 400 }
    );
  }

  // Exchange the code for TrueLayer tokens (access token and refresh token)
  const form = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code!,
    redirect_uri: process.env.REDIRECT_URI!,
    client_id: process.env.TRUELAYER_CLIENT_ID!,
    client_secret: process.env.TRUELAYER_CLIENT_SECRET!,
  });

  const tokRes = await fetch(
    `${process.env.TRUELAYER_SANDBOX_AUTH_URL}/connect/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    }
  );

  const tok = await tokRes.json();

  if (!tok.access_token) {
    return NextResponse.json(
      { error: `Token exchange failed: ${JSON.stringify(tok)}` },
      { status: 400 }
    );
  }

  // Persist the user's TrueLayer tokens in Supabase
  const { data: user, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', req.headers.get('x-user-email'))  // Ensure the email header is passed correctly
    .single();

  if (error || !user) {
    return NextResponse.json(
      { error: 'User not found in database' },
      { status: 400 }
    );
  }

  // Store TrueLayer tokens in Supabase
  await supabase.from('users').upsert({
    id: user.id,
    tl_access_token: tok.access_token,
    tl_refresh_token: tok.refresh_token,
    tl_token_expires_at: Math.floor(Date.now() / 1000) + tok.expires_in,
    tl_consent_id: tok.consent_id,
    tl_connector_id: tok.connector_id,
  });

  return NextResponse.redirect('/dashboard');  // Redirect to a page after verification
}
