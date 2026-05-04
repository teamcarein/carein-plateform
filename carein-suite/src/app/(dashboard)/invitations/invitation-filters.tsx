'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { X } from 'lucide-react'

const STATUSES = [
  { value: 'pending',  label: 'En attente' },
  { value: 'accepted', label: 'Acceptée' },
  { value: 'expired',  label: 'Expirée' },
  { value: 'revoked',  label: 'Révoquée' },
]

export function InvitationFilters({ tenants }: { tenants: { code: string; name: string }[] }) {
  const router   = useRouter()
  const pathname = usePathname()
  const params   = useSearchParams()

  const current = {
    status: params.get('status') ?? '',
    tenant: params.get('tenant') ?? '',
  }

  const hasActive = current.status || current.tenant

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    router.push(`${pathname}?${next.toString()}`)
  }

  return (
    <div className="px-6 pt-6 flex items-center gap-2 flex-wrap">
      <select
        value={current.status}
        onChange={(e) => update('status', e.target.value)}
        className="px-2.5 py-1.5 text-xs rounded-[6px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <option value="">Tous les statuts</option>
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

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

      {hasActive && (
        <button
          onClick={() => router.push(pathname)}
          className="flex items-center gap-1 text-xs text-foreground/50 hover:text-foreground transition-colors"
        >
          <X size={12} /> Reset
        </button>
      )}
    </div>
  )
}
