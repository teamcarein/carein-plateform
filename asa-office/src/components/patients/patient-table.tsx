'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Patient } from '@/types'
import { DataTable, Column, Pagination } from '@carein/ui-kit'
import { Badge } from '@carein/ui-kit'
import { usePatients, useSearchPatients } from '@/features/patients/hooks'
import { formatDate, formatAge } from '@/lib/formatters'

type PatientTableProps = {
  campaignId?: string
  facilityId?: string
}

export function PatientTable({ campaignId, facilityId }: PatientTableProps) {
  const router  = useRouter()
  const [page, setPage]     = useState(1)
  const [search, setSearch] = useState('')

  const isSearching = search.length >= 2

  const listQuery   = usePatients({ campaign_id: campaignId, facility_id: facilityId, page, per_page: 15 })
  const searchQuery = useSearchPatients({ q: search, per_page: 15 })

  const { data, isLoading, isError, refetch } = isSearching ? searchQuery : listQuery

  const columns: Column<Patient>[] = [
    {
      key: 'patient_code',
      header: 'Code',
      render: (row) => (
        <span className="font-mono text-xs text-foreground/60">{row.patient_code}</span>
      ),
    },
    {
      key: 'name',
      header: 'Nom complet',
      render: (row) => (
        <span className="font-medium">
          {row.first_name ? `${row.first_name} ${row.last_name}` : row.last_name}
        </span>
      ),
    },
    {
      key: 'gender',
      header: 'Sexe',
      render: (row) =>
        row.gender ? (
          <span className="text-foreground/60">{row.gender === 'male' ? 'M' : 'F'}</span>
        ) : <span className="text-foreground/30">—</span>,
    },
    {
      key: 'age',
      header: 'Âge',
      render: (row) =>
        row.birth_date ? (
          <span className="font-mono text-sm">{formatAge(row.birth_date)} ans</span>
        ) : <span className="text-foreground/30">—</span>,
    },
    {
      key: 'blood_type',
      header: 'Groupe',
      render: (row) =>
        row.blood_type ? (
          <span className="font-mono text-xs font-semibold text-secondary">{row.blood_type}</span>
        ) : <span className="text-foreground/30">—</span>,
    },
    {
      key: 'bmi',
      header: 'IMC',
      render: (row) =>
        row.bmi ? (
          <span className={row.bmi > 25 ? 'text-warning font-semibold font-mono text-sm' : 'font-mono text-sm'}>
            {row.bmi.toFixed(1)}
            {row.bmi > 25 && <Badge variant="anomaly" className="ml-1.5 text-[10px]">Surpoids</Badge>}
          </span>
        ) : <span className="text-foreground/30">—</span>,
    },
    {
      key: 'created_at',
      header: 'Date',
      render: (row) => <span className="font-mono text-xs">{formatDate(row.created_at)}</span>,
    },
  ]

  if (isError) {
    return (
      <div className="py-12 text-center text-foreground/50">
        <p className="mb-3">Erreur lors du chargement des patients</p>
        <button onClick={() => refetch()} className="text-primary hover:underline text-sm">
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <input
          type="search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Rechercher par nom, prénom ou code patient…"
          className="w-full max-w-sm text-sm px-3 py-1.5 rounded-[8px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        loading={isLoading}
        keyExtractor={(row) => row.id}
        onRowClick={(row) => router.push(`/patients/${row.id}`)}
      />

      {data && !isSearching && (
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
