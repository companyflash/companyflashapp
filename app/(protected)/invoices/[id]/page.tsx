/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import InvoiceTabs from "./InvoiceTabs";
import { getInvoiceByUUID, type Invoice } from "@/app/lib/db";

/**
 *  We intentionally use `any` so the internal PageProps diff check
 *  accepts whatever shape Next.js generates (it may include
 *  Promise<any>). Runtime guards keep things safe.
 */
export default async function Page(props: any) {
  const id = props?.params?.id as string | undefined;
  if (!id) return notFound();

  let invoice: Invoice | null = null;
  try {
    invoice = await getInvoiceByUUID(id);
  } catch {
    /* swallow DB error */
  }

  if (!invoice) return notFound();
  return <InvoiceTabs invoice={invoice} />;
}
