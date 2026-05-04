'use client'

import Link from 'next/link'
import { AlertTriangle, CheckCircle, Wrench } from 'lucide-react'
import { Card, Badge, DataTable, type Column, type BadgeVariant } from '@carein/ui-kit'
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

export function TenantBreakdownTable({ data }: { data: TenantFleetRow[] }) {
  return (
    <DataTable
      columns={tenantColumns}
      data={data}
      keyExtractor={(row) => row.code}
      emptyMessage="Aucun tenant actif"
    />
  )
}

export function AlertTabletsTable({ data }: { data: AlertTablet[] }) {
  return (
    <Card className="p-0 overflow-hidden">
      <DataTable
        columns={alertColumns}
        data={data}
        keyExtractor={(row) => row.uuid}
        emptyMessage=""
      />
    </Card>
  )
}
