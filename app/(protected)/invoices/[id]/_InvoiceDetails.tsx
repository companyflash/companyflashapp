"use client";

import Image from "next/image";
import type { Invoice as BaseInvoice } from "@/app/lib/db";

type Invoice = BaseInvoice & { image_url?: string | null }; // ① extend safely

export default function InvoiceDetailsView({ invoice }: { invoice: Invoice }) {
  const meta = [
    { label: "Invoice Number", value: invoice.invoice_id },
    { label: "Date", value: invoice.invoice_date },
    { label: "Amount", value: `£${invoice.amount.toFixed(2)}` },
    { label: "Company", value: invoice.payee_name },
  ];

  const imageUrl = invoice.image_url ?? undefined;          // ② alias once

  return (
    <div className="space-y-6">
      {/* summary chip row */}
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="px-3 py-1 bg-gray-100 rounded-full font-medium">
          #{invoice.invoice_id}
        </span>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">
          pending
        </span>
        {invoice.invoice_date && (
          <span className="px-3 py-1 bg-gray-100 rounded-full font-medium">
            {new Date(invoice.invoice_date).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        )}
      </div>

      {/* meta grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {meta.map((m) => (
          <div key={m.label} className="flex flex-col">
            <span className="text-xs uppercase text-gray-500 tracking-wide">
              {m.label}
            </span>
            <span className="text-sm font-medium text-gray-800">
              {m.value || "—"}
            </span>
          </div>
        ))}
      </div>

      {/* invoice image if available */}
      {imageUrl && (                                         /* ③ no ts‑comment needed */
        <div className="mt-6">
          <Image
            src={imageUrl}
            alt="Uploaded invoice"
            width={800}
            height={1000}
            className="rounded border"
          />
        </div>
      )}
    </div>
  );
}
