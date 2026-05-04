'use client'

import { use } from 'react'
import Link from 'next/link'
import { Users, Stethoscope, AlertTriangle, FileDown, Calendar, Pencil } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardHeader, CardTitle, Badge, MetricCard, SkeletonCard, Button } from '@carein/ui-kit'
import { PatientTable } from '@/components/patients/patient-table'
import { useCampaign } from '@/features/campaigns/hooks'
import { formatDate, formatObjectiveType, formatCampaignStatus } from '@/lib/formatters'

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: campaign, isLoading, isError, refetch } = useCampaign(id)

  if (isError) {
    return (
      <div>
        <Topbar />
        <div className="p-6 text-center text-foreground/50">
          <p className="mb-3">Campagne introuvable</p>
          <button onClick={() => refetch()} className="text-primary hover:underline text-sm">
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Topbar
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/campaigns/${id}/edit`}>
              <Button size="sm" variant="outline">
                <Pencil size={13} /> Modifier
              </Button>
            </Link>
            <Button size="sm" variant="outline">
              <FileDown size={14} /> Exporter PDF
            </Button>
          </div>
        }
      />
      <div className="p-6 space-y-6">

        {/* Header */}
        <Card>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-5 w-1/3 bg-foreground/8 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-foreground/5 rounded animate-pulse" />
            </div>
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-lg font-semibold">{campaign!.name}</h1>
                  <Badge variant={campaign!.status}>{formatCampaignStatus(campaign!.status)}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/50">
                  <span>{formatObjectiveType(campaign!.objective_type)}</span>
                  {campaign!.organization && (
                    <span>{campaign!.organization.name}</span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    {formatDate(campaign!.starts_at)} → {formatDate(campaign!.ends_at)}
                  </span>
                </div>
                {campaign!.description && (
                  <p className="mt-2 text-sm text-foreground/60">{campaign!.description}</p>
                )}
                {campaign!.target_pathologies && campaign!.target_pathologies.length > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {campaign!.target_pathologies.map((p) => (
                      <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-right text-sm text-foreground/50 shrink-0">
                <p>{campaign!.quota_per_day} patients/j</p>
                <p>{campaign!.quota_per_site} patients/site</p>
                {campaign!.quota_total && <p>Max {campaign!.quota_total} total</p>}
              </div>
            </div>
          )}
        </Card>

        {/* Métriques */}
        <div className="grid grid-cols-3 gap-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <MetricCard
                title="Sites actifs"
                value={campaign!.sites?.length ?? 0}
                icon={Users}
                colorScheme="primary"
              />
              <MetricCard
                title="Protocoles"
                value={campaign!.protocols?.length ?? 0}
                icon={Stethoscope}
                colorScheme="secondary"
              />
              <MetricCard
                title="Taux anomalies"
                value="—"
                icon={AlertTriangle}
                colorScheme="warning"
              />
            </>
          )}
        </div>

        {/* Patients de la campagne */}
        <Card>
          <CardHeader>
            <CardTitle>Patients</CardTitle>
            <Link href={`/campaigns/${id}/patients`} className="text-xs text-primary hover:underline">
              Voir tout
            </Link>
          </CardHeader>
          <PatientTable campaignId={id} />
        </Card>

      </div>
    </div>
  )
}
