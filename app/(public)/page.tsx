// app/(public)/page.tsx
"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter }          from "next/navigation";
import { useEffect }          from "react";

export default function LandingPage() {
  const { status } = useSession();
  const router     = useRouter();

  // If already signed in, send to invoices
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 text-white px-4">
      <h1 className="text-5xl font-bold mb-4">SecureInvoice</h1>
      <p className="text-lg max-w-xl text-center mb-8">
        Upload, verify, and manage your invoices securely with AI-powered extraction.
      </p>
      <button
        onClick={() => signIn("google")}
        className="bg-white text-blue-600 font-medium px-6 py-3 rounded shadow-lg hover:bg-gray-100"
      >
        Sign In with Google
      </button>
    </div>
  );
}
