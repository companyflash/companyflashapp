// app/signup/page.tsx
"use client";

import { useState }                 from "react";
import { useRouter }                from "next/navigation";
import { signIn }                   from "next-auth/react";
import Link                         from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await signIn("credentials", {
      mode:       "signup",
      email,
      password,
      redirect:   false,
      callbackUrl:"/profile/setup",
    });
    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/profile/setup");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <nav className="container mx-auto flex items-center justify-between py-6 px-4">
          <h1 className="text-2xl font-bold">CompanyFlash</h1>
          <Link href="/" className="underline text-white">
            Already have an account? Sign In
          </Link>
        </nav>
        <div className="container mx-auto py-20 px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Create your CompanyFlash account
          </h2>
          <p className="max-w-xl mx-auto text-lg mb-8">
            Sign up with Google or your email to get started.
          </p>
          <div className="max-w-sm mx-auto space-y-6">
            {/* Google Sign Up */}
            <button
              onClick={() =>
                signIn("google", { callbackUrl: `${origin}/profile/setup` })
              }
              className="w-full bg-white text-green-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition"
            >
              Sign up with Google
            </button>

            {/* OR separator */}
            <div className="flex items-center">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-2 text-gray-200">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Email/Password Sign Up */}
            <form onSubmit={handleSignup} className="space-y-4">
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
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full bg-white text-green-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition"
              >
                Create account
              </button>
            </form>
          </div>
        </div>
      </header>
    </div>
  );
}
