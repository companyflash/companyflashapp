// scripts/test-docai-auth.js
import { config }     from 'dotenv';
import { GoogleAuth } from 'google-auth-library';
import path           from 'path';

// ⚠️ override: true forces your .env.local file to win
config({
  path:     path.resolve(process.cwd(), '.env.local'),
  override: true
});

async function test() {
  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  console.log('Using key file:', keyPath);

  const auth = new GoogleAuth({
    keyFilename: keyPath,
    scopes:      ['https://www.googleapis.com/auth/cloud-platform'],
  });

  const client = await auth.getClient();
  const res    = await client.getAccessToken();

  if (!res.token) throw new Error('No token returned');
  console.log('✅ Access Token:', res.token.slice(0, 40) + '…');
}

test().catch(err => {
  console.error('❌ Auth test failed:', err);
  process.exit(1);
});
