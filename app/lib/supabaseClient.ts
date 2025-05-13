// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  // these MUST be NEXT_PUBLIC_ so they’re exposed to the browser
  process.env.SUPA_URL!,
  process.env.SUPA_SERVICE_ROLE_KEY!
);
