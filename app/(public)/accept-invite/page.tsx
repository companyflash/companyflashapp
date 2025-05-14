// app/(public)/accept-invite/page.tsx
"use client";

import { useEffect, useState }          from "react";
import { useSearchParams, useRouter }    from "next/navigation";
import { useSession, signIn, signOut }   from "next-auth/react";

export default function AcceptInvitePage() {
  const params  = useSearchParams();
  const router  = useRouter();
  const token   = params.get("token");
  const email   = params.get("email")?.toLowerCase();
  const { data: session, status } = useSession();

  // for credentials signup
  const [password, setPassword] = useState("");

  // once Google flow completes, fire the API accept
  useEffect(() => {
    if (status !== "authenticated" || !session) return;
    if (session.user.email?.toLowerCase() !== email) {
      // wrong Google account → sign out & loop
      signOut({
        callbackUrl: `/accept-invite?token=${token}&email=${encodeURIComponent(email!)}`,
      });
      return;
    }
    // correct Google user → call your API to insert membership & mark accepted
    fetch(`/api/accept-invite?token=${token}`)
      .then(async (res) => {
        if (res.ok) {
          router.replace("/dashboard");
        } else {
          const body = await res.json().catch(() => null);
          router.replace(`/?error=${body?.error || "invite_failed"}`);
        }
      })
      .catch(() => router.replace("/?error=invite_failed"));
  }, [status, session, token, email, router]);

  // handle email/password form submit
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", {
      mode:       "signup",
      email:      email!,
      password,
      token:      token!,
      redirect:   true,
      callbackUrl:"/dashboard",
    });
    // on failure you'll get redirected to /?error=auth_error
  };

  // loading & validation
  if (status === "loading") {
    return <p className="p-6">Loading…</p>;
  }
  if (!token || !email) {
    router.replace("/?error=invalid_invite");
    return null;
  }

  // Main UI
  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-xl font-semibold">
        You’ve been invited as <strong>{email}</strong>
      </h1>

      {/* ── Google SSO Flow ─────────────────────────────────────────── */}
      {!session && (
        <button
          onClick={() =>
            signIn("google", {
              callbackUrl: `/accept-invite?token=${token}&email=${encodeURIComponent(email)}`,
              login_hint:  email,
            })
          }
          className="w-full bg-blue-600 text-white py-3 rounded"
        >
          Sign in with Google
        </button>
      )}

      {/* ── OR separator ────────────────────────────────────────────── */}
      {!session && (
        <div className="flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>
      )}

      {/* ── Credentials Signup Form ────────────────────────────────── */}
      {!session && (
        <form onSubmit={handleEmailSignup} className="space-y-4">
          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded"
          >
            Create account with Email
          </button>
        </form>
      )}

      {/* ── Processing state for Google flow ───────────────────────── */}
      {session && (
        <p className="text-center text-gray-600">
          Processing your invite…
        </p>
      )}
    </div>
  );
}
