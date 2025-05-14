// types/next-auth.d.ts

import { DefaultSession } from "next-auth";
import { DefaultJWT }     from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      profile_id?:      string;
      organisation_id?: string;
      company_name?:    string | null;
      profile_complete?: boolean;   // ← add this
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    profile_id?:      string;
    organisation_id?: string;
    company_name?:    string | null;
    profile_complete?: boolean;   // ← add this
  }
}
