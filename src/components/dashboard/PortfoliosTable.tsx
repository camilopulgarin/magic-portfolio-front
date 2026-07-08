'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { success, error as toastError } from '@/hooks/use-toast';
import { Pagination } from '@/components/ui/pagination';
import type { Portfolio, PaginationMeta } from '@/types/portfolio';

function MoreVertical(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

function Edit(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}

function Trash(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function Copy(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function ExternalLink(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

interface PortfoliosTableProps {
  portfolios: Portfolio[];
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onDelete: (id: string) => Promise<void>;
  className?: string;
}

export function PortfoliosTable({
  portfolios,
  pagination,
  onPageChange,
  onPageSizeChange,
  onDelete,
  className,
}: PortfoliosTableProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCopyUrl = async (portfolio: Portfolio) => {
    if (!portfolio.publicUrl) {
      toastError('Este portafolio no tiene URL pública');
      return;
    }
    const url = `${window.location.origin}${portfolio.publicUrl}`;
    await navigator.clipboard.writeText(url);
    success('URL copiada al portapapeles');
    setOpenMenu(null);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
      success('Portafolio eliminado correctamente');
    } catch {
      toastError('Error al eliminar el portafolio');
    } finally {
      setDeletingId(null);
      setOpenMenu(null);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Plantilla
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Creado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actualizado
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {portfolios.map((portfolio) => (
                <tr key={portfolio.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4">
                    <Link
                      href={`/dashboard/portfolios/${portfolio.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {portfolio.name}
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-muted-foreground capitalize">
                      {portfolio.template === 'creative' ? 'Creativo' : 'Formal'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        portfolio.status === 'published'
                          ? 'bg-green-400/10 text-green-400'
                          : 'bg-yellow-400/10 text-yellow-400'
                      )}
                    >
                      {portfolio.status === 'published' ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(portfolio.createdAt)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(portfolio.updatedAt)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setOpenMenu(openMenu === portfolio.id ? null : portfolio.id)
                        }
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        disabled={deletingId === portfolio.id}
                      >
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>

                      {openMenu === portfolio.id && (
                        <div className="absolute right-0 top-full mt-1 w-44 rounded-lg bg-card border border-border shadow-lg overflow-hidden z-10">
                          <Link
                            href={`/dashboard/portfolios/${portfolio.id}`}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                            onClick={() => setOpenMenu(null)}
                          >
                            <ExternalLink className="w-4 h-4" />
                            Ver
                          </Link>
                          <Link
                            href={`/dashboard/portfolios/${portfolio.id}/edit`}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                            onClick={() => setOpenMenu(null)}
                          >
                            <Edit className="w-4 h-4" />
                            Editar
                          </Link>
                          <button
                            onClick={() => handleCopyUrl(portfolio)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                            Copiar URL
                          </button>
                          <button
                            onClick={() => handleDelete(portfolio.id)}
                            disabled={deletingId === portfolio.id}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors disabled:opacity-50"
                          >
                            <Trash className="w-4 h-4" />
                            {deletingId === portfolio.id ? 'Eliminando...' : 'Eliminar'}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && onPageChange && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
          pageSize={pagination.pageSize}
          onPageSizeChange={onPageSizeChange}
          totalItems={pagination.total}
        />
      )}
    </div>
  );
}
