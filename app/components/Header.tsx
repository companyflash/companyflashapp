"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link                             from "next/link";
import { Bell, Search }                from "lucide-react";

export default function Header() {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <>
      {/* 1️⃣ Non-blocking reminder banner */}
      {session?.user && !session.user.profile_complete && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 text-yellow-800 text-sm text-center">
          Please{" "}
          <Link href="/profile/setup" className="underline font-semibold">
            complete your profile
          </Link>{" "}
          to finish setup.
        </div>
      )}

      {/* 2️⃣ Main header bar */}
      <header className="flex items-center justify-between bg-white p-4 shadow">
        <div className="flex items-center space-x-2 bg-gray-100 rounded px-3">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search invoices, companies…"
            className="bg-transparent focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-4">
          <Bell size={20} />
          {session ? (
            <>
              <span className="text-sm">Hello, {session.user.name}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white"
            >
              Sign In
            </button>
          )}
        </div>
      </header>
    </>
  );
}
