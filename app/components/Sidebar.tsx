// components/Sidebar.tsx  (server component)
import Link from "next/link";
import { Home, FileText, CheckCircle, ShieldAlert, Users, Settings as Cog } from "lucide-react";

const items = [
  { label: "Dashboard", href: "/", icon: Home },
  { label: "Invoices", href: "/invoices", icon: FileText },
  { label: "Verifications", href: "/verifications", icon: CheckCircle },
  { label: "Risk Management", href: "/risk-management", icon: ShieldAlert },
  { label: "Companies", href: "/companies", icon: Users },
  { label: "Settings", href: "/settings", icon: Cog },
];

export default function Sidebar() {
  return (
    <nav className="w-64 bg-gray-800 text-white flex-shrink-0">
      <div className="p-6 text-2xl font-bold">SecureInvoice</div>
      <ul className="space-y-1">
        {items.map(({ label, href, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex items-center px-6 py-2 hover:bg-gray-700"
            >
              <Icon className="mr-3" size={18} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
