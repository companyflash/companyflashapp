import { ReactNode } from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  // 1) Fetch the session
  const session = await getServerSession(authOptions);

  // 2) Not signed in → landing page
  if (!session) {
    redirect("/");
  }

  // 3) Haven’t set company name → onboarding
  if (!session.user.company_name) {
    redirect("/onboarding");
  }

  // 4) All good → show the protected UI
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
