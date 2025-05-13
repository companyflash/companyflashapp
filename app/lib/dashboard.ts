import { ReactNode } from "react";

// Example metric types
export interface Metrics {
  processed: { title: string; value: number; actionLabel: string; href: string };
  pending:   { title: string; value: number; actionLabel: string; href: string };
  highRisk:  { title: string; value: number; actionLabel: string; href: string };
  verifiedCompanies: { title: string; value: number; actionLabel: string; href: string };
}

// Fetch dashboard metrics (replace with real DB calls)
export async function getDashboardMetrics(): Promise<Metrics> {
  return {
    processed:       { title: "Invoices Processed", value: 0, actionLabel: "View all", href: "/invoices" },
    pending:         { title: "Pending Verifications", value: 0, actionLabel: "Review now", href: "/verifications" },
    highRisk:        { title: "High-Risk Invoices", value: 0, actionLabel: "Investigate", href: "/risk-management" },
    verifiedCompanies:{ title: "Verified Companies", value: 0, actionLabel: "View directory", href: "/companies" },
  };
}

// Recent activity item
export interface ActivityItem { icon: ReactNode; text: string; timestamp: string; }
export async function getRecentActivity(): Promise<ActivityItem[]> {
  return [
    { icon: "📝", text: "No recent activity", timestamp: "" }
  ];
}

// High risk invoices stub
export interface RiskInvoice { id: string; invoice_id: string; company: string; risk_score: number; status: string; }
export async function getHighRiskInvoices(): Promise<RiskInvoice[]> {
  return [];
}

// Chart data stub
export interface DataPoint { name: string; value: number; }
export async function getInvoicesOverTime(): Promise<DataPoint[]> {
  return [];
}
export async function getRiskAlertsOverTime(): Promise<DataPoint[]> {
  return [];
}
