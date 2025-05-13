import { createClient } from "@supabase/supabase-js";

/**
 * This client is safe for the browser because it uses the public *anon* key.
 * Make sure these two vars are defined in .env.local **and** your hosting dashboard:
 *
 *   NEXT_PUBLIC_SUPABASE_URL=https://…supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=ey…
 */
if (!process.env.SUPA_URL || !process.env.SUPA_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPA_URL or SUPA_SERVICE_ROLE_KEY env var");
}

export const supabase = createClient(
  process.env.SUPA_URL,
  process.env.SUPA_SERVICE_ROLE_KEY
);
