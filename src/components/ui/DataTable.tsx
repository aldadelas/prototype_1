import type { ReactNode } from "react";
import Button from "@/components/ui/Button";

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  renderCell: (row: T, rowIndex: number) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T, rowIndex: number) => string;
  emptyState?: ReactNode;
  footer?: ReactNode;
  className?: string;
  tableClassName?: string;
  pagination?: {
    page: number;
    totalPages: number;
    pageSize: number;
    totalRows: number;
    pageStartIndex: number;
    onPrevPage: () => void;
    onNextPage: () => void;
  };
}

export default function DataTable<T>({
  columns,
  rows,
  getRowKey,
  emptyState,
  footer,
  className = "mt-4 w-full max-w-full overflow-x-auto",
  tableClassName = "w-full table-fixed text-left text-xs text-on-surface-variant sm:table-auto sm:text-sm",
  pagination,
}: DataTableProps<T>) {
  return (
    <>
      <div className={className}>
        <table className={tableClassName}>
          <thead>
            <tr className="border-b border-outline-variant text-on-surface">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-1.5 py-2 font-medium sm:px-2 ${column.headerClassName ?? ""}`.trim()}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={getRowKey(row, rowIndex)} className="border-b border-outline-variant/50">
                {columns.map((column) => (
                  <td
                    key={`${column.key}-${getRowKey(row, rowIndex)}`}
                    className={`px-1.5 py-2 sm:px-2 ${column.cellClassName ?? ""}`.trim()}
                  >
                    {column.renderCell(row, rowIndex)}
                  </td>
                ))}
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-2 py-4 text-center text-on-surface-variant"
                >
                  {emptyState ?? "No data available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="mt-4 border-t border-outline-variant pt-4">
          <p className="text-center text-sm text-on-surface-variant sm:text-left">
            Menampilkan {pagination.totalRows === 0 ? 0 : pagination.pageStartIndex + 1}-
            {Math.min(pagination.pageStartIndex + pagination.pageSize, pagination.totalRows)} dari{" "}
            {pagination.totalRows} data
          </p>

          <div className="mt-3 grid w-full grid-cols-3 items-center gap-2 sm:w-auto sm:grid-cols-[auto_auto_auto] sm:gap-3">
            <div className="justify-self-start">
              <Button
                type="button"
                variant="outlined"
                onClick={pagination.onPrevPage}
                disabled={pagination.page <= 1}
              >
                Previous
              </Button>
            </div>

            <span className="min-w-16 justify-self-center text-center text-sm text-on-surface-variant">
              {pagination.page}/{pagination.totalPages}
            </span>

            <div className="justify-self-end">
              <Button
                type="button"
                variant="outlined"
                onClick={pagination.onNextPage}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {footer}
    </>
  );
}
