"use client";

import { useSession, signIn } from "next-auth/react";
import { useState }           from "react";
import { useRouter }          from "next/navigation";

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading]         = useState(false);
  const router = useRouter();

  // 1️⃣ While we’re checking auth…
  if (status === "loading") {
    return <p>Loading…</p>;
  }

  // 2️⃣ Not signed in → kick off Google, back here
  if (!session) {
    signIn("google", { callbackUrl: "/onboarding" });
    return null;
  }

  // 3️⃣ We have a session—now show the form
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!companyName.trim()) return;
    setLoading(true);

    const res = await fetch("/api/onboarding", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name: companyName.trim() }),
    });
    const { error } = await res.json();
    setLoading(false);

    if (error) {
      console.error("Onboarding API error:", error);
      return alert("Failed to create organization. See console.");
    }

    // 4️⃣ Success → reload into /dashboard
    router.push("/dashboard");
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
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
          disabled={loading || !companyName.trim()}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Creating…" : "Continue"}
        </button>
      </form>
    </div>
  );
}
