/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

export default function OnboardingGuard({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      // we added these props in the session callback
      const orgId = (session?.user as any)?.organisation_id as string | undefined;
      const orgName = (session?.user as any)?.company_name as string | null | undefined;
      if (orgId && !orgName) {
        router.replace("/onboarding");
      }
    }
  }, [session, status, router]);

  return <>{children}</>;
}
