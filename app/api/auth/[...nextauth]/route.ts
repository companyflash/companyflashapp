/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPA_SERVICE_ROLE_KEY!
);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    // Runs when the JWT is created or updated
    async jwt({ token, user }) {
      if (user) {
        const email = user.email || "";
        const fullName = user.name || "";

        // Upsert into user_profiles
        const { data: profile, error: profErr } = await supabase
          .from("user_profiles")
          .upsert({
            id: token.sub,      // NextAuth’s stable user ID
            email,
            full_name: fullName,
          })
          .select("id")
          .single();
        if (profErr) console.error("Profile upsert error:", profErr);

        token.profile_id = profile?.id;

        // On first login, create an organisation + owner link
        const { data: members } = await supabase
          .from("user_organisation_members")
          .select("organisation_id")
          .eq("user_id", token.sub)
          .limit(1);

        if (!members?.length) {
          const orgId = uuidv4();

          // Create the organisation
          const { error: orgErr } = await supabase
            .from("user_organisations")
            .insert({
              id: orgId,
              owner_id: token.sub,
              name: null,
            });
          if (orgErr) console.error("Org insert error:", orgErr);

          // Link the owner
          const { error: memErr } = await supabase
            .from("user_organisation_members")
            .insert({
              organisation_id: orgId,
              user_id: token.sub,
              role: "owner",
              status: "active",
            });
          if (memErr) console.error("Member insert error:", memErr);

          token.organisation_id = orgId;
        } else {
          token.organisation_id = members[0].organisation_id;
        }
      }
      return token;
    },

    // Expose profile_id & organisation_id on the session
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).profile_id = token.profile_id;
        (session.user as any).organisation_id = token.organisation_id;
      }
      return session;
    },
  },
});

// Export the NextAuth handler as HTTP methods
export { handler as GET, handler as POST };
