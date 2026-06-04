'use client';

import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentPortfolios } from "@/components/dashboard/RecentPortfolios";

function DashboardContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return null; // El useEffect se encargará de la redirección
  }

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

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Cargando...</div>}>
      <DashboardContent />
    </Suspense>
  );
}