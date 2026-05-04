import { Building2, Users, Stethoscope, AlertCircle, Activity, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle } from '@carein/ui-kit'
import { MetricCard } from '@carein/ui-kit'
import { Badge, type BadgeVariant } from '@carein/ui-kit'
import { getAnalyticsOverview } from '@/features/analytics/api'
import { getBrandOperators } from '@/features/brand-operators/api'
import { getAuditLogs } from '@/features/audit/api'
import { formatDateTime, countryLabel } from '@/lib/formatters'

export default async function DashboardPage() {
  const [overviewResult, bosResult, logsResult] = await Promise.allSettled([
    getAnalyticsOverview(),
    getBrandOperators(),
    getAuditLogs({ per_page: 6 }),
  ])

  const overview = overviewResult.status === 'fulfilled' ? overviewResult.value : null
  const bos      = bosResult.status === 'fulfilled' ? bosResult.value.data : []
  const logs     = logsResult.status === 'fulfilled' ? logsResult.value.data : []

  const stats = {
    total_bos:           overview?.total_bos           ?? bos.length,
    total_tenants:       overview?.total_tenants        ?? 0,
    total_patients:      overview?.total_patients       ?? 0,
    pending_invitations: overview?.pending_invitations  ?? 0,
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Dashboard CareIN</h1>
        <p className="text-sm text-foreground/50 mt-0.5">Vue d'ensemble cross-tenants</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard title="Brand Operators" value={stats.total_bos}           subtitle="enregistrés"  icon={Building2}   colorScheme="primary"   />
        <MetricCard title="Tenants actifs"  value={stats.total_tenants}       subtitle="services"      icon={Users}       colorScheme="secondary" />
        <MetricCard title="Patients suivis" value={stats.total_patients}      subtitle="cross-BO"      icon={Stethoscope} colorScheme="success"   />
        <MetricCard title="Invitations"     value={stats.pending_invitations} subtitle="en attente"    icon={AlertCircle} colorScheme="warning"   />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tenants actifs</CardTitle>
          </CardHeader>
          {bos.length === 0 ? (
            <div className="py-8 text-center">
              <Building2 size={26} className="mx-auto text-foreground/15 mb-2" />
              <p className="text-sm text-foreground/40">Aucun tenant enregistré</p>
            </div>
          ) : (
            <div className="space-y-2">
              {bos.map((bo) => (
                <Link
                  key={bo.id}
                  href={`/brand-operators/${bo.id}`}
                  className="flex items-center justify-between px-3 py-2.5 rounded-[6px] border border-border hover:bg-foreground/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                      <Building2 size={13} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{bo.name}</p>
                      <p className="text-xs text-foreground/40 font-mono">{bo.code} · {countryLabel(bo.country)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-foreground/40 font-mono">{bo.currency}</span>
                    <Badge variant={bo.status as BadgeVariant}>
                      {bo.status === 'active' ? 'Actif' : bo.status === 'suspended' ? 'Suspendu' : bo.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <Link href="/audit" className="flex items-center gap-1 text-xs text-foreground/40 hover:text-foreground transition-colors">
              Tout voir <ArrowRight size={11} />
            </Link>
          </CardHeader>
          {logs.length === 0 ? (
            <div className="py-10 text-center">
              <Activity size={26} className="mx-auto text-foreground/15 mb-2" />
              <p className="text-sm text-foreground/40">Aucune activité récente</p>
            </div>
          ) : (
            <div className="divide-y divide-border -mx-4">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 px-4 py-2.5">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs font-semibold text-primary truncate">{log.action}</p>
                    <p className="text-xs text-foreground/40 mt-0.5">
                      {log.performed_by?.name ?? 'System'}
                      {log.tenant && <span className="ml-1 font-mono">· {log.tenant.code}</span>}
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
    </div>
  )
}
