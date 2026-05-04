'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable, Column, Pagination } from '@carein/ui-kit'
import { Badge } from '@carein/ui-kit'
import { useKits } from '@/features/fleet/hooks'
import { Kit, KitStatus, KitType } from '@/features/fleet/types'
import { formatRelative } from '@/lib/formatters'

function formatKitType(type: KitType): string {
  const labels: Record<KitType, string> = {
    maternity:   'Maternité',
    cardiology:  'Cardiologie',
    pediatrics:  'Pédiatrie',
    general:     'Généraliste',
    custom:      'Personnalisé',
  }
  return labels[type] ?? type
}

function formatKitStatus(status: KitStatus): string {
  const labels: Record<KitStatus, string> = {
    in_stock:    'En stock',
    assigned:    'Assigné',
    active:      'Actif',
    in_transit:  'En transit',
    maintenance: 'Maintenance',
    retired:     'Retraité',
  }
  return labels[status] ?? status
}

function kitStatusVariant(status: KitStatus) {
  const map: Record<KitStatus, string> = {
    active:      'active',
    assigned:    'planned',
    in_stock:    'default',
    in_transit:  'paused',
    maintenance: 'needs_info',
    retired:     'cancelled',
  }
  return map[status] as never
}

export function KitTable() {
  const router  = useRouter()
  const [page, setPage]         = useState(1)
  const [statusFilter, setStatus] = useState<KitStatus | ''>('')
  const [typeFilter, setType]   = useState<KitType | ''>('')

  const { data, isLoading, isError, refetch } = useKits({
    status:   statusFilter || undefined,
    kit_type: typeFilter   || undefined,
    page,
    per_page: 15,
  })

  const columns: Column<Kit>[] = [
    {
      key: 'code',
      header: 'Kit',
      render: (row) => (
        <div>
          <p className="font-mono text-xs font-medium">{row.code}</p>
          <p className="text-xs text-foreground/40">{row.name}</p>
        </div>
      ),
    },
    {
      key: 'kit_type',
      header: 'Type',
      render: (row) => (
        <span className="text-sm text-foreground/70">{formatKitType(row.kit_type)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      render: (row) => (
        <Badge variant={kitStatusVariant(row.status)}>{formatKitStatus(row.status)}</Badge>
      ),
    },
    {
      key: 'facility',
      header: 'Assigné à',
      render: (row) => {
        const dest = row.facility?.name ?? row.campaign?.name ?? row.user?.name
        return dest
          ? <span className="text-sm">{dest}</span>
          : <span className="text-foreground/30 text-sm">—</span>
      },
    },
    {
      key: 'tablet_id',
      header: 'Tablette',
      render: (row) => row.tablet
        ? (
          <div>
            <p className="text-xs font-medium">{row.tablet.model ?? 'Tablette'}</p>
            <p className={`text-xs ${isOnline(row.tablet.last_seen_at) ? 'text-primary' : 'text-foreground/30'}`}>
              {isOnline(row.tablet.last_seen_at) ? 'En ligne' : row.tablet.last_seen_at ? formatRelative(row.tablet.last_seen_at) : 'Jamais connectée'}
            </p>
          </div>
        )
        : <span className="text-foreground/30 text-sm">—</span>,
    },
    {
      key: 'active_devices',
      header: 'Appareils',
      render: (row) => (
        <span className="font-mono text-sm">{row.active_devices?.length ?? 0}</span>
      ),
    },
    {
      key: 'last_synced_at',
      header: 'Dernière synchro',
      render: (row) => row.last_synced_at
        ? <span className="text-xs text-foreground/50">{formatRelative(row.last_synced_at)}</span>
        : <span className="text-foreground/30">—</span>,
    },
  ]

  if (isError) {
    return (
      <div className="py-12 text-center text-foreground/50">
        <p className="mb-3">Erreur lors du chargement des valises</p>
        <button onClick={() => refetch()} className="text-primary hover:underline text-sm">
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => { setStatus(e.target.value as KitStatus | ''); setPage(1) }}
          className="text-sm px-3 py-1.5 rounded-[8px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Tous les statuts</option>
          <option value="in_stock">En stock</option>
          <option value="assigned">Assigné</option>
          <option value="active">Actif</option>
          <option value="in_transit">En transit</option>
          <option value="maintenance">Maintenance</option>
          <option value="retired">Retraité</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => { setType(e.target.value as KitType | ''); setPage(1) }}
          className="text-sm px-3 py-1.5 rounded-[8px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Tous les types</option>
          <option value="cardiology">Cardiologie</option>
          <option value="maternity">Maternité</option>
          <option value="pediatrics">Pédiatrie</option>
          <option value="general">Généraliste</option>
          <option value="custom">Personnalisé</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        loading={isLoading}
        keyExtractor={(row) => row.uuid ?? row.id}
        onRowClick={(row) => router.push(`/fleet/${row.uuid ?? row.id}`)}
      />

      {data && (
        <Pagination
          currentPage={data.meta?.current_page ?? 1}
          lastPage={data.meta?.last_page ?? 1}
          total={data.meta?.total ?? 0}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}

function isOnline(lastSeen?: string): boolean {
  if (!lastSeen) return false
  return Date.now() - new Date(lastSeen).getTime() < 10 * 60 * 1000
}
