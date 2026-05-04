'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Campaign } from '@/types'
import { DataTable, Column, Pagination } from '@carein/ui-kit'
import { Badge } from '@carein/ui-kit'
import { useCampaigns } from '@/features/campaigns/hooks'
import { formatDate, formatObjectiveType, formatCampaignStatus } from '@/lib/formatters'

export function CampaignTable() {
  const router = useRouter()
  const [page, setPage]     = useState(1)
  const [status, setStatus] = useState<Campaign['status'] | undefined>()

  const { data, isLoading, isError, refetch } = useCampaigns({ page, per_page: 15, status })

  const columns: Column<Campaign>[] = [
    {
      key: 'name',
      header: 'Campagne',
      render: (row) => (
        <div>
          <p className="font-medium">{row.name}</p>
          {row.code && <p className="text-xs text-foreground/40 font-mono">{row.code}</p>}
        </div>
      ),
    },
    {
      key: 'objective_type',
      header: 'Objectif',
      render: (row) => <span className="text-foreground/60">{formatObjectiveType(row.objective_type)}</span>,
    },
    {
      key: 'organization',
      header: 'Organisation',
      render: (row) => <span className="text-sm">{row.organization?.name ?? '—'}</span>,
    },
    {
      key: 'starts_at',
      header: 'Période',
      render: (row) => (
        <span className="font-mono text-xs text-foreground/60">
          {formatDate(row.starts_at)} → {formatDate(row.ends_at)}
        </span>
      ),
    },
    {
      key: 'quota_per_day',
      header: 'Quota/j',
      render: (row) => <span className="font-mono text-sm font-semibold">{row.quota_per_day}</span>,
    },
    {
      key: 'status',
      header: 'Statut',
      render: (row) => <Badge variant={row.status}>{formatCampaignStatus(row.status)}</Badge>,
    },
  ]

  if (isError) {
    return (
      <div className="py-12 text-center text-foreground/50">
        <p className="mb-3">Erreur lors du chargement des campagnes</p>
        <button onClick={() => refetch()} className="text-primary hover:underline text-sm">
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <select
          value={status ?? ''}
          onChange={(e) => setStatus((e.target.value as Campaign['status']) || undefined)}
          className="text-sm px-3 py-1.5 rounded-[8px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Tous les statuts</option>
          <option value="draft">Brouillon</option>
          <option value="planned">Planifiée</option>
          <option value="active">Active</option>
          <option value="paused">En pause</option>
          <option value="completed">Terminée</option>
          <option value="cancelled">Annulée</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        loading={isLoading}
        keyExtractor={(row) => row.id}
        onRowClick={(row) => router.push(`/campaigns/${row.id}`)}
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
