import { getInvoices, Invoice } from "@/app/lib/db";
import InvoicesClient from "@/app/(protected)/invoices/InvoicesClient";

interface InvoiceRow extends Invoice {
  risk_score: number;
  status: string;
}

export default async function InvoicesPage() {
  const rows = await getInvoices();

  const data: InvoiceRow[] = rows.map((r) => ({
    ...r,
    risk_score: 0,   // placeholder until you calculate this
    status: "pending",
  }));

  return <InvoicesClient initialInvoices={data} />;
}
