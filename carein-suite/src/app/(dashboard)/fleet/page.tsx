import Link from 'next/link'
import { Tablet, Cpu, Activity, AlertTriangle, CheckCircle, WifiOff, Wrench } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@carein/ui-kit'
import { MetricCard } from '@carein/ui-kit'
import { Badge, type BadgeVariant } from '@carein/ui-kit'
import { DataTable, type Column } from '@carein/ui-kit'
import { getFleetHealth } from '@/features/fleet-health/api'
import { formatRelative, formatDateTime } from '@/lib/formatters'
import type { TenantFleetRow, AlertTablet, HealthScore } from '@/features/fleet-health/types'

const HEALTH_BADGE: Record<HealthScore, { variant: BadgeVariant; label: string }> = {
  good:     { variant: 'success' as BadgeVariant,  label: 'OK'        },
  degraded: { variant: 'warning' as BadgeVariant,  label: 'Dégradé'   },
  critical: { variant: 'danger'  as BadgeVariant,  label: 'Critique'  },
  warning:  { variant: 'warning' as BadgeVariant,  label: 'Attention' },
  unknown:  { variant: 'default' as BadgeVariant,  label: '—'         },
}

const tenantColumns: Column<TenantFleetRow>[] = [
  {
    key: 'name',
    header: 'Tenant',
    render: (row) => (
      <div>
        <p className="text-sm font-medium">{row.name}</p>
        <p className="text-xs font-mono text-foreground/40">{row.code}</p>
      </div>
    ),
  },
  {
    key: 'tablets',
    header: 'Tablettes',
    render: (row) => (
      <div className="flex items-center gap-1.5">
        <span className={`text-sm font-semibold ${row.tablets_online > 0 ? 'text-success' : 'text-foreground/40'}`}>
          {row.tablets_online}
        </span>
        <span className="text-xs text-foreground/30">/ {row.tablets_total}</span>
        <span className="text-xs text-foreground/40">en ligne</span>
      </div>
    ),
  },
  {
    key: 'kits',
    header: 'Kits actifs',
    render: (row) => (
      <span className="text-sm">
        {row.kits_active}
        <span className="text-xs text-foreground/30 ml-1">/ {row.kits_total}</span>
      </span>
    ),
  },
  {
    key: 'calibrations_due',
    header: 'Calibrations dues',
    render: (row) => row.calibrations_due > 0 ? (
      <span className="flex items-center gap-1 text-xs text-warning font-medium">
        <AlertTriangle size={12} />
        {row.calibrations_due}
      </span>
    ) : (
      <span className="flex items-center gap-1 text-xs text-foreground/30">
        <CheckCircle size={12} />
        0
      </span>
    ),
  },
  {
    key: 'last_activity',
    header: 'Dernière activité',
    render: (row) => (
      <span className="text-xs text-foreground/40 font-mono">
        {row.last_activity ? formatRelative(row.last_activity) : '—'}
      </span>
    ),
  },
  {
    key: 'health',
    header: 'État',
    render: (row) => {
      const h = HEALTH_BADGE[row.health]
      return <Badge variant={h.variant}>{h.label}</Badge>
    },
  },
  {
    key: 'actions',
    header: '',
    render: (row) => (
      <Link
        href={`/impersonation?tenant=${row.code}`}
        className="flex items-center gap-1.5 text-xs text-primary hover:underline whitespace-nowrap"
        onClick={(e) => e.stopPropagation()}
      >
        <Wrench size={11} />
        Intervenir
      </Link>
    ),
  },
]

const alertColumns: Column<AlertTablet>[] = [
  {
    key: 'model',
    header: 'Tablette',
    render: (row) => (
      <div>
        <p className="text-sm font-medium">{row.model ?? 'Tablette Android'}</p>
        {row.serial && <p className="text-xs font-mono text-foreground/40">{row.serial}</p>}
      </div>
    ),
  },
  {
    key: 'tenant',
    header: 'Tenant',
    render: (row) => row.tenant ? (
      <div>
        <p className="text-sm">{row.tenant.name}</p>
        <p className="text-xs font-mono text-foreground/40">{row.tenant.code}</p>
      </div>
    ) : <span className="text-foreground/30">—</span>,
  },
  {
    key: 'last_seen_at',
    header: 'Dernière vue',
    render: (row) => (
      <span className="text-xs font-mono text-danger">
        {row.last_seen_at ? formatDateTime(row.last_seen_at) : 'Jamais'}
      </span>
    ),
  },
  {
    key: 'actions',
    header: '',
    render: (row) => row.tenant ? (
      <Link
        href={`/impersonation?tenant=${row.tenant.code}`}
        className="flex items-center gap-1.5 text-xs text-primary hover:underline whitespace-nowrap"
        onClick={(e) => e.stopPropagation()}
      >
        <Wrench size={11} />
        Intervenir
      </Link>
    ) : null,
  },
]

export default async function FleetMonitorPage() {
  let data = null
  try {
    data = await getFleetHealth()
  } catch { /* fallback */ }

  const s = data?.summary
  const alerts     = data?.alert_tablets    ?? []
  const breakdown  = data?.tenant_breakdown ?? []

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Fleet 360°</h1>
        <p className="text-sm text-foreground/50 mt-0.5">État du parc cross-tenants en temps réel</p>
      </div>

      {/* KPIs */}
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

      {/* Alert zone — tablettes hors ligne >24h */}
      {alerts.length > 0 && (
        <div className="rounded-[var(--radius-card)] border border-danger/20 bg-danger/5 p-4 space-y-3">
          <div className="flex items-center gap-2 text-danger">
            <WifiOff size={15} />
            <span className="text-sm font-semibold">
              {alerts.length} tablette{alerts.length > 1 ? 's' : ''} hors ligne depuis plus de 24 h
            </span>
          </div>
          <Card className="p-0 overflow-hidden">
            <DataTable
              columns={alertColumns}
              data={alerts}
              keyExtractor={(row) => row.uuid}
              emptyMessage=""
            />
          </Card>
        </div>
      )}

      {/* Per-tenant breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>État par tenant</CardTitle>
          <span className="text-xs text-foreground/40">{breakdown.length} tenant{breakdown.length !== 1 ? 's' : ''} actif{breakdown.length !== 1 ? 's' : ''}</span>
        </CardHeader>
        <DataTable
          columns={tenantColumns}
          data={breakdown}
          keyExtractor={(row) => row.code}
          emptyMessage="Aucun tenant actif"
        />
      </Card>
    </div>
  )
}
