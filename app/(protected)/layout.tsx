// app/(protected)/layout.tsx
import { getServerSession } from "next-auth";
import { redirect }          from "next/navigation";
import Sidebar               from "@/app/components/Sidebar";
import Header                from "@/app/components/Header";
import { authOptions }       from "@/app/lib/auth"; // your NextAuth options
import OnboardingGuard from "@/app/components/OnboardingGuard";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");  // not signed in → landing
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
        <main className="flex-1 overflow-y-auto p-6">
+         <OnboardingGuard>
+           {children}
+         </OnboardingGuard>
        </main>
      </div>
    </div>
  );
}
