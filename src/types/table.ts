import type { ReactNode } from 'react';

/**
 * Tipos de dato soportados por las columnas de la tabla.
 */
export type ColumnDataType =
  | 'text'
  | 'badge'
  | 'date'
  | 'link'
  | 'custom';

/**
 * Configuración de una columna de la tabla genérica.
 *
 * @template T - Tipo del objeto fila
 */
export interface ColumnDef<T> {
  /** Identificador único de la columna */
  key: string;
  /** Texto mostrado en el encabezado */
  header: string;
  /** Campo del objeto T que contiene el dato (soporta rutas anidadas como "user.name") */
  accessor: keyof T | string;
  /** Tipo de dato para renderizado automático */
  type?: ColumnDataType;
  /** Formato personalizado (ej: 'DD/MM/YYYY' para fechas) */
  format?: string;
  /** Alineación de la columna */
  align?: 'left' | 'center' | 'right';
  /** Si la columna es ordenable */
  sortable?: boolean;
  /** Ancho mínimo de la columna (Tailwind class o valor CSS) */
  width?: string;
  /** Función para renderizar el contenido de la celda personalizado */
  renderCell?: (value: unknown, row: T) => ReactNode;
  /** Función para extraer el valor de la fila (sobrescribe accessor) */
  getValue?: (row: T) => unknown;
}

/**
 * Configuración de badge para columnas de tipo 'badge'.
 */
export interface BadgeConfig {
  /** Mapa de valores del dato a configuración visual */
  variants: Record<string, {
    label: string;
    className: string;
  }>;
  /** Configuración por defecto si el valor no coincide */
  default?: {
    label: string;
    className: string;
  };
}

/**
 * Acción disponible para cada fila de la tabla.
 *
 * @template T - Tipo del objeto fila
 */
export interface RowAction<T> {
  /** Identificador único de la acción */
  key: string;
  /** Texto mostrado en el menú */
  label: string;
  /** Icono SVG personalizado */
  icon?: ReactNode;
  /** Callback al ejecutar la acción */
  onClick: (row: T) => void | Promise<void>;
  /** Si la acción es destructiva (muestra estilo de peligro) */
  destructive?: boolean;
  /** Si la acción requiere confirmación antes de ejecutarse */
  requireConfirmation?: boolean;
  /** Mensaje de confirmación */
  confirmationMessage?: string;
  /** Condición para mostrar la acción (ej: solo si el estado es borrador) */
  visible?: (row: T) => boolean;
  /** Si la acción está deshabilitada */
  disabled?: (row: T) => boolean;
  /** Texto mostrado mientras se ejecuta la acción */
  loadingLabel?: string;
}

/**
 * Props del componente DataTable genérico.
 *
 * @template T - Tipo del objeto fila
 */
export interface DataTableProps<T> {
  /** Array de objetos a mostrar en la tabla */
  data: T[];
  /** Definición de columnas */
  columns: ColumnDef<T>[];
  /** Acciones disponibles por fila */
  actions?: RowAction<T>[];
  /** Configuración de paginación */
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  /** Callback al cambiar de página */
  onPageChange?: (page: number) => void;
  /** Callback al cambiar el tamaño de página */
  onPageSizeChange?: (size: number) => void;
  /** Texto del label de paginación (default: "elementos") */
  paginationLabel?: string;
  /** Estado de carga de la tabla */
  isLoading?: boolean;
  /** Mensaje mostrado cuando no hay datos */
  emptyMessage?: string;
  /** Componente personalizado cuando no hay datos */
  emptyState?: ReactNode;
  /** Clase CSS adicional para el contenedor */
  className?: string;
  /** Función para obtener la clave única de cada fila */
  rowKey?: (row: T) => string;
  /** Callback al hacer clic en una fila */
  onRowClick?: (row: T) => void;
  /** Estado de selección (highlight) de filas */
  selectedRowId?: string | null;
  /** Función para obtener el ID de la fila seleccionada */
  getRowId?: (row: T) => string;
  /** Mapa de configuración de badges por columna key */
  badgeConfig?: Record<string, BadgeConfig>;
  /** Columnas a ocultar en mobile (array de keys) */
  hideOnMobile?: string[];
}
