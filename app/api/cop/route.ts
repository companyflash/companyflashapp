import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with the environment variables
const supabase = createClient(
  process.env.SUPA_URL!,
  process.env.SUPA_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const { name } = await request.json();

  // Properly destructure getSession() result
  const { data, error: sessionError } = await supabase.auth.getSession();
  const session = data?.session ?? null;

  if (sessionError) {
    console.error('Error fetching session:', sessionError);
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }

  // Check if session is valid and user exists
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  // Retrieve TrueLayer tokens from the authenticated user in Supabase
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('tl_access_token, tl_refresh_token, tl_token_expires_at')
    .eq('id', session.user.id)
    .single();

  if (userError || !user) {
    return NextResponse.json(
      { error: 'No TrueLayer connection found. Please connect your bank first.' },
      { status: 400 }
    );
  }

  let token = user.tl_access_token;

  // Refresh token if expired
  if (user.tl_token_expires_at < Math.floor(Date.now() / 1000)) {
    const form = new URLSearchParams({
      grant_type:    'refresh_token',
      refresh_token: user.tl_refresh_token,
      client_id:     process.env.TRUELAYER_CLIENT_ID!,
      client_secret: process.env.TRUELAYER_CLIENT_SECRET!,
    });

    const r = await fetch(
      `${process.env.TRUELAYER_SANDBOX_AUTH_URL}/connect/token`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    form,
      }
    );

    const nt = await r.json();
    if (!r.ok || !nt.access_token) {
      return NextResponse.json({ error: 'Failed to refresh TrueLayer token' }, { status: 500 });
    }

    // Save refreshed token to Supabase
    token = nt.access_token;
    await supabase
      .from('users')
      .update({
        tl_access_token:     nt.access_token,
        tl_refresh_token:    nt.refresh_token,
        tl_token_expires_at: Math.floor(Date.now() / 1000) + nt.expires_in,
      })
      .eq('id', session.user.id);
  }

  // Call the TrueLayer Name-Match verify endpoint
  const vRes = await fetch(
    `${process.env.TRUELAYER_SANDBOX_API_URL}/verification/v1/verify`,
    {
      method:  'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    }
  );

  const payload = await vRes.json();
  return NextResponse.json(payload, { status: vRes.ok ? 200 : vRes.status });
}
