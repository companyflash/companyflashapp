// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,     // <-- public URL
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // <-- public anon key
);