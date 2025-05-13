// app/onboarding/page.tsx
"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Wait for session to load
  if (status === "loading") return <p>Loading…</p>;

  // 2. If not signed in, send them to Google
  if (status === "unauthenticated") {
    signIn("google");
    return null;
  }

  // 3. Extract the organisation_id we stored on session.user
  const orgId = (session?.user as any)?.organisation_id as string | undefined;
  if (!orgId) {
    // should never happen, but just in case
    return <p>Error: no organisation ID found.</p>;
  }

  // 4. Handler for saving the company name
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!companyName) return;
    setLoading(true);

    // Update the name field on the organisation row
    const { error } = await supabase
      .from("user_organisations")
      .update({ name: companyName })
      .eq("id", orgId);

    setLoading(false);
    if (error) {
      console.error("Onboarding update error:", error);
      return alert("Failed to save. Check console.");
    }

    // Redirect back into the protected area
    router.push("/");
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Welcome to CompanyFlash! 👋</h1>
      <p>First things first—what’s your company called?</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your company name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Saving…" : "Continue"}
        </button>
      </form>
    </div>
  );
}
