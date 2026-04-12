import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentPortfolios } from "@/components/dashboard/RecentPortfolios";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s an overview of your portfolios.</p>
      </div>

      <StatsCards />

      <RecentPortfolios />
    </div>
  );
}