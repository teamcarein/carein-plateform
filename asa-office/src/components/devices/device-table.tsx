'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Device } from '@/types'
import { DataTable, Column, Pagination } from '@carein/ui-kit'
import { Badge } from '@carein/ui-kit'
import { useDevices } from '@/features/devices/hooks'
import { formatDeviceType, formatDeviceProtocol, formatDeviceStatus, formatRelative } from '@/lib/formatters'
import type { DeviceFilters } from '@/features/devices/api'

const STATUS_VARIANT: Record<Device['status'], 'active' | 'anomaly' | 'default'> = {
  active:      'active',
  maintenance: 'anomaly',
  inactive:    'default',
}

type DeviceTableProps = {
  facilityId?: string
}

export function DeviceTable({ facilityId }: DeviceTableProps) {
  const router  = useRouter()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<Device['status'] | ''>('')

  const filters: DeviceFilters = {
    facility_id: facilityId,
    status: statusFilter || undefined,
    page,
    per_page: 15,
  }

  const { data, isLoading, isError, refetch } = useDevices(filters)

  const columns: Column<Device>[] = [
    {
      key: 'name',
      header: 'Appareil',
      render: (row) => (
        <div>
          <p className="font-medium text-sm">{row.name}</p>
          <p className="font-mono text-xs text-foreground/40">{row.serial}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (row) => <span className="text-sm">{formatDeviceType(row.type)}</span>,
    },
    {
      key: 'protocol',
      header: 'Protocole',
      render: (row) => (
        <span className="text-sm text-foreground/60">{formatDeviceProtocol(row.protocol)}</span>
      ),
    },
    {
      key: 'facility',
      header: 'Structure',
      render: (row) => (
        <span className="text-sm text-foreground/60">{row.facility?.name ?? '—'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      render: (row) => (
        <Badge variant={STATUS_VARIANT[row.status]}>
          {formatDeviceStatus(row.status)}
        </Badge>
      ),
    },
    {
      key: 'last_seen_at',
      header: 'Dernière vue',
      render: (row) =>
        row.last_seen_at ? (
          <span className="text-xs text-foreground/50">{formatRelative(row.last_seen_at)}</span>
        ) : (
          <span className="text-foreground/30">—</span>
        ),
    },
  ]

  if (isError) {
    return (
      <div className="py-12 text-center text-foreground/50">
        <p className="mb-3">Erreur lors du chargement des appareils</p>
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
          onChange={(e) => { setStatusFilter(e.target.value as Device['status'] | ''); setPage(1) }}
          className="text-sm px-3 py-1.5 rounded-[8px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="maintenance">Maintenance</option>
          <option value="inactive">Inactif</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        loading={isLoading}
        keyExtractor={(row) => row.id}
        onRowClick={(row) => router.push(`/devices/${row.id}`)}
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
