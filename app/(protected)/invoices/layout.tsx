// app/(protected)/invoices/layout.tsx
export const metadata = {
  title: "Invoices • CompanyFlash",
  description: "Manage all your invoices in one place",
};

export default function InvoicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Wrap with a plain fragment or a <section> if you need styling
  return <>{children}</>;
}
