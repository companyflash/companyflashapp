"use client";

import Link from "next/link";
import { FileText, CalendarDays, Banknote } from "lucide-react";

export type Invoice = {
  id: number;
  invoice_id: string;
  payee_name: string;
  amount: number;
  invoice_date: string | null;
};

export default function InvoiceCard({ invoice }: { invoice: Invoice }) {
  return (
    <Link
      href={`/invoices/${invoice.id}`}
      className="block bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition p-4 space-y-3"
    >
      <div className="flex items-center space-x-2">
        <FileText className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          {invoice.invoice_id}
        </h3>
      </div>

      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <CalendarDays className="w-4 h-4 text-gray-500" />
        <span>{invoice.invoice_date || "No date"}</span>
      </div>

      <p className="text-sm text-gray-700">
        {invoice.payee_name || "Unknown payee"}
      </p>

      <div className="flex items-center space-x-2 text-sm text-gray-700">
        <Banknote className="w-4 h-4 text-green-600" />
        <span>£{invoice.amount.toFixed(2)}</span>
      </div>
    </Link>
  );
}
