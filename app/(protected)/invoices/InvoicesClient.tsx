"use client";

import { useState, ChangeEvent } from "react";
import type { Column } from "@/app/components/Table";
import Link from "next/link";
import { Invoice } from "@/app/lib/db";
import Table from "@/app/components/Table";
import { Input } from "@/app/components/ui/input";
import { Select, SelectItem } from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";

/* ─────────── Types ─────────── */
export type InvoiceRow = Invoice & {
  risk_score: number;
  status: string;
};

/* ─────────── Column config ─────────── */
const columns: Column<InvoiceRow>[] = [
  {
  header: "Invoice ID",
  accessor: "invoice_id",
  render: (_value, row) =>
    row ? (                                        // narrow the type
      <Link href={`/invoices/${row.id}`}>{row.invoice_id}</Link>
    ) : null,
},
  {
    header: "Date",
    accessor: "invoice_date",
    render: (value) =>
      typeof value === "string"
        ? new Date(value).toLocaleDateString()
        : "N/A",
  },
  { header: "Company", accessor: "payee_name" },
  {
    header: "Amount",
    accessor: "amount",
    render: (value) =>
      typeof value === "number" ? `£${value.toFixed(2)}` : "—",
  },
  {
    header: "Risk Score",
    accessor: "risk_score",
    render: (value) =>
      typeof value === "number" ? `${value}%` : "—",
  },
  { header: "Status", accessor: "status" },
];

interface Props {
  initialInvoices: InvoiceRow[];
}

export default function InvoicesClient({ initialInvoices }: Props) {
  const [invoices] = useState(initialInvoices);
  const [filtered, setFiltered] = useState(initialInvoices);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [dateRange, setDateRange] = useState("7");
  const [riskFilter, setRiskFilter] = useState("All");

  /* ─────────── Filtering logic ─────────── */
  const applyFilters = () => {
    let result = [...invoices];
    if (search) result = result.filter((i) => i.invoice_id.includes(search));
    if (statusFilter !== "All") result = result.filter((i) => i.status === statusFilter);
    if (companyFilter !== "All") result = result.filter((i) => i.payee_name === companyFilter);
    // TODO: dateRange & riskFilter
    setFiltered(result);
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setCompanyFilter("All");
    setDateRange("7");
    setRiskFilter("All");
    setFiltered(invoices);
  };

  /* ─────────── UI ─────────── */
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <Button asChild>
          <Link href="/invoices/upload">Upload New Invoice</Link>
        </Button>
      </div>

      <p className="text-gray-600">
        A list of all invoices including their ID, date, company, amount, and verification status.
      </p>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded shadow">
        <Input
          placeholder="Search Invoice ID..."
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectItem value="All">All</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="verified">Verified</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </Select>

        <Select value={companyFilter} onValueChange={setCompanyFilter}>
          <SelectItem value="All">All</SelectItem>
          {/* TODO: populate companies */}
        </Select>

        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectItem value="7">Last 7 days</SelectItem>
          <SelectItem value="30">Last 30 days</SelectItem>
          <SelectItem value="90">Last 90 days</SelectItem>
        </Select>

        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectItem value="All">All</SelectItem>
          <SelectItem value="0-25">0–25%</SelectItem>
          <SelectItem value="25-50">25–50%</SelectItem>
          <SelectItem value="50-75">50–75%</SelectItem>
          <SelectItem value="75-100">75–100%</SelectItem>
        </Select>

        <div className="flex space-x-2 col-span-4 justify-end">
          <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
          <Button onClick={applyFilters}>Apply Filters</Button>
        </div>
      </div>

      {/* Table */}
      <Table<InvoiceRow> columns={columns} data={filtered} />
    </div>
  );
}
