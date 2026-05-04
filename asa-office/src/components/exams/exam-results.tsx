'use client'

import { Measurement } from '@/types'
import { useExamMeasurements } from '@/features/exams/hooks'
import { Card, CardHeader, CardTitle } from '@carein/ui-kit'
import { Badge } from '@carein/ui-kit'
import { Skeleton } from '@carein/ui-kit'
import { formatDatetime } from '@/lib/formatters'

type ExamResultsProps = {
  examId: string
}

export function ExamResults({ examId }: ExamResultsProps) {
  const { data: measurements, isLoading, isError, refetch } = useExamMeasurements(examId)

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-[12px]" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="py-8 text-center text-foreground/50">
        <p className="mb-3 text-sm">Erreur lors du chargement des mesures</p>
        <button onClick={() => refetch()} className="text-primary hover:underline text-sm">
          Réessayer
        </button>
      </div>
    )
  }

  if (!measurements?.length) {
    return (
      <div className="py-8 text-center text-foreground/40 text-sm">
        Aucune mesure enregistrée pour cet examen
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {measurements.map((m) => (
        <MeasurementRow key={m.id} measurement={m} />
      ))}
    </div>
  )
}

function MeasurementRow({ measurement: m }: { measurement: Measurement }) {
  return (
    <Card className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-2 h-2 rounded-full shrink-0 ${
            m.is_abnormal ? 'bg-warning' : 'bg-primary'
          }`}
        />
        <div className="min-w-0">
          <p className="text-sm font-medium capitalize">{m.type.replace(/_/g, ' ')}</p>
          <p className="font-mono text-xs text-foreground/50 mt-0.5">
            {formatDatetime(m.measured_at)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="font-mono text-sm font-semibold">
          {formatMeasurementValue(m)} {m.unit}
        </span>
        {m.is_abnormal && (
          <Badge variant="anomaly" className="text-[10px]">
            Anomalie
          </Badge>
        )}
      </div>
    </Card>
  )
}

function formatMeasurementValue(m: Measurement): string {
  const v = m.value
  if (typeof v === 'object' && v !== null) {
    const entries = Object.values(v)
    if (entries.length === 1) return String(entries[0])
    return Object.entries(v)
      .map(([k, val]) => `${k}: ${val}`)
      .join(' / ')
  }
  return String(v)
}
