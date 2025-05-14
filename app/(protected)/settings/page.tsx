"use client";

import { useSession } from "next-auth/react";
import { useState, ChangeEvent }   from "react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [email, setEmail]             = useState("");
  const [role, setRole]               = useState<"owner" | "admin" | "member">("member");
  const [token, setToken]             = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading]         = useState(false);

  if (status !== "authenticated" || !session.user.organisation_id) {
    return <p>Loading…</p>;
  }

  // session.user.organisation_id is now properly typed
  const orgId = session.user.organisation_id;

  async function sendInvite() {
    setLoading(true);
    setToken(null);

    const currentEmail = email;
    const res = await fetch("/api/invites", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ organisation_id: orgId, email: currentEmail, role }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setToken(data.token);
      setInviteEmail(currentEmail);
      setEmail("");
      alert(`Invite sent!`);
    } else {
      alert(`Error sending invite: ${data.error}`);
    }
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Organization Settings</h1>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Invite a Team Member</h2>

        <input
          type="email"
          placeholder="Colleague’s email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          disabled={loading}
        />

        <select
          value={role}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setRole(e.target.value as "owner" | "admin" | "member")
          }
          className="w-full border rounded px-3 py-2"
          disabled={loading}
        >
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
          <option value="member">Member</option>
        </select>

        <button
          onClick={sendInvite}
          disabled={loading || !email}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Sending…" : "Send Invite"}
        </button>

        {token && (
          <p className="text-sm text-gray-700 break-all">
            Invite link:{" "}
            <a
              href={`${origin}/accept-invite?token=${token}&email=${encodeURIComponent(
                inviteEmail
              )}`}
              className="text-blue-600 underline"
            >
              Accept Invite
            </a>
          </p>
        )}
      </section>
    </div>
  );
}
