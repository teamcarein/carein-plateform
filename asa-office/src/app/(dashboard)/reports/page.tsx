'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FileText, Download, Users, Stethoscope, Activity, RefreshCw, Clock } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardHeader, CardTitle } from '@carein/ui-kit'
import { Badge } from '@carein/ui-kit'
import { api } from '@/lib/api-client'
import { formatDatetime, formatRelative } from '@/lib/formatters'

// ── Types ────────────────────────────────────────────────────────────────────

type Report = {
  uuid:          string
  type:          string
  format:        string
  status:        'pending' | 'processing' | 'ready' | 'failed' | 'cancelled'
  requested_at?: string
}

type ReportListResponse = { reports: Report[] }

// ── Hooks ────────────────────────────────────────────────────────────────────

function useReports() {
  return useQuery<ReportListResponse>({
    queryKey: ['reports'],
    queryFn:  () => api.get('reporting/reports'),
    refetchInterval: 10_000,
  })
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function reportStatusVariant(status: Report['status']) {
  const map: Record<Report['status'], string> = {
    pending:    'default',
    processing: 'planned',
    ready:      'active',
    failed:     'cancelled',
    cancelled:  'cancelled',
  }
  return map[status] as never
}

function reportStatusLabel(status: Report['status']) {
  const labels: Record<Report['status'], string> = {
    pending:   'En attente',
    processing: 'En cours',
    ready:     'Prêt',
    failed:    'Échec',
    cancelled: 'Annulé',
  }
  return labels[status]
}

function triggerDownload(path: string, filename: string) {
  const a = document.createElement('a')
  a.href = `/api/${path}`
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

// ── Export card ───────────────────────────────────────────────────────────────

function ExportCard({
  icon: Icon, title, description, color, onClick, loading,
}: {
  icon: React.ElementType; title: string; description: string
  color: string; onClick: () => void; loading?: boolean
}) {
  return (
    <div className="rounded-[14px] border border-border bg-surface p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <div>
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-xs text-foreground/50">{description}</p>
        </div>
      </div>
      <button
        onClick={onClick}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full h-9 rounded-[8px] text-xs font-semibold border border-border hover:bg-foreground/5 transition-colors disabled:opacity-50"
      >
        {loading ? <RefreshCw size={13} className="animate-spin" /> : <Download size={13} />}
        {loading ? 'Export en cours…' : 'Exporter CSV'}
      </button>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const { data: reports, isLoading, refetch } = useReports()
  const [exporting, setExporting] = useState<string | null>(null)

  function handleExport(type: 'patients' | 'encounters' | 'measurements') {
    setExporting(type)
    const date = new Date().toISOString().split('T')[0]
    triggerDownload(`reporting/exports/${type}`, `${type}-${date}.csv`)
    setTimeout(() => setExporting(null), 1500)
  }

  return (
    <div>
      <Topbar />
      <div className="p-6 space-y-6">

        {/* Exports rapides */}
        <div>
          <h2 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider mb-4">
            Exports rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ExportCard
              icon={Users}
              title="Patients"
              description="Liste complète des patients enregistrés"
              color="var(--color-secondary)"
              loading={exporting === 'patients'}
              onClick={() => handleExport('patients')}
            />
            <ExportCard
              icon={Stethoscope}
              title="Dossiers"
              description="Historique de tous les dossiers cliniques"
              color="var(--color-primary)"
              loading={exporting === 'encounters'}
              onClick={() => handleExport('encounters')}
            />
            <ExportCard
              icon={Activity}
              title="Mesures"
              description="Toutes les mesures et résultats d'examens"
              color="var(--color-extra)"
              loading={exporting === 'measurements'}
              onClick={() => handleExport('measurements')}
            />
          </div>
        </div>

        {/* Rapports générés */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Rapports générés</CardTitle>
            <button
              onClick={() => refetch()}
              className="text-xs text-foreground/50 hover:text-foreground flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw size={12} /> Actualiser
            </button>
          </CardHeader>

          {isLoading ? (
            <div className="space-y-3 p-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 rounded-[10px] bg-foreground/5 animate-pulse" />
              ))}
            </div>
          ) : !reports?.reports?.length ? (
            <div className="py-14 text-center">
              <FileText size={32} className="mx-auto text-foreground/20 mb-3" />
              <p className="text-sm text-foreground/40">Aucun rapport généré pour l&apos;instant.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {reports.reports.map((report) => (
                <div
                  key={report.uuid}
                  className="flex items-center justify-between px-4 py-3 rounded-[10px] border border-border hover:bg-foreground/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={15} className="text-foreground/40 shrink-0" />
                    <div>
                      <p className="text-sm font-medium font-mono">{report.type} — {report.format.toUpperCase()}</p>
                      {report.requested_at && (
                        <p className="text-xs text-foreground/40 flex items-center gap-1">
                          <Clock size={10} />
                          Demandé {formatRelative(report.requested_at)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={reportStatusVariant(report.status)}>
                      {reportStatusLabel(report.status)}
                    </Badge>
                    {report.status === 'ready' && (
                      <button
                        onClick={() => triggerDownload(
                          `reporting/reports/${report.uuid}/download`,
                          `report-${report.uuid}.${report.format}`
                        )}
                        className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                      >
                        <Download size={12} /> Télécharger
                      </button>
                    )}
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
