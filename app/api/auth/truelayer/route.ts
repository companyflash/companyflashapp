import { NextResponse } from 'next/server';

export function GET() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.TRUELAYER_CLIENT_ID!,
    scope: 'verification',
    redirect_uri: process.env.REDIRECT_URI!,
    provider_id: 'mock',
    state: 'csrf_token_xyz',
  });

  return NextResponse.redirect(
    `${process.env.TRUELAYER_SANDBOX_AUTH_URL}/?${params}`
  );
}
