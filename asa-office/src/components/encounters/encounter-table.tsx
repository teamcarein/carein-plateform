'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Encounter } from '@/types'
import { DataTable, Column, Pagination } from '@carein/ui-kit'
import { Badge } from '@carein/ui-kit'
import { useEncounters, usePatientEncounters } from '@/features/encounters/hooks'
import { formatDate, formatEncounterStatus, formatEncounterType } from '@/lib/formatters'
import { PaginatedResponse } from '@/types'

type EncounterTableProps = {
  patientId?: string
  campaignId?: string
}

function usePaginatedEncounters(patientId: string | undefined, page: number) {
  const general = useEncounters({ page, per_page: 15 })
  const patient = usePatientEncounters(patientId ?? '')

  if (patientId) {
    const encounters = patient.data?.data ?? []
    const paginated: PaginatedResponse<Encounter> = {
      data: encounters,
      meta: { current_page: 1, last_page: 1, per_page: encounters.length, total: encounters.length },
    }
    return { data: paginated, isLoading: patient.isLoading, isError: patient.isError, refetch: patient.refetch }
  }
  return general
}

export function EncounterTable({ patientId }: EncounterTableProps) {
  const router = useRouter()
  const [page, setPage] = useState(1)

  const { data, isLoading, isError, refetch } = usePaginatedEncounters(patientId, page)

  const columns: Column<Encounter>[] = [
    {
      key: 'started_at',
      header: 'Date',
      render: (row) => <span className="font-mono text-xs">{formatDate(row.started_at)}</span>,
    },
    {
      key: 'type',
      header: 'Type',
      render: (row) => (
        <span className="text-sm text-foreground/60">{formatEncounterType(row.type)}</span>
      ),
    },
    ...(!patientId ? [{
      key: 'patient' as keyof Encounter,
      header: 'Patient',
      render: (row: Encounter) => row.patient ? (
        <span className="font-medium">
          {row.patient.first_name
            ? `${row.patient.first_name} ${row.patient.last_name}`
            : row.patient.last_name}
        </span>
      ) : <span className="text-foreground/30">—</span>,
    }] : []),
    {
      key: 'status',
      header: 'Statut',
      render: (row) => (
        <Badge variant={row.status as never}>{formatEncounterStatus(row.status)}</Badge>
      ),
    },
    {
      key: 'risk_score',
      header: 'Score risque',
      render: (row) =>
        row.risk_score !== undefined ? (
          <span
            className={`font-mono text-sm font-semibold ${
              row.risk_score >= 75
                ? 'text-danger'
                : row.risk_score >= 50
                ? 'text-warning'
                : 'text-primary'
            }`}
          >
            {row.risk_score}%
          </span>
        ) : (
          <span className="text-foreground/30">—</span>
        ),
    },
  ]

  if (isError) {
    return (
      <div className="py-12 text-center text-foreground/50">
        <p className="mb-3">Erreur lors du chargement des dossiers</p>
        <button onClick={() => refetch()} className="text-primary hover:underline text-sm">
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        loading={isLoading}
        keyExtractor={(row) => row.id}
        onRowClick={(row) => router.push(`/encounters/${row.id}`)}
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
