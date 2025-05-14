// app/api/accept-invite/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient }             from "@supabase/supabase-js";
import { getServerSession }         from "next-auth/next";
import { authOptions }              from "@/app/api/auth/[...nextauth]/route";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPA_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const url   = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "invalid_invite_link" }, { status: 400 });
  }

  // 1️⃣ Fetch the invite record
  const { data: invite, error: invErr } = await supabase
    .from("invites")
    .select("organisation_id, email, role, expires_at, accepted_at")
    .eq("token", token)
    .maybeSingle();

  if (invErr || !invite) {
    return NextResponse.json({ error: "invalid_invite" }, { status: 404 });
  }
  if (invite.accepted_at) {
    return NextResponse.json({ error: "already_accepted" }, { status: 400 });
  }
  if (new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: "expired" }, { status: 400 });
  }

  // 2️⃣ Ensure session & correct email
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    // Not signed in → send to Google (hint the invited address)
    const callback = encodeURIComponent(req.url);
    const loginHint = encodeURIComponent(invite.email);
    return NextResponse.redirect(
      `/api/auth/signin?callbackUrl=${callback}&login_hint=${loginHint}`
    );
  }

  const userEmail = session.user.email.toLowerCase();
  if (userEmail !== invite.email.toLowerCase()) {
    return NextResponse.json({ error: "wrong_user" }, { status: 403 });
  }

  // 3️⃣ Insert membership
  const profileId = session.user.profile_id;
  if (!profileId) {
    return NextResponse.json({ error: "missing_profile" }, { status: 500 });
  }
  const { error: memErr } = await supabase
    .from("user_organisation_members")
    .insert({
      organisation_id: invite.organisation_id,
      user_id:         profileId,
      role:            invite.role,
      status:          "active",
    });
  if (memErr) {
    console.error("Membership insert error:", memErr);
    return NextResponse.json({ error: "membership_failed" }, { status: 500 });
  }

  // 4️⃣ Mark invite as accepted
  await supabase
    .from("invites")
    .update({ accepted_at: new Date().toISOString() })
    .eq("token", token);

  return NextResponse.json({ ok: true });
}
