'use client';

import { useState, useCallback, memo } from 'react';
import { cn } from '@/lib/utils';
import { success, error as toastError } from '@/hooks/use-toast';
import { Pagination } from '@/components/ui/pagination';
import type {
  DataTableProps,
  ColumnDef,
  RowAction,
  BadgeConfig,
} from '@/types/table';

// ─── Icons ──────────────────────────────────────────────────────────────────

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

function EditIcon(props: React.SVGProps<SVGSVGElement>) {
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

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
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

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
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

function ExternalLinkIcon(props: React.SVGProps<SVGSVGElement>) {
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

export const tableIcons = {
  MoreVertical,
  Edit: EditIcon,
  Trash: TrashIcon,
  Copy: CopyIcon,
  ExternalLink: ExternalLinkIcon,
};

// ─── Utilities ──────────────────────────────────────────────────────────────

/**
 * Formatea una cadena de fecha ISO a DD/MM/YYYY.
 */
function formatDate(dateString: string, format?: string): string {
  const date = new Date(dateString);
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();

  if (format === 'YYYY-MM-DD') return `${year}-${month}-${day}`;
  return `${day}/${month}/${year}`;
}

/**
 * Resuelve un valor anidado usando una ruta tipo "user.name".
 */
function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((current, key) => {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

// ─── Default Cell Renderer ──────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderDefaultCell<T extends Record<string, any>>(
  column: ColumnDef<T>,
  row: T,
  badgeConfig?: Record<string, BadgeConfig>
): React.ReactNode {
  if (column.renderCell) {
    const value = column.getValue ? column.getValue(row) : getNestedValue(row, column.accessor as string);
    return column.renderCell(value, row);
  }

  const value = column.getValue
    ? column.getValue(row)
    : getNestedValue(row, column.accessor as string);

  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">—</span>;
  }

  switch (column.type) {
    case 'date':
      return (
        <span className="text-sm text-muted-foreground">
          {formatDate(String(value), column.format)}
        </span>
      );

    case 'badge': {
      const config = badgeConfig?.[column.key];
      if (config) {
        const variant = config.variants[String(value)] ?? config.default;
        if (variant) {
          return (
            <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variant.className)}>
              {variant.label}
            </span>
          );
        }
      }
      return <span className="text-sm text-muted-foreground">{String(value)}</span>;
    }

    case 'link':
      return (
        <a
          href={String(value)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          {String(value)}
        </a>
      );

    default:
      return <span className="text-sm text-muted-foreground">{String(value)}</span>;
  }
}

// ─── Row Action Component ───────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface RowActionsMenuProps<T extends Record<string, any>> {
  actions: RowAction<T>[];
  row: T;
  openMenu: boolean;
  onClose: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RowActionsMenu<T extends Record<string, any>>({ actions, row, openMenu, onClose }: RowActionsMenuProps<T>) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAction = useCallback(
    async (action: RowAction<T>) => {
      if (action.requireConfirmation && action.confirmationMessage) {
        const confirmed = window.confirm(action.confirmationMessage);
        if (!confirmed) return;
      }

      setLoadingAction(action.key);
      try {
        await action.onClick(row);
        success(`${action.label} completado`);
      } catch {
        toastError(`Error al ejecutar: ${action.label}`);
      } finally {
        setLoadingAction(null);
        onClose();
      }
    },
    [row, onClose]
  );

  const visibleActions = actions.filter(
    (action) => !action.visible || action.visible(row)
  );

  if (visibleActions.length === 0) return null;

  return (
    <div className="relative inline-block">
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="p-2 rounded-lg hover:bg-muted transition-colors"
        disabled={loadingAction !== null}
      >
        <MoreVertical className="w-4 h-4 text-muted-foreground" />
      </button>

      {openMenu && (
        <div className="absolute right-0 top-full mt-1 w-48 rounded-lg bg-card border border-border shadow-lg overflow-hidden z-10">
          {visibleActions.map((action) => {
            const isLoading = loadingAction === action.key;
            const isDisabled = action.disabled?.(row) ?? false;

            return (
              <button
                key={action.key}
                onClick={(e) => { e.stopPropagation(); handleAction(action); }}
                disabled={isDisabled || isLoading}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors',
                  action.destructive
                    ? 'text-destructive hover:bg-muted'
                    : 'text-foreground hover:bg-muted',
                  (isDisabled || isLoading) && 'opacity-50 cursor-not-allowed'
                )}
              >
                {action.icon}
                {isLoading ? (action.loadingLabel ?? 'Cargando...') : action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Table Body Row ─────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface TableRowProps<T extends Record<string, any>> {
  row: T;
  columns: ColumnDef<T>[];
  actions?: RowAction<T>[];
  badgeConfig?: Record<string, BadgeConfig>;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  selectedRowId?: string | null;
  getRowId?: (row: T) => string;
  hideOnMobile?: string[];
  openMenuRowId: string | null;
  setOpenMenuRowId: (id: string | null) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TableRow<T extends Record<string, any>>({
  row,
  columns,
  actions,
  badgeConfig,
  rowKey,
  onRowClick,
  selectedRowId,
  getRowId,
  hideOnMobile,
  openMenuRowId,
  setOpenMenuRowId,
}: TableRowProps<T>) {
  const rowId = rowKey(row);
  const isSelected = selectedRowId && getRowId ? getRowId(row) === selectedRowId : false;

  return (
    <tr
      className={cn(
        'hover:bg-muted/30 transition-colors',
        isSelected && 'bg-muted/50',
        onRowClick && 'cursor-pointer'
      )}
      onClick={() => onRowClick?.(row)}
    >
      {columns.map((column) => (
        <td
          key={column.key}
          className={cn(
            'px-4 py-4',
            column.align === 'right' && 'text-right',
            column.align === 'center' && 'text-center',
            hideOnMobile?.includes(column.key) && 'hidden lg:table-cell'
          )}
        >
          {renderDefaultCell(column, row, badgeConfig)}
        </td>
      ))}

      {actions && actions.length > 0 && (
        <td className="px-4 py-4 text-right">
          <div onClick={(e) => e.stopPropagation()}>
            <RowActionsMenu
              actions={actions}
              row={row}
              openMenu={openMenuRowId === rowId}
              onClose={() =>
                setOpenMenuRowId(openMenuRowId === rowId ? null : rowId)
              }
            />
          </div>
        </td>
      )}
    </tr>
  );
}

// ─── DataTable Component ────────────────────────────────────────────────────

/**
 * Componente de tabla reutilizable y genérico.
 *
 * Soporta columnas dinámicas, acciones por fila, paginación,
 * badges de estado, formato de fechas, y selección de filas.
 *
 * @template T - Tipo del objeto fila (debe extender Record<string, any>)
 *
 * @example
 * ```tsx
 * <DataTable
 *   data={portfolios}
 *   columns={[
 *     { key: 'name', header: 'Nombre', accessor: 'name' },
 *     { key: 'status', header: 'Estado', accessor: 'status', type: 'badge' },
 *     { key: 'createdAt', header: 'Creado', accessor: 'createdAt', type: 'date' },
 *   ]}
 *   actions={[
 *     { key: 'edit', label: 'Editar', icon: <EditIcon />, onClick: (row) => router.push(`/edit/${row.id}`) },
 *     { key: 'delete', label: 'Eliminar', icon: <TrashIcon />, onClick: handleDelete, destructive: true },
 *   ]}
 *   pagination={pagination}
 *   onPageChange={handlePageChange}
 * />
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions,
  pagination,
  onPageChange,
  onPageSizeChange,
  paginationLabel = 'elementos',
  isLoading = false,
  emptyMessage = 'No hay datos disponibles',
  emptyState,
  className,
  rowKey = (row: T) => row.id as string,
  onRowClick,
  selectedRowId,
  getRowId,
  badgeConfig,
  hideOnMobile,
}: DataTableProps<T>) {
  const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      'px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider',
                      column.align === 'right' && 'text-right',
                      column.align === 'center' && 'text-center',
                      hideOnMobile?.includes(column.key) && 'hidden lg:table-cell'
                    )}
                    style={column.width ? { width: column.width } : undefined}
                  >
                    {column.header}
                  </th>
                ))}

                {actions && actions.length > 0 && (
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-4 py-12 text-center"
                  >
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Cargando...
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-4 py-12 text-center"
                  >
                    {emptyState ?? (
                      <p className="text-muted-foreground">{emptyMessage}</p>
                    )}
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <TableRow
                    key={rowKey(row)}
                    row={row}
                    columns={columns}
                    actions={actions}
                    badgeConfig={badgeConfig}
                    rowKey={rowKey}
                    onRowClick={onRowClick}
                    selectedRowId={selectedRowId}
                    getRowId={getRowId}
                    hideOnMobile={hideOnMobile}
                    openMenuRowId={openMenuRowId}
                    setOpenMenuRowId={setOpenMenuRowId}
                  />
                ))
              )}
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
