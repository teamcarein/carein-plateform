'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Exam } from '@/types'
import { DataTable, Column, Pagination } from '@carein/ui-kit'
import { Badge } from '@carein/ui-kit'
import { useExams } from '@/features/exams/hooks'
import { formatDate, formatExamStatus, formatExamCategory } from '@/lib/formatters'

type ExamTableProps = {
  encounterId?: string
}

export function ExamTable({ encounterId }: ExamTableProps) {
  const router = useRouter()
  const [page, setPage] = useState(1)

  const { data, isLoading, isError, refetch } = useExams({
    encounter_id: encounterId,
    page,
    per_page: 15,
  })

  const columns: Column<Exam>[] = [
    {
      key: 'category',
      header: 'Catégorie',
      render: (row) => <span className="font-medium">{formatExamCategory(row.category)}</span>,
    },
    {
      key: 'status',
      header: 'Statut',
      render: (row) => (
        <Badge variant={row.status}>{formatExamStatus(row.status)}</Badge>
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
    {
      key: 'started_at',
      header: 'Démarré le',
      render: (row) => <span className="font-mono text-xs">{formatDate(row.started_at)}</span>,
    },
  ]

  if (isError) {
    return (
      <div className="py-12 text-center text-foreground/50">
        <p className="mb-3">Erreur lors du chargement des examens</p>
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
        onRowClick={(row) => router.push(`/exams/${row.id}`)}
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
