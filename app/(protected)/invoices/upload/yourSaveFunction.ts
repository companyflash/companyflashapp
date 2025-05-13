// app/upload/yourSaveFunction.ts

// Define the Invoice type here
type Invoice = {
  invoice_id: string;
  payee_name: string;
  amount: number;
  sort_code: string;
  account_number: string;
  invoice_date: string | null;
};

export const saveInvoice = (invoice: Invoice) => {
  console.log("Saving invoice:", invoice);
  // Implement logic for saving the invoice to Supabase or wherever needed
};