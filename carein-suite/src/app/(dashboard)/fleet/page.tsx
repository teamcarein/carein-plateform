import { Tablet, Cpu, Activity, AlertTriangle, WifiOff } from 'lucide-react'
import { Card, CardHeader, CardTitle, MetricCard } from '@carein/ui-kit'
import { getFleetHealth } from '@/features/fleet-health/api'
import { TenantBreakdownTable, AlertTabletsTable } from './fleet-tables'

export default async function FleetMonitorPage() {
  let data = null
  try {
    data = await getFleetHealth()
  } catch { /* fallback */ }

  const s         = data?.summary
  const alerts    = data?.alert_tablets    ?? []
  const breakdown = data?.tenant_breakdown ?? []

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Fleet 360°</h1>
        <p className="text-sm text-foreground/50 mt-0.5">État du parc cross-tenants en temps réel</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Tablettes en ligne"
          value={s ? `${s.tablets_online} / ${s.tablets_total}` : '—'}
          icon={Tablet}
          colorScheme={s && s.tablets_online > 0 ? 'primary' : 'warning'}
        />
        <MetricCard
          title="Kits actifs"
          value={s ? `${s.kits_active} / ${s.kits_total}` : '—'}
          icon={Activity}
          colorScheme="secondary"
        />
        <MetricCard
          title="Appareils enregistrés"
          value={s?.devices_total ?? '—'}
          icon={Cpu}
          colorScheme="success"
        />
        <MetricCard
          title="Calibrations dues"
          value={s ? s.calibrations_due + (s.calibrations_due_soon > 0 ? ` (+${s.calibrations_due_soon} bientôt)` : '') : '—'}
          icon={AlertTriangle}
          colorScheme={s && (s.calibrations_due > 0 || s.calibrations_due_soon > 0) ? 'warning' : 'success'}
        />
      </div>

      {alerts.length > 0 && (
        <div className="rounded-[var(--radius-card)] border border-danger/20 bg-danger/5 p-4 space-y-3">
          <div className="flex items-center gap-2 text-danger">
            <WifiOff size={15} />
            <span className="text-sm font-semibold">
              {alerts.length} tablette{alerts.length > 1 ? 's' : ''} hors ligne depuis plus de 24 h
            </span>
          </div>
          <AlertTabletsTable data={alerts} />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>État par tenant</CardTitle>
          <span className="text-xs text-foreground/40">
            {breakdown.length} tenant{breakdown.length !== 1 ? 's' : ''} actif{breakdown.length !== 1 ? 's' : ''}
          </span>
        </CardHeader>
        <TenantBreakdownTable data={breakdown} />
      </Card>
    </div>
  )
}
