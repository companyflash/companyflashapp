"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter }           from "next/navigation";
import { useState, useEffect } from "react";
import { supabase }            from "@/app/lib/supabaseClient";

// 🛠️ Extend the Session user with our extra fields
type ExtendedUser = {
  name?: string;
  profile_id?: string;
};
type ExtSession = { user?: ExtendedUser };

export default function ProfileSetupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Local form state
  const [name, setName]       = useState("");
  const [loading, setLoading] = useState(false);

  // 1️⃣ Initialize the name once we have session.user.name
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  // 2️⃣ Handle loading or unauthenticated
  if (status === "loading") {
    return <p>Loading…</p>;
  }
  if (!session) {
    // kick them to sign in, then back here
    signIn("google", { callbackUrl: "/profile/setup" });
    return null;
  }

  // 3️⃣ Ensure we have a profile_id
  const ext = session as ExtSession;
  const profileId = ext.user?.profile_id;
  if (!profileId) {
    // something’s off—force them to re-authenticate
    signIn("google", { callbackUrl: "/profile/setup" });
    return null;
  }

  // 4️⃣ Form submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("user_profiles")
      .update({ full_name: name, profile_complete: true })
      .eq("id", profileId);

    setLoading(false);
    if (error) {
      alert("Error saving profile: " + error.message);
      return;
    }

    // 5️⃣ Soft-refresh so ProtectedLayout re-runs and hides the banner
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Complete your profile</h1>
      <p>Please confirm or update your full name:</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Saving…" : "Confirm"}
        </button>
      </form>
    </div>
  );
}
