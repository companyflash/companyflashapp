// app/(protected)/dashboard/page.tsx
import MetricCard from "@/app/components/MetricCard";
import ActivityList from "@/app/components/ActivityList";
import ChartCard from "@/app/components/ChartCard";
import CompanySearch from "@/app/components/CompanySearch";
import QuickActions from "@/app/components/QuickActions";
import Table from "@/app/components/Table";
import {
  getDashboardMetrics,
  getRecentActivity,
  getHighRiskInvoices,
  getInvoicesOverTime,
  getRiskAlertsOverTime,
} from "@/app/lib/dashboard";

export default async function DashboardPage() {
  // Fetch your data server-side
  const metrics = await getDashboardMetrics();
  const recent  = await getRecentActivity();
  const riskTop = await getHighRiskInvoices();
  const chartData1 = await getInvoicesOverTime();
  const chartData2 = await getRiskAlertsOverTime();

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard {...metrics.processed} />
        <MetricCard {...metrics.pending} />
        <MetricCard {...metrics.highRisk} />
        <MetricCard {...metrics.verifiedCompanies} />
      </div>
      
      <QuickActions />

      <CompanySearch />

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Invoices per Day" data={chartData1} />
        <ChartCard title="Risk Alerts per Day" data={chartData2} />
      </div>

      <div className="md:grid md:grid-cols-2 md:gap-6">
        <div className="col-span-1">
          <ActivityList items={recent} />
        </div>
        <div className="col-span-1">
          <Table columns={[/*…*/]} data={riskTop} title="High Risk Invoices" />
        </div>
      </div>
    </div>
  );
}
