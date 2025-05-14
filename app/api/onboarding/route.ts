// app/api/onboarding/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession }         from "next-auth/next";
import { authOptions }              from "@/app/api/auth/[...nextauth]/route";
import { createClient }             from "@supabase/supabase-js";
import { v4 as uuidv4 }             from "uuid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPA_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  // 1) Ensure we have a logged-in user
  const session   = await getServerSession(authOptions);
  const profileId = session?.user?.profile_id;
  if (!profileId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 2) Parse + validate
  const { name } = await req.json();
  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Missing company name" }, { status: 400 });
  }

  // 3) Look for an existing org by this owner
  const { data: existing, error: existErr } = await supabase
    .from("user_organisations")
    .select("id")
    .eq("owner_id", profileId)
    .maybeSingle();
  if (existErr) {
    console.error("Org lookup error:", existErr);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  let orgId = existing?.id;
  if (!orgId) {
    // 4a) Create new org
    orgId = uuidv4();
    const { error: createErr } = await supabase
      .from("user_organisations")
      .insert({ id: orgId, owner_id: profileId, name: name.trim() })
      .single();
    if (createErr) {
      console.error("Org create error:", createErr);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }
    // 4b) Grant membership to the owner
    const { error: memErr } = await supabase
      .from("user_organisation_members")
      .upsert({
        organisation_id: orgId,
        user_id:         profileId,
        role:            "owner",
        status:          "active",
      });
    if (memErr) console.error("Member upsert error:", memErr);
  } else {
    // 5) Update the name if the org already exists
    const { error: updateErr } = await supabase
      .from("user_organisations")
      .update({ name: name.trim() })
      .eq("id", orgId);
    if (updateErr) {
      console.error("Org update error:", updateErr);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
