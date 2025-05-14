// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider                from "next-auth/providers/google";
import CredentialsProvider           from "next-auth/providers/credentials";
import { createClient }              from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPA_SERVICE_ROLE_KEY!
);

export const authOptions: NextAuthOptions = {
  providers: [
    // ── 1) Google SSO ────────────────────────────────────────────────
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt:        "select_account",
          access_type:   "offline",
          response_type: "code",
        },
      },
    }),

    // ── 2) Credentials: explicit login vs signup (with invite) ──────
    CredentialsProvider({
      name: "Email / Password",
      credentials: {
        mode:     { label: "Mode",         type: "hidden" },
        email:    { label: "Email",        type: "email" },
        password: { label: "Password",     type: "password" },
        token:    { label: "Invite Token", type: "hidden" },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("Missing credentials");
        const { mode, email: rawEmail, password, token } = credentials;
        const email = rawEmail.toLowerCase();

        // ── LOGIN ───────────────────────────────────────────────────────
        if (mode === "login") {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error || !data.user) {
            throw new Error("Invalid email or password");
          }
          return { id: data.user.id, email };
        }

        // ── SIGNUP ──────────────────────────────────────────────────────
        if (mode === "signup") {
          //  A) Invite-flow signup
          if (token) {
            // 1️⃣ Validate invite
            const { data: invite, error: invErr } = await supabase
              .from("invites")
              .select("organisation_id, email, role, expires_at, accepted_at")
              .eq("token", token)
              .maybeSingle();
            if (invErr || !invite) {
              throw new Error("Invalid invite");
            }
            if (
              invite.email.toLowerCase() !== email ||
              invite.accepted_at ||
              new Date(invite.expires_at) < new Date()
            ) {
              throw new Error("Invite expired or wrong email");
            }

            // 2️⃣ Sign up in Supabase Auth
            const { data: suData, error: suErr } = await supabase.auth.signUp({ email, password });
            if (suErr || !suData.user) {
              throw new Error(suErr?.message || "Signup failed");
            }
            const userId = suData.user.id;

            // 3️⃣ Upsert profile row
            const { data: profile, error: profErr } = await supabase
              .from("user_profiles")
              .upsert({
                id:        userId,
                email,
                full_name: suData.user.user_metadata.name || null,
              })
              .select("id")
              .maybeSingle();
            if (profErr || !profile) {
              throw new Error("Profile creation failed");
            }

            // 4️⃣ Insert membership
            const { error: memErr } = await supabase
              .from("user_organisation_members")
              .insert({
                organisation_id: invite.organisation_id,
                user_id:         profile.id,
                role:            invite.role,
                status:          "active",
              });
            if (memErr) {
              throw new Error("Membership creation failed");
            }

            // 5️⃣ Mark invite accepted
            await supabase
              .from("invites")
              .update({ accepted_at: new Date().toISOString() })
              .eq("token", token);

            return { id: profile.id, email };
          }

          //  B) Regular signup (no invite)
          const { data: suData, error: suErr } = await supabase.auth.signUp({ email, password });
          if (suErr || !suData.user) {
            throw new Error(suErr?.message || "Signup failed");
          }
          // upsert profile
          await supabase
            .from("user_profiles")
            .upsert({
              id:        suData.user.id,
              email,
              full_name: suData.user.user_metadata.name || null,
            });
          return { id: suData.user.id, email };
        }

        throw new Error("Invalid mode");
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET!,

  callbacks: {
    // ── 3) Upsert profile on first sign-in (Google or credentials) ────
    async jwt({ token, user }) {
      if (user) {
        const email    = user.email!;
        const fullName = user.name  ?? null;
        const { data: profile, error } = await supabase
          .from("user_profiles")
          .upsert({ id: token.sub, email, full_name: fullName })
          .select("id")
          .maybeSingle();
        if (!error && profile?.id) {
          token.profile_id = profile.id;
        }
      }
      return token;
    },

    // ── 4) Build session object without non-null abuses ──────────────
    async session({ session, token }) {
      if (!session.user) return session;

      // load profile data
      const profileId = token.profile_id;
      if (profileId) {
        const { data: profRow } = await supabase
          .from("user_profiles")
          .select("full_name, profile_complete")
          .eq("id", profileId)
          .maybeSingle();
        if (profRow?.full_name) {
          session.user.name = profRow.full_name;
        }
        session.user.profile_complete = profRow?.profile_complete ?? false;
        session.user.profile_id       = profileId;
      }

      // load organisation membership
      let orgId = token.organisation_id;
      if (!orgId && profileId) {
        const { data: memRow } = await supabase
          .from("user_organisation_members")
          .select("organisation_id")
          .eq("user_id", profileId)
          .maybeSingle();
        if (memRow?.organisation_id) {
          orgId = memRow.organisation_id;
          token.organisation_id = orgId;
        }
      }

      if (orgId) {
        session.user.organisation_id = orgId;
        const { data: orgRow } = await supabase
          .from("user_organisations")
          .select("name")
          .eq("id", orgId)
          .maybeSingle();
        session.user.company_name = orgRow?.name ?? null;
      }

      session.user.email = token.email as string;
      return session;
    },
  },

  pages: {
    error: "/?error=auth_error",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
