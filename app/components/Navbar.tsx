import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full px-6 py-4 border-b flex justify-between items-center bg-white">
      <Link href="/">
        <span className="text-xl font-semibold tracking-tight">CompanyFlash</span>
      </Link>
      <div className="space-x-4">
        <Link href="/" className="hover:underline text-sm font-medium">
          Dashboard
        </Link>
        <Link href="/upload" className="hover:underline text-sm font-medium">
          Upload Invoice
        </Link>
        <Link href="/invoices" className="hover:underline text-sm font-medium">
          All Invoices
        </Link>
      </div>
    </nav>
  );
}
