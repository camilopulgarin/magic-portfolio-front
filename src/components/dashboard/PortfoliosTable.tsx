"use client";

import { useCallback } from "react";
import Link from "next/link";
import { DataTable, tableIcons } from "@/components/ui/data-table";
import { success, error as toastError } from "@/hooks/use-toast";
import type { Portfolio, PaginationMeta } from "@/types/portfolio";
import type { ColumnDef, RowAction, BadgeConfig } from "@/types/table";

// ─── Column Definitions ─────────────────────────────────────────────────────

const portfolioColumns: ColumnDef<Portfolio>[] = [
  {
    key: "name",
    header: "Nombre",
    accessor: "name",
    renderCell: (_value, row) => (
      <Link
        href={`/dashboard/portfolios/${row.id}`}
        className="font-medium text-foreground hover:text-primary transition-colors"
      >
        {row.name}
      </Link>
    ),
  },
  {
    key: "isPublic",
    header: "Visibilidad",
    accessor: "isPublic",
    type: "badge",
  },
  {
    key: "createdAt",
    header: "Creado",
    accessor: "createdAt",
    type: "date",
  },
  {
    key: "updatedAt",
    header: "Actualizado",
    accessor: "updatedAt",
    type: "date",
  },
];

// ─── Badge Config ───────────────────────────────────────────────────────────

const portfolioBadgeConfig: Record<string, BadgeConfig> = {
  isPublic: {
    variants: {
      true: {
        label: "Público",
        className: "bg-green-400/10 text-green-400",
      },
      false: {
        label: "Privado",
        className: "bg-yellow-400/10 text-yellow-400",
      },
    },
  },
};

// ─── Component Props ────────────────────────────────────────────────────────

interface PortfoliosTableProps {
  portfolios: Portfolio[];
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onDelete: (id: string) => Promise<void>;
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

/**
 * Tabla de portafolios construida sobre el componente DataTable genérico.
 *
 * Define columnas, badges y acciones específicas para la entidad Portfolio,
 * reutilizando toda la lógica de paginación, menú contextual y estados de carga.
 *
 * @example
 * ```tsx
 * <PortfoliosTable
 *   portfolios={portfolios}
 *   pagination={pagination}
 *   onPageChange={handlePageChange}
 *   onPageSizeChange={handlePageSizeChange}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export function PortfoliosTable({
  portfolios,
  pagination,
  onPageChange,
  onPageSizeChange,
  onDelete,
  className,
}: PortfoliosTableProps) {
  const handleCopyUrl = useCallback(async (portfolio: Portfolio) => {
    if (!portfolio.publicUrl) {
      toastError("Este portafolio no tiene URL pública");
      return;
    }
    const url = `${window.location.origin}${portfolio.publicUrl}`;
    await navigator.clipboard.writeText(url);
    success("URL copiada al portapapeles");
  }, []);

  const handleDelete = useCallback(
    async (portfolio: Portfolio) => {
      await onDelete(portfolio.id);
    },
    [onDelete],
  );

  const actions: RowAction<Portfolio>[] = [
    {
      key: "view",
      label: "Ver",
      icon: <tableIcons.ExternalLink className="w-4 h-4" />,
      onClick: (row) => {
        window.open(`/dashboard/portfolios/${row.id}`, "_blank");
      },
    },
    {
      key: "edit",
      label: "Editar",
      icon: <tableIcons.Edit className="w-4 h-4" />,
      onClick: (row) => {
        window.location.href = `/dashboard/portfolios/${row.id}/edit`;
      },
    },
    {
      key: "copy-url",
      label: "Copiar URL",
      icon: <tableIcons.Copy className="w-4 h-4" />,
      onClick: handleCopyUrl,
      visible: (row) => !!row.publicUrl,
    },
    {
      key: "delete",
      label: "Eliminar",
      icon: <tableIcons.Trash className="w-4 h-4" />,
      onClick: handleDelete,
      destructive: true,
      requireConfirmation: true,
      confirmationMessage:
        "¿Estás seguro de que deseas eliminar este portafolio? Esta acción no se puede deshacer.",
      loadingLabel: "Eliminando...",
    },
  ];

  return (
    <DataTable
      data={portfolios}
      columns={portfolioColumns}
      actions={actions}
      pagination={pagination}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      paginationLabel="portafolios"
      badgeConfig={portfolioBadgeConfig}
      emptyMessage="No hay portafolios para mostrar"
      className={className}
      rowKey={(row) => row.id}
      onRowClick={(row) => {
        window.location.href = `/dashboard/portfolios/${row.id}`;
      }}
    />
  );
}
