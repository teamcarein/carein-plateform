import { AlertTriangle, Shield } from 'lucide-react'
import { Card } from '@carein/ui-kit'
import { getBrandOperators } from '@/features/brand-operators/api'
import { getAuditLogs } from '@/features/audit/api'
import { formatDateTime } from '@/lib/formatters'
import { ImpersonationForm } from './impersonation-form'

export default async function ImpersonationPage({
  searchParams,
}: {
  searchParams: Promise<{ tenant?: string }>
}) {
  const { tenant: preselectedTenant } = await searchParams

  const [bosResult, logsResult] = await Promise.allSettled([
    getBrandOperators({ status: 'active' }),
    getAuditLogs({ bounded_context: 'CareIn', per_page: 10 }),
  ])

  const tenants = bosResult.status === 'fulfilled'
    ? bosResult.value.data.map((bo) => ({ id: bo.id, code: bo.code, name: bo.name }))
    : []

  const recentLogs = logsResult.status === 'fulfilled'
    ? logsResult.value.data.filter(l => l.action === 'impersonation.started')
    : []

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold">Impersonation</h1>
        <p className="text-sm text-foreground/50 mt-0.5">Démarrer une session de support dans le contexte d'un BO</p>
      </div>

      <div className="flex items-start gap-3 px-4 py-3 rounded-[var(--radius-card)] bg-warning/8 border border-warning/20">
        <AlertTriangle size={15} className="text-warning mt-0.5 shrink-0" />
        <p className="text-sm text-warning">
          Toute session d'impersonation est <strong>tracée dans les audit logs</strong>. Utiliser uniquement à des fins de support explicitement autorisé.
        </p>
      </div>

      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield size={18} className="text-primary" />
          </div>
          <div>
            <p className="font-semibold">Démarrer une session</p>
            <p className="text-sm text-foreground/50">Choisir un BO et un utilisateur à impersonner</p>
          </div>
        </div>
        <ImpersonationForm tenants={tenants} defaultTenantCode={preselectedTenant} />
      </Card>

      <Card>
        <p className="text-sm font-semibold mb-3">Sessions récentes</p>
        {recentLogs.length === 0 ? (
          <div className="py-8 text-center text-foreground/40 text-sm">
            Aucune session d'impersonation récente
          </div>
        ) : (
          <div className="divide-y divide-border -mx-4">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 px-4 py-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {(log.context as Record<string, string> | null)?.impersonated_email ?? '—'}
                  </p>
                  <p className="text-xs text-foreground/40 mt-0.5">
                    par {log.performed_by?.name ?? 'System'}
                    {log.tenant && <span className="font-mono ml-1">· {log.tenant.code}</span>}
                  </p>
                </div>
                <span className="text-[10px] text-foreground/30 shrink-0 pt-0.5">
                  {formatDateTime(log.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
