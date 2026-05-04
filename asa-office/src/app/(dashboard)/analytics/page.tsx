'use client'

import { useState } from 'react'
import { ClipboardList, CheckCircle, Clock, MapPin, TrendingUp } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardHeader, CardTitle } from '@carein/ui-kit'
import { MetricCard } from '@carein/ui-kit'
import { SkeletonCard } from '@carein/ui-kit'
import { Badge } from '@carein/ui-kit'
import { useManagerDashboard } from '@/features/analytics/hooks'
import { CampaignDashboardEntry } from '@/features/analytics/types'
import { formatCampaignStatus } from '@/lib/formatters'

// ── Helpers ───────────────────────────────────────────────────────────────────

function validationRate(kpi: CampaignDashboardEntry['kpi']): number {
  if (!kpi.total_encounters) return 0
  return Math.round((kpi.validated_encounters / kpi.total_encounters) * 100)
}

function ProgressBar({ value, color = 'var(--color-primary)' }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 rounded-full bg-foreground/8 overflow-hidden w-full">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${value.toFixed(0)}%`, background: color }}
      />
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [selected, setSelected] = useState<string | undefined>()
  const { data: dashboard, isLoading } = useManagerDashboard()

  const campaigns = dashboard?.campaigns ?? []

  // Aggregate KPIs
  const totalEncounters  = campaigns.reduce((s, c) => s + c.kpi.total_encounters,     0)
  const totalValidated   = campaigns.reduce((s, c) => s + c.kpi.validated_encounters,  0)
  const totalPending     = campaigns.reduce((s, c) => s + c.kpi.pending_review,        0)
  const activeCampaigns  = campaigns.length

  // Selected campaign detail
  const detail = selected ? campaigns.find(c => c.uuid === selected) : null

  return (
    <div>
      <Topbar />
      <div className="p-6 space-y-6">

        {/* KPIs */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <MetricCard
                title="Campagnes actives"
                value={activeCampaigns}
                icon={MapPin}
                colorScheme="primary"
              />
              <MetricCard
                title="Dossiers total"
                value={totalEncounters.toLocaleString('fr')}
                icon={ClipboardList}
                colorScheme="secondary"
              />
              <MetricCard
                title="Dossiers validés"
                value={totalValidated.toLocaleString('fr')}
                icon={CheckCircle}
                colorScheme="success"
              />
              <MetricCard
                title="En attente de revue"
                value={totalPending.toLocaleString('fr')}
                icon={Clock}
                colorScheme="warning"
              />
            </>
          )}
        </div>

        {/* Campaign breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Suivi par campagne</CardTitle>
          </CardHeader>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 rounded-[10px] bg-foreground/5 animate-pulse" />
              ))}
            </div>
          ) : campaigns.length === 0 ? (
            <div className="py-14 text-center">
              <MapPin size={32} className="mx-auto text-foreground/20 mb-3" />
              <p className="text-sm text-foreground/40">Aucune campagne active.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {campaigns.map((c) => {
                const rate = validationRate(c.kpi)
                const isSelected = selected === c.uuid
                return (
                  <button
                    key={c.uuid}
                    onClick={() => setSelected(isSelected ? undefined : c.uuid)}
                    className={`w-full text-left px-4 py-3 rounded-[10px] border transition-colors ${
                      isSelected
                        ? 'border-primary/40 bg-primary/5'
                        : 'border-border hover:bg-foreground/[0.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <p className="text-sm font-semibold truncate">{c.name}</p>
                        <Badge variant={c.status as never}>{formatCampaignStatus(c.status)}</Badge>
                      </div>
                      <div className="flex items-center gap-6 shrink-0 text-xs text-foreground/50">
                        <span>
                          <span className="font-mono font-semibold text-foreground">{c.kpi.total_encounters}</span> dossiers
                        </span>
                        <span>
                          <span className="font-mono font-semibold text-warning">{c.kpi.pending_review}</span> en attente
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp size={11} />
                          <span className="font-mono font-semibold text-primary">{rate}%</span>
                        </span>
                      </div>
                    </div>
                    <ProgressBar value={rate} color={rate >= 80 ? 'var(--color-primary)' : rate >= 50 ? 'var(--color-secondary)' : 'var(--color-warning)'} />
                  </button>
                )
              })}
            </div>
          )}
        </Card>

        {/* Campaign detail */}
        {detail && (
          <Card>
            <CardHeader>
              <CardTitle>{detail.name} — Détail</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total dossiers',   value: detail.kpi.total_encounters,     color: 'var(--color-secondary)' },
                { label: 'Validés',          value: detail.kpi.validated_encounters,  color: 'var(--color-primary)'   },
                { label: 'En attente revue', value: detail.kpi.pending_review,        color: 'var(--color-warning)'   },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[12px] border border-border p-4 text-center"
                >
                  <p
                    className="text-3xl font-mono font-extrabold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs text-foreground/50 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

      </div>
    </div>
  )
}
