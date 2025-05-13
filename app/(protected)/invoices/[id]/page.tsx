import { notFound } from "next/navigation";
import InvoiceTabs from "./InvoiceTabs";
import { getInvoiceByUUID, type Invoice } from "@/app/lib/db";

export default async function Page({
  params,
}: {
  /** OPTIONAL to satisfy Next’s internal PageProps */
  params?: { id: string };
}) {
  // Guard for the “should never happen” case
  if (!params?.id) return notFound();

  let invoice: Invoice | null;
  try {
    invoice = await getInvoiceByUUID(params.id);
  } catch {
    invoice = null;
  }

  if (!invoice) return notFound();
  return <InvoiceTabs invoice={invoice} />;
}
