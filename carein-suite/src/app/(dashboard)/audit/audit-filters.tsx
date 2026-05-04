'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const BOUNDED_CONTEXTS = [
  'Identity', 'Tenant', 'Clinical', 'Campaign',
  'Fleet', 'Teleconsultation', 'Reporting', 'CareIn', 'Sync',
]

interface AuditFiltersProps {
  tenants:     { code: string; name: string }[]
  currentPage: number
  lastPage:    number
}

export function AuditFilters({ tenants, currentPage, lastPage }: AuditFiltersProps) {
  const router   = useRouter()
  const pathname = usePathname()
  const params   = useSearchParams()

  const current = {
    tenant:  params.get('tenant')  ?? '',
    context: params.get('context') ?? '',
  }

  const hasActive = current.tenant || current.context

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    router.push(`${pathname}?${next.toString()}`)
  }

  function goToPage(p: number) {
    const next = new URLSearchParams(params.toString())
    if (p === 1) next.delete('page')
    else next.set('page', String(p))
    router.push(`${pathname}?${next.toString()}`)
  }

  function reset() {
    router.push(pathname)
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select
        value={current.tenant}
        onChange={(e) => update('tenant', e.target.value)}
        className="px-2.5 py-1.5 text-xs rounded-[6px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <option value="">Tous les tenants</option>
        {tenants.map((t) => (
          <option key={t.code} value={t.code}>{t.code} — {t.name}</option>
        ))}
      </select>

      <select
        value={current.context}
        onChange={(e) => update('context', e.target.value)}
        className="px-2.5 py-1.5 text-xs rounded-[6px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <option value="">Tous les contextes</option>
        {BOUNDED_CONTEXTS.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {hasActive && (
        <button
          onClick={reset}
          className="flex items-center gap-1 text-xs text-foreground/50 hover:text-foreground transition-colors"
        >
          <X size={12} /> Reset
        </button>
      )}

      {lastPage > 1 && (
        <div className="flex items-center gap-1 ml-2 border-l border-border pl-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1 rounded-[4px] text-foreground/40 hover:text-foreground hover:bg-foreground/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs text-foreground/50 tabular-nums px-1">
            {currentPage} / {lastPage}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= lastPage}
            className="p-1 rounded-[4px] text-foreground/40 hover:text-foreground hover:bg-foreground/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
