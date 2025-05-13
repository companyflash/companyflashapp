import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  process.env.SUPA_URL!,
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
    async jwt({ token, user }) {
      if (user) {
        // Only store name and email in the token
        token.email = user.email || '';  // Ensure `email` is a string, fallback to empty string
        token.name = user.name || '';  // Ensure `name` is a string, fallback to empty string

        // Upsert user data into Supabase (only storing name and email)
        const { error } = await supabase
          .from("users")
          .upsert({
            email: token.email || '',  // Store only email
            name: token.name || '',  // Store only name
          })
          .eq("email", token.email || '');  // Match by email

        if (error) {
          console.error("Error storing user in Supabase:", error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      // Only pass name and email to the session
      if (session.user) {
        session.user.email = token.email || '';  // Ensure `email` is a string
        session.user.name = token.name || '';  // Ensure `name` is a string
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
