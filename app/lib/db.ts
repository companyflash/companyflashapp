import { createClient } from "@supabase/supabase-js";

// These must exist **on the server only**
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPA_SERVICE_ROLE_KEY) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPA_SERVICE_ROLE_KEY env var");
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPA_SERVICE_ROLE_KEY
);

export interface Invoice {
  id: string;
  invoice_id: string;
  payee_name: string;
  account_sort_code: string;
  account_number: string;
  amount: number;
  invoice_date: string | null;
  raw_extracted_json: Record<string, unknown>;
}

export async function getInvoices(): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from("invoice_data")
    .select(
      "id, invoice_id, payee_name, account_sort_code, account_number, amount, invoice_date"
    );
  if (error) throw error;
  return data as Invoice[];
}

// Add a new helper or replace the old one
export async function getInvoiceByUUID(id: string): Promise<Invoice> {
  const { data, error } = await supabase
    .from("invoice_data")
    .select("*")
    .eq("id", id)          // ← query on the primary key
    .single();

  if (error || !data) throw error || new Error("Invoice not found");
  return data as Invoice;
}

