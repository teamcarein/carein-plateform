'use client'

import { use } from 'react'
import Link from 'next/link'
import { User, Calendar, Building2, ClipboardList } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardHeader, CardTitle, Badge, RiskGauge } from '@carein/ui-kit'
import { useEncounter, useEncounterExams } from '@/features/encounters/hooks'
import { formatDate, formatEncounterStatus, formatEncounterType, formatExamCategory, formatExamStatus } from '@/lib/formatters'

export default function EncounterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: encounter, isLoading, isError, refetch } = useEncounter(id)
  const { data: exams } = useEncounterExams(id)

  if (isError) {
    return (
      <div>
        <Topbar />
        <div className="p-6 text-center text-foreground/50">
          <p className="mb-3">Dossier introuvable</p>
          <button onClick={() => refetch()} className="text-primary hover:underline text-sm">
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  const patient = encounter?.patient

  return (
    <div>
      <Topbar />
      <div className="p-6 space-y-6">

        {/* Header */}
        <Card>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-5 w-1/3 bg-foreground/8 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-foreground/5 rounded animate-pulse" />
            </div>
          ) : encounter ? (
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <ClipboardList size={18} className="text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h1 className="text-lg font-semibold">Dossier de visite</h1>
                    <Badge variant={encounter.status as never}>
                      {formatEncounterStatus(encounter.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-foreground/50 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(encounter.started_at)}
                    </span>
                    <span>{formatEncounterType(encounter.type)}</span>
                    {encounter.facility && (
                      <span className="flex items-center gap-1">
                        <Building2 size={12} />
                        {encounter.facility.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {encounter.risk_score !== undefined && (
                <RiskGauge score={encounter.risk_score} size="md" />
              )}
            </div>
          ) : null}
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Patient */}
          <Card>
            <CardHeader><CardTitle>Patient</CardTitle></CardHeader>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-6 bg-foreground/5 rounded animate-pulse" />
                ))}
              </div>
            ) : patient ? (
              <Link href={`/patients/${patient.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {patient.first_name
                      ? `${patient.first_name} ${patient.last_name}`
                      : patient.last_name}
                  </p>
                  <p className="font-mono text-xs text-foreground/40">{patient.patient_code}</p>
                </div>
              </Link>
            ) : null}
          </Card>

          {/* Score global */}
          <Card className="flex flex-col items-center justify-center py-2">
            <CardHeader><CardTitle>Score de risque</CardTitle></CardHeader>
            {isLoading ? (
              <div className="w-20 h-20 rounded-full bg-foreground/8 animate-pulse" />
            ) : (
              <RiskGauge score={encounter?.risk_score ?? 0} size="lg" />
            )}
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
            {isLoading ? (
              <div className="h-16 bg-foreground/5 rounded animate-pulse" />
            ) : (
              <p className="text-sm text-foreground/50">
                {encounter?.notes ?? 'Aucune note pour ce dossier.'}
              </p>
            )}
          </Card>
        </div>

        {/* Examens du dossier */}
        <Card>
          <CardHeader>
            <CardTitle>Examens réalisés</CardTitle>
          </CardHeader>
          {!exams || exams.length === 0 ? (
            <p className="text-sm text-foreground/40 text-center py-8">Aucun examen enregistré dans ce dossier</p>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {exams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between py-3 gap-4">
                  <div>
                    <p className="text-sm font-medium">{formatExamCategory(exam.category)}</p>
                    <p className="text-xs text-foreground/40 mt-0.5">{formatDate(exam.started_at)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {exam.risk_score !== undefined && (
                      <span className={`font-mono text-sm font-semibold ${
                        exam.risk_score >= 75 ? 'text-danger'
                          : exam.risk_score >= 50 ? 'text-warning'
                          : 'text-primary'
                      }`}>
                        {exam.risk_score}%
                      </span>
                    )}
                    <Badge variant={exam.status as never}>{formatExamStatus(exam.status)}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>
    </div>
  )
}
