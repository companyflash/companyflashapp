import { NextRequest, NextResponse } from "next/server";
import { getServerSession }      from "next-auth/next";
import { authOptions }           from "@/app/api/auth/[...nextauth]/route";
import { createClient }          from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPA_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  // 1) check auth
  const session = await getServerSession(authOptions);
  if (!session?.user.profile_id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const profileId = session.user.profile_id;

  // 2) get the new name
  const { full_name } = await req.json();
  if (!full_name) {
    return NextResponse.json({ error: "Missing full_name" }, { status: 400 });
  }

  // 3) update profile + mark complete
  const { error } = await supabase
    .from("user_profiles")
    .update({ full_name, profile_complete: true })
    .eq("id", profileId);
  if (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
