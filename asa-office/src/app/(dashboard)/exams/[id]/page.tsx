'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardHeader, CardTitle, Badge, RiskGauge } from '@carein/ui-kit'
import { ExamResults } from '@/components/exams/exam-results'
import { useExam } from '@/features/exams/hooks'
import { formatDate, formatExamStatus, formatExamCategory } from '@/lib/formatters'

export default function ExamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: exam, isLoading } = useExam(id)

  return (
    <div>
      <Topbar />
      <div className="p-6 space-y-6">
        <Card>
          {isLoading ? (
            <div className="h-16 bg-foreground/5 rounded animate-pulse" />
          ) : exam ? (
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <Link
                    href={`/encounters/${exam.encounter_id}`}
                    className="flex items-center gap-1 text-sm text-foreground/50 hover:text-foreground transition-colors"
                  >
                    <ArrowLeft size={14} />
                    Retour au dossier
                  </Link>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <h1 className="text-lg font-semibold">{formatExamCategory(exam.category)}</h1>
                  <Badge variant={exam.status}>{formatExamStatus(exam.status)}</Badge>
                </div>
                <p className="text-sm text-foreground/50 mt-1">{formatDate(exam.started_at)}</p>
              </div>
              {exam.risk_score !== undefined && (
                <RiskGauge score={exam.risk_score} size="md" />
              )}
            </div>
          ) : null}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mesures</CardTitle>
          </CardHeader>
          <ExamResults examId={id} />
        </Card>
      </div>
    </div>
  )
}
