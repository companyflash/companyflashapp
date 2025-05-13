"use client";
import useSWR from "swr";
import type { Invoice } from "@/app/lib/db";

export default function CompanyInfo({ invoice }: { invoice: Invoice }) {
  const { data, isLoading } = useSWR(
    () =>
      invoice.payee_name
        ? `/api/company-info?name=${encodeURIComponent(invoice.payee_name)}`
        : null,
    (url) => fetch(url).then((r) => r.json()),
  );

  if (isLoading) return <p>Loading company data…</p>;

  if (!data || data.error) {
    return (
      <div className="space-y-4 text-sm">
        <h3 className="text-lg font-semibold">Company Verification</h3>
        <p>No company information found for “{invoice.payee_name}”.</p>
        <p>
          No company with this name was found in Companies House records. This
          could be a risk factor if the company is purporting to be registered.
        </p>
        <a
          href={`https://find-and-update.company-information.service.gov.uk/search?q=${encodeURIComponent(
            invoice.payee_name || "",
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Search Companies House
        </a>
      </div>
    );
  }

  const profile = data.profile;

  return (
    <div className="space-y-4 text-sm">
      <h3 className="text-lg font-semibold">Company Verification</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Registered Name" value={profile.name} />
        <Field label="Company #" value={profile.company_number} />
        <Field label="Status" value={profile.status} />
        <Field label="Incorporated" value={profile.incorporation_date} />
        <Field label="Address" value={profile.registered_address} span={2} />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  span = 1,
}: {
  label: string;
  value: string | null;
  span?: 1 | 2;
}) {
  return (
    <div className={`flex flex-col ${span === 2 ? "sm:col-span-2" : ""}`}>
      <span className="text-xs uppercase text-gray-500 tracking-wide">
        {label}
      </span>
      <span className="text-sm font-medium text-gray-800">
        {value || "—"}
      </span>
    </div>
  );
}
