import { ScrollText } from 'lucide-react'
import { Card } from '@carein/ui-kit'
import { Badge } from '@carein/ui-kit'
import { getAuditLogs } from '@/features/audit/api'
import { getBrandOperators } from '@/features/brand-operators/api'
import { formatDateTime } from '@/lib/formatters'
import { AuditFilters } from './audit-filters'

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ tenant?: string; context?: string; page?: string }>
}) {
  const { tenant, context, page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const [logsResult, bosResult] = await Promise.allSettled([
    getAuditLogs({ tenant, bounded_context: context, page, per_page: 50 }),
    getBrandOperators(),
  ])

  const logs      = logsResult.status === 'fulfilled' ? logsResult.value.data : []
  const meta      = logsResult.status === 'fulfilled' ? logsResult.value.meta : null
  const lastPage  = meta?.last_page ?? 1
  const tenants   = bosResult.status === 'fulfilled'
    ? bosResult.value.data.map((bo) => ({ code: bo.code, name: bo.name }))
    : []

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold">Audit Logs</h1>
          <p className="text-sm text-foreground/50 mt-0.5">Traçabilité des actions cross-BO</p>
        </div>
        <AuditFilters tenants={tenants} currentPage={page} lastPage={lastPage} />
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="divide-y divide-border">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-4 px-4 py-3 hover:bg-foreground/[0.02] transition-colors">
              <span className="font-mono text-[10px] text-foreground/30 pt-0.5 w-32 shrink-0">
                {formatDateTime(log.created_at)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-semibold text-primary">{log.action}</span>
                  {log.bounded_context && (
                    <Badge variant="default">{log.bounded_context}</Badge>
                  )}
                </div>
                <p className="text-xs text-foreground/50 mt-0.5">
                  <span className="text-foreground/70">
                    {log.performed_by?.name ?? log.performed_by?.email ?? 'System'}
                  </span>
                  {' → '}{log.subject}{log.subject_id ? ` #${log.subject_id}` : ''}
                </p>
              </div>
              <span className="font-mono text-[10px] text-foreground/30 shrink-0">
                {log.tenant?.code ?? '—'}
              </span>
            </div>
          ))}
        </div>

        {logs.length === 0 && (
          <div className="py-12 text-center">
            <ScrollText size={28} className="mx-auto text-foreground/15 mb-2" />
            <p className="text-sm text-foreground/40">Aucun log d'audit</p>
          </div>
        )}

        {meta && (
          <div className="px-4 py-2.5 border-t border-border flex items-center justify-between text-xs text-foreground/40">
            <span>{meta.total} entrées au total</span>
            <span>Page {meta.current_page} / {meta.last_page}</span>
          </div>
        )}
      </Card>
    </div>
  )
}
