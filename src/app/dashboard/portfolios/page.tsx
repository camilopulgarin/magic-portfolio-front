"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { PortfoliosTable } from "@/components/dashboard/PortfoliosTable";
import { EmptyPortfoliosState } from "@/components/dashboard/EmptyPortfoliosState";
import { portfolioService } from "@/lib/services/portfolio";
import { error as toastError } from "@/hooks/use-toast";
import type { Portfolio, PaginationMeta } from "@/types/portfolio";

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

export default function PortfoliosPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 5,
    total: 0,
    totalPages: 0,
  });

  const fetchPortfolios = useCallback(
    async (page: number, pageSize: number) => {
      setIsLoading(true);
      try {
        const response = await portfolioService.getPortfolios(page, pageSize);
        setPortfolios(response.data);
        setPagination(response.meta);
      } catch (err) {
        console.error("Error al cargar portafolios:", err);
        toastError("No se pudieron cargar los portafolios");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const handleDelete = async (id: string) => {
    await portfolioService.deletePortfolio(id);
    fetchPortfolios(pagination.page, pagination.pageSize);
  };

  const handlePageChange = (page: number) => {
    fetchPortfolios(page, pagination.pageSize);
  };

  const handlePageSizeChange = (pageSize: number) => {
    fetchPortfolios(1, pageSize);
  };

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    let cancelled = false;

    portfolioService
      .getPortfolios(1, 5)
      .then((response) => {
        if (!cancelled) {
          setPortfolios(response.data);
          setPagination(response.meta);
        }
      })
      .catch((err) => {
        console.error("Error al cargar portafolios:", err);
        toastError("No se pudieron cargar los portafolios");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Cargando portafolios...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Mis Portafolios
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra y organiza todos tus portafolios en un solo lugar.
          </p>
        </div>

        <Link href="/dashboard/portfolios/new">
          <Button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground font-bold shadow-lg hover:brightness-110 active:scale-[0.98] transition-all">
            <Plus className="w-4 h-4" />
            Crear Portafolio
          </Button>
        </Link>
      </div>

      {portfolios.length === 0 && pagination.page === 1 ? (
        <EmptyPortfoliosState />
      ) : (
        <PortfoliosTable
          portfolios={portfolios}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
