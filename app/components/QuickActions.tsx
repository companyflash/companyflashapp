// components/QuickActions.tsx
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Plus, Check, Search as SearchIcon } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="flex space-x-4 mb-6">
      <Link href="/invoices/upload">
        <Button variant="outline">
          <Plus size={16} className="mr-2" />
          Upload Invoice
        </Button>
      </Link>
      <Link href="/invoices/pending/next">
        <Button variant="outline">
          <Check size={16} className="mr-2" />
          Verify Next
        </Button>
      </Link>
      <Link href="/companies/test">
        <Button variant="outline">
          <SearchIcon size={16} className="mr-2" />
          Test Company
        </Button>
      </Link>
    </div>
  );
}