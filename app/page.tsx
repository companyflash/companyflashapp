// app/page.tsx
"use client";

import { useState }                         from "react";
import { useSession, signIn, signOut }      from "next-auth/react";
import { ShieldCheck, CreditCard, Zap }     from "lucide-react";
import Link                                 from "next/link";

export default function HomePage() {
  const { data: session, status } = useSession();
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  // sign-in form state
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await signIn("credentials", {
      mode:       "login",
      email,
      password,
      redirect:   true,
      callbackUrl:`${origin}/dashboard`,
    });
    // on failure → /?error=auth_error
  };

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <nav className="container mx-auto flex items-center justify-between py-6 px-4">
          <h1 className="text-2xl font-bold">CompanyFlash</h1>
          {session ? (
            <div className="space-x-4">
              <Link
                href="/dashboard"
                className="bg-white text-blue-600 font-semibold px-4 py-2 rounded"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: `${origin}/` })}
                className="underline text-white"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/signup"
              className="bg-white text-blue-600 font-semibold px-4 py-2 rounded"
            >
              Need an account? Sign Up
            </Link>
          )}
        </nav>

        <div className="container mx-auto py-20 px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Stop Invoice Fraud Before It Happens
          </h2>
          <p className="max-w-xl mx-auto text-lg mb-8">
            Real-time company health scores, bank-account verification, and
            seamless inbox integration—so you can pay with confidence.
          </p>

          {!session && (
            <div className="max-w-sm mx-auto space-y-6">
              {/* Google SSO */}
              <button
                onClick={() =>
                  signIn("google", { callbackUrl: `${origin}/dashboard` })
                }
                className="w-full bg-white text-blue-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition"
              >
                Sign in with Google
              </button>

              {/* OR separator */}
              <div className="flex items-center">
                <hr className="flex-grow border-gray-300" />
                <span className="mx-2 text-gray-200">or</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              {/* Email/Password Sign In */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-left mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded border border-gray-300"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-left mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded border border-gray-300"
                  />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-white text-blue-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition"
                >
                  Sign in with Email
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-lg shadow">
            <ShieldCheck size={48} className="mx-auto text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Risk Scoring</h3>
            <p className="text-gray-600">
              Get instant RED/⚠️/🟢 indicators powered by Companies House
              streams.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <CreditCard size={48} className="mx-auto text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Account Verification</h3>
            <p className="text-gray-600">
              Catch payee mismatches with TrueLayer’s Confirmation-of-Payee API.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <Zap size={48} className="mx-auto text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Inbox & Dashboard</h3>
            <p className="text-gray-600">
              Seamless Gmail add-on and web dashboard keep everything in one
              place.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 container mx-auto px-4 text-center">
        <h3 className="text-3xl font-bold mb-6">Trusted by Finance Teams</h3>
        <blockquote className="max-w-2xl mx-auto italic text-gray-700">
          “CompanyFlash cut our supplier risk checks in half—and flagged a
          critical account-switch scam before we paid. Game-changer!”
          <footer className="mt-4 font-semibold">— Sarah, Head of AP</footer>
        </blockquote>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} CompanyFlash. All rights reserved.</p>
          <div className="space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
