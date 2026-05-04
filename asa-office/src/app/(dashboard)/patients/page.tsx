'use client'

import { Users, UserCheck, AlertTriangle, Activity } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { Card } from '@carein/ui-kit'
import { MetricCard } from '@carein/ui-kit'
import { PatientTable } from '@/components/patients/patient-table'
import { usePatients } from '@/features/patients/hooks'

export default function PatientsPage() {
  const { data } = usePatients({ per_page: 1 })

  const total       = data?.meta.total ?? 0
  const avecSurpoids = 0  // sera fourni par l'API backend
  const nouvCeMois  = 0  // sera fourni par l'API backend

  return (
    <div>
      <Topbar />
      <div className="p-6 space-y-6">

        {/* KPIs */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard
            title="Total patients"
            value={total.toLocaleString('fr')}
            icon={Users}
            colorScheme="primary"
          />
          <MetricCard
            title="Enregistrés ce mois"
            value={nouvCeMois || '—'}
            icon={UserCheck}
            colorScheme="secondary"
          />
          <MetricCard
            title="IMC élevé (>25)"
            value={avecSurpoids || '—'}
            icon={Activity}
            colorScheme="warning"
          />
          <MetricCard
            title="Anomalies détectées"
            value="—"
            icon={AlertTriangle}
            colorScheme="danger"
          />
        </div>

        {/* Liste */}
        <Card>
          <PatientTable />
        </Card>

      </div>
    </div>
  )
}
