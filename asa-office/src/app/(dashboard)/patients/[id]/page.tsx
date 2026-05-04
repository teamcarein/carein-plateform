'use client'

import { use } from 'react'
import { User, Activity, Ruler, Scale, Droplets, Building2, Pencil } from 'lucide-react'
import Link from 'next/link'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardHeader, CardTitle, Badge, RiskGauge, Button } from '@carein/ui-kit'
import { EncounterTable } from '@/components/encounters/encounter-table'
import { usePatient } from '@/features/patients/hooks'
import { formatDate, formatAge, formatBmi } from '@/lib/formatters'

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: patient, isLoading, isError, refetch } = usePatient(id)

  if (isError) {
    return (
      <div>
        <Topbar />
        <div className="p-6 text-center text-foreground/50">
          <p className="mb-3">Patient introuvable</p>
          <button onClick={() => refetch()} className="text-primary hover:underline text-sm">
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  const isSurpoids = patient?.bmi && patient.bmi > 25

  return (
    <div>
      <Topbar
        actions={
          <Link href={`/patients/${id}/edit`}>
            <Button size="sm" variant="outline"><Pencil size={13} /> Modifier</Button>
          </Link>
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
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <User size={22} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-lg font-semibold">
                    {patient!.first_name
                      ? `${patient!.first_name} ${patient!.last_name}`
                      : patient!.last_name}
                  </h1>
                  {patient!.blood_type && (
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
                      {patient!.blood_type}
                    </span>
                  )}
                  {isSurpoids && <Badge variant="anomaly">Surpoids</Badge>}
                </div>
                <div className="flex items-center gap-4 text-sm text-foreground/50 flex-wrap">
                  <span className="font-mono text-xs">{patient!.patient_code}</span>
                  {patient!.gender && (
                    <span>{patient!.gender === 'male' ? 'Homme' : 'Femme'}</span>
                  )}
                  {patient!.birth_date && (
                    <span>{formatAge(patient!.birth_date)} ans ({formatDate(patient!.birth_date)})</span>
                  )}
                  {patient!.facility && (
                    <span className="flex items-center gap-1">
                      <Building2 size={12} />
                      {patient!.facility.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Biométrie */}
          <Card>
            <CardHeader><CardTitle>Biométrie</CardTitle></CardHeader>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-8 bg-foreground/5 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <dl className="space-y-3 text-sm">
                <Row icon={<Ruler size={13} />} label="Taille"
                  value={patient!.height_cm ? `${patient!.height_cm} cm` : '—'} />
                <Row icon={<Scale size={13} />} label="Poids"
                  value={patient!.weight_kg ? `${patient!.weight_kg} kg` : '—'} />
                <Row icon={<Activity size={13} />} label="IMC"
                  value={patient!.bmi ? formatBmi(patient!.bmi) : '—'}
                  highlight={isSurpoids ? 'warning' : undefined} />
                <Row icon={<Droplets size={13} />} label="Groupe sanguin"
                  value={patient!.blood_type ?? '—'}
                  mono />
                <Row label="Téléphone" value={patient!.phone ?? '—'} mono />
              </dl>
            )}
          </Card>

          {/* Score de risque */}
          <Card className="flex flex-col items-center justify-center py-4">
            <CardHeader><CardTitle>Score de risque</CardTitle></CardHeader>
            {isLoading ? (
              <div className="w-24 h-24 rounded-full bg-foreground/8 animate-pulse" />
            ) : (
              <RiskGauge score={0} size="lg" />
            )}
          </Card>

          {/* Dernières mesures */}
          <Card>
            <CardHeader><CardTitle>Dernières mesures</CardTitle></CardHeader>
            <p className="text-sm text-foreground/40 text-center py-8">Aucune mesure disponible</p>
          </Card>
        </div>

        {/* Dossiers patient */}
        <Card>
          <CardHeader><CardTitle>Dossiers de visite</CardTitle></CardHeader>
          {!isLoading && <EncounterTable patientId={id} />}
        </Card>

      </div>
    </div>
  )
}

function Row({
  icon, label, value, highlight, mono,
}: {
  icon?: React.ReactNode
  label: string
  value: string
  highlight?: 'warning'
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-foreground/50 flex items-center gap-1.5">
        {icon}
        {label}
      </dt>
      <dd className={[
        mono ? 'font-mono text-xs' : '',
        highlight === 'warning' ? 'font-semibold text-warning' : 'font-medium',
      ].join(' ')}>
        {value}
      </dd>
    </div>
  )
}
