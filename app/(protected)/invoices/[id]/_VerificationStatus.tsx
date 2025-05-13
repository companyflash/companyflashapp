"use client";
import useSWR from "swr";
import type { Invoice } from "@/app/lib/db";

export default function VerificationStatus({ invoice }: { invoice: Invoice }) {
  const { data, isLoading } = useSWR(
    `/api/verification-status?invoiceId=${invoice.id}`,
    (url) => fetch(url).then((r) => r.json()),
  );

  if (isLoading) return <p>Loading verification…</p>;
  if (!data || data.error) return <p>Unable to load verification data.</p>;

  const {
    overallStatus,
    bankAccount,
    nameMatch,
    addressMatch,
    riskScore,
  } = data;

  return (
    <div className="space-y-6 text-sm">
      <h3 className="text-lg font-semibold">Verification Status</h3>
      <p className="text-gray-700">
        Current status of invoice verification checks
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatusRow
          label="Overall Status"
          value={overallStatus.label}
          variant={overallStatus.variant}
        />
        <StatusRow label="Bank Account" value={bankAccount.label} variant={bankAccount.variant} />
        <StatusRow label="Name Match" value={nameMatch.label} variant={nameMatch.variant} />
        <StatusRow label="Address" value={addressMatch.label} variant={addressMatch.variant} />
        <StatusRow label="Risk Score" value={`${riskScore}%`} />
      </div>

      <div className="flex gap-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Verify Invoice
        </button>
        <button className="bg-red-600 text-white px-4 py-2 rounded">
          Reject
        </button>
      </div>
    </div>
  );
}

function StatusRow({
  label,
  value,
  variant = "neutral",
}: {
  label: string;
  value: string;
  variant?: "neutral" | "warning" | "danger" | "success";
}) {
  const colors = {
    neutral: "text-gray-800",
    warning: "text-yellow-600",
    danger: "text-red-600",
    success: "text-green-600",
  };
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase text-gray-500 tracking-wide">
        {label}
      </span>
      <span className={`text-sm font-medium ${colors[variant]}`}>{value}</span>
    </div>
  );
}