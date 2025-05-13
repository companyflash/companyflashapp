'use client';

import { useState, FormEvent } from 'react';
import DocumentPreview from '@/app/components/DocumentPreview'; // Make sure this path is correct
import { saveInvoice } from './yourSaveFunction';  // Ensure this is the correct path for your save function

type InvoiceResult = {
  extractedFields: {
    invoice_id?: string;
    sort_code?: string;
    account_number?: string;
    payee_name?: string;
    invoice_date?: string | null;
    amount?: number;
  };
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<InvoiceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // for displaying the file preview

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/invoices/extract', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }

      setResult(data);

      // Optional: Add preview for PDF or image
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);

    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (result) {
      // Map the extracted fields to a more consistent format if needed
      const invoiceData = {
        invoice_id: result.extractedFields.invoice_id || '',
        payee_name: result.extractedFields.payee_name || '',
        amount: result.extractedFields.amount || 0,
        sort_code: result.extractedFields.sort_code || '',
        account_number: result.extractedFields.account_number || '',
        invoice_date: result.extractedFields.invoice_date || null,
      };

      // Save the invoice to your database (Supabase)
      saveInvoice(invoiceData);
      alert('Invoice saved successfully');
    }
  };

  const handleReupload = () => {
    // Reset the form for re-uploading
    setFile(null);
    setResult(null);
    setPreviewUrl(null);
    setError(null);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Upload Invoice</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="application/pdf,image/png,image/jpeg"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Upload'}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {previewUrl && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Preview</h2>
          <DocumentPreview fileUrl={previewUrl} />
        </div>
      )}

      {result?.extractedFields && (
        <div className="mt-6 border p-4 rounded bg-white shadow">
          <h2 className="font-semibold mb-2">Extracted Fields</h2>
          <div className="text-sm text-gray-700">
            <p><strong>Invoice ID:</strong> {result.extractedFields.invoice_id}</p>
            <p><strong>Payee Name:</strong> {result.extractedFields.payee_name}</p>
            <p><strong>Sort Code:</strong> {result.extractedFields.sort_code}</p>
            <p><strong>Account Number:</strong> {result.extractedFields.account_number}</p>
            <p><strong>Invoice Date:</strong> {result.extractedFields.invoice_date}</p>
            <p><strong>Amount:</strong> £{result.extractedFields.amount?.toFixed(2)}</p>
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={!result}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          Save Invoice
        </button>

        <button
          onClick={handleReupload}
          className="bg-gray-600 text-white px-4 py-2 ml-4 rounded hover:bg-gray-700"
        >
          Re-upload
        </button>
      </div>
    </div>
  );
}
