// app/api/invites/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient }             from "@supabase/supabase-js";
import { v4 as uuidv4 }             from "uuid";

// Use your service‐role key so this write bypasses RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPA_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { organisation_id, email, role } = await req.json();

    if (!organisation_id || !email || !role) {
      return NextResponse.json(
        { error: "organisation_id, email and role are all required" },
        { status: 400 }
      );
    }

    // Generate a one-time token for accepting the invite
    const token = uuidv4();

    // Insert into invites table
    const { error } = await supabase
      .from("invites")
      .insert({
        organisation_id,
        email,
        role,
        token,
      });

    if (error) {
      console.error("❌ Invite insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // TODO: Send email to `email` with link:
    //    `${process.env.NEXTAUTH_URL}/accept-invite?token=${token}`

    return NextResponse.json({ ok: true, token });
  } catch (err: unknown) {
    console.error("❌ /api/invites error:", err);
    let message = "Unknown error";
    if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
