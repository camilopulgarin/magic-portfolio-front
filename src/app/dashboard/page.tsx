import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentPortfolios } from "@/components/dashboard/RecentPortfolios";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Panel</h1>
        <p className="text-muted-foreground mt-1">Bienvenido de nuevo, aquí tienes un resumen de tus portafolios.</p>
      </div>

      <StatsCards />

      <RecentPortfolios />
    </div>
  );
}