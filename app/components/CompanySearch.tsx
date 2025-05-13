// app/components/CompanySearch.tsx
"use client";

import { useState } from "react";
import useSWR from "swr";

interface CompanyMatch {
  company_number: string;
  company_name: string;
  company_status: string;
  date_of_creation: string;
}

interface CompaniesResponse {
  matches: CompanyMatch[];
}

const fetcher = (url: string): Promise<CompaniesResponse> =>
  fetch(url).then((r) => r.json());

export default function CompanySearch() {
  const [query, setQuery] = useState("");
  const { data, isLoading } = useSWR<CompaniesResponse>(
    query.length >= 3
      ? `/api/company-info?name=${encodeURIComponent(query)}`
      : null,
    fetcher,
  );

  const matches: CompanyMatch[] = data?.matches ?? [];

  return (
    <div className="space-y-4 p-6 bg-white rounded shadow">
      <h3 className="text-lg font-semibold">Search Company Data</h3>

      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Start typing a company name…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {isLoading && <p className="text-sm text-gray-500">Searching…</p>}

      {matches.length > 0 && (
        <ul className="space-y-2 text-sm">
          {matches.map((c) => (
            <li key={c.company_number} className="p-3 border rounded bg-gray-50">
              <p className="font-medium">{c.company_name}</p>
              <p className="text-xs text-gray-600">
                #{c.company_number} • {c.company_status} • {c.date_of_creation}
              </p>
            </li>
          ))}
        </ul>
      )}

      {!isLoading && matches.length === 0 && query.length >= 3 && (
        <p className="text-sm text-red-600">No match found.</p>
      )}
    </div>
  );
}
