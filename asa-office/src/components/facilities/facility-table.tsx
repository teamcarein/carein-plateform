'use client'

import { useRouter } from 'next/navigation'
import { Facility } from '@/types'
import { DataTable, Column } from '@carein/ui-kit'
import { Badge } from '@carein/ui-kit'
import { useFacilities } from '@/features/facilities/hooks'
import { formatDate } from '@/lib/formatters'

export function FacilityTable() {
  const router = useRouter()
  const { data, isLoading, isError, refetch } = useFacilities()

  const columns: Column<Facility>[] = [
    {
      key: 'name',
      header: 'Structure',
      render: (row) => (
        <div>
          <p className="font-medium text-sm">{row.name}</p>
          {row.code && <p className="font-mono text-xs text-foreground/40">{row.code}</p>}
        </div>
      ),
    },
    {
      key: 'city',
      header: 'Localisation',
      render: (row) => {
        const loc = [row.city, row.country].filter(Boolean).join(', ')
        return <span className="text-sm text-foreground/60">{loc || '—'}</span>
      },
    },
    {
      key: 'users_count',
      header: 'Agents',
      render: (row) => (
        <span className="font-mono text-sm">{row.users_count ?? '—'}</span>
      ),
    },
    {
      key: 'is_active',
      header: 'Statut',
      render: (row) => (
        <Badge variant={row.is_active ? 'active' : 'default'}>
          {row.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Créée le',
      render: (row) => <span className="font-mono text-xs">{formatDate(row.created_at)}</span>,
    },
  ]

  if (isError) {
    return (
      <div className="py-12 text-center text-foreground/50">
        <p className="mb-3">Erreur lors du chargement des structures</p>
        <button onClick={() => refetch()} className="text-primary hover:underline text-sm">
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <DataTable
      columns={columns}
      data={data?.data ?? []}
      loading={isLoading}
      keyExtractor={(row) => row.id}
      onRowClick={(row) => router.push(`/facilities/${row.id}`)}
    />
  )
}
