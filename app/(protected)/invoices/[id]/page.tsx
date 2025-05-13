// app/(protected)/invoices/[id]/page.tsx
import { notFound } from "next/navigation";
import InvoiceTabs from "./InvoiceTabs";
import { getInvoiceByUUID, type Invoice } from "@/app/lib/db";

/**
 * We leave the props untyped (`any`) so Next’s internal generator
 * can assign whichever `PageProps` flavour it prefers.  Runtime
 * guards keep us safe.
 */
export default async function Page(props: any) {
  const id = props?.params?.id as string | undefined;
  if (!id) return notFound();            // missing dynamic segment → 404

  let invoice: Invoice | null = null;
  try {
    invoice = await getInvoiceByUUID(id);
  } catch {
    /* swallow DB error */
  }

  if (!invoice) return notFound();
  return <InvoiceTabs invoice={invoice} />;
}
