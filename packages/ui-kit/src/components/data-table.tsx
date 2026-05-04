'use client'

import { cn } from '../lib/cn'

export type Column<T> = {
  key: string
  header: string
  render: (row: T) => React.ReactNode
  className?: string
}

type DataTableProps<T> = {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  keyExtractor: (row: T) => string
  onRowClick?: (row: T) => void
  emptyMessage?: string
  className?: string
}

export function DataTable<T>({
  columns, data, loading, keyExtractor, onRowClick, emptyMessage = 'Aucune donnée', className,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-10 bg-foreground/5 rounded animate-pulse" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-foreground/3 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th key={col.key} className={cn('px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-foreground/50', col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-foreground/40">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={cn('border-b border-border transition-colors', onRowClick && 'cursor-pointer hover:bg-foreground/3')}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-4 py-3', col.className)}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

type PaginationProps = {
  currentPage: number
  lastPage: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, lastPage, total, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm text-foreground/60">
      <span>{total} résultat{total > 1 ? 's' : ''}</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1 rounded hover:bg-foreground/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >←</button>
        <span className="px-3 py-1 font-medium">{currentPage} / {lastPage}</span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= lastPage}
          className="px-3 py-1 rounded hover:bg-foreground/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >→</button>
      </div>
    </div>
  )
}
