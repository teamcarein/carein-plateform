'use client'

import { ClipboardList, CheckCircle, Clock, MapPin } from 'lucide-react'
import { MetricCard } from '@carein/ui-kit'
import { Card, CardHeader, CardTitle } from '@carein/ui-kit'
import { SkeletonCard } from '@carein/ui-kit'
import { Badge } from '@carein/ui-kit'
import { Topbar } from '@/components/layout/topbar'
import { useManagerDashboard } from '@/features/analytics/hooks'
import { formatCampaignStatus } from '@/lib/formatters'

export default function DashboardPage() {
  const { data: dashboard, isLoading, isError, refetch } = useManagerDashboard()

  const campaigns       = dashboard?.campaigns ?? []
  const totalEncounters = campaigns.reduce((s, c) => s + c.kpi.total_encounters,    0)
  const totalValidated  = campaigns.reduce((s, c) => s + c.kpi.validated_encounters, 0)
  const totalPending    = campaigns.reduce((s, c) => s + c.kpi.pending_review,       0)

  if (isError) {
    return (
      <div>
        <Topbar />
        <div className="p-6 text-center text-foreground/50">
          <p className="mb-3">Erreur lors du chargement du tableau de bord</p>
          <button onClick={() => refetch()} className="text-primary hover:underline text-sm">
            Réessayer
          </button>
        </div>
      </div>
    )
  }

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
                value={campaigns.length}
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

        {/* Campaign list */}
        <Card>
          <CardHeader>
            <CardTitle>Campagnes en cours</CardTitle>
          </CardHeader>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 rounded-[8px] bg-foreground/5 animate-pulse" />
              ))}
            </div>
          ) : campaigns.length === 0 ? (
            <div className="py-10 text-center">
              <MapPin size={28} className="mx-auto text-foreground/20 mb-2" />
              <p className="text-sm text-foreground/40">Aucune campagne active.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {campaigns.map((c) => {
                const rate = c.kpi.total_encounters
                  ? Math.round((c.kpi.validated_encounters / c.kpi.total_encounters) * 100)
                  : 0
                return (
                  <div key={c.uuid} className="flex items-center justify-between px-3 py-2.5 rounded-[8px] border border-border">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="text-sm font-medium truncate">{c.name}</p>
                      <Badge variant={c.status as never}>{formatCampaignStatus(c.status)}</Badge>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 text-xs text-foreground/50">
                      <span>
                        <span className="font-mono font-semibold text-foreground">{c.kpi.total_encounters}</span> dossiers
                      </span>
                      <span className="font-mono font-semibold text-primary">{rate}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

      </div>
    </div>
  )
}
