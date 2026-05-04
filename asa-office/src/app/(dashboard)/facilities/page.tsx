'use client'

import { Building2, Users } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardHeader, CardTitle } from '@carein/ui-kit'
import { MetricCard } from '@carein/ui-kit'
import { FacilityTable } from '@/components/facilities/facility-table'
import { useFacilities } from '@/features/facilities/hooks'

export default function FacilitiesPage() {
  const { data } = useFacilities()

  const facilities  = data?.data ?? []
  const totalAgents = facilities.reduce((sum, f) => sum + (f.users_count ?? 0), 0)
  const activeSites = facilities.filter(f => f.is_active).length

  return (
    <div>
      <Topbar />
      <div className="p-6 space-y-6">

        {/* KPIs */}
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          <MetricCard
            title="Structures"
            value={data?.meta.total ?? '—'}
            icon={Building2}
            colorScheme="primary"
          />
          <MetricCard
            title="Structures actives"
            value={activeSites}
            icon={Building2}
            colorScheme="secondary"
          />
          <MetricCard
            title="Agents déployés"
            value={totalAgents}
            icon={Users}
            colorScheme="warning"
          />
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Structures médicales</CardTitle>
          </CardHeader>
          <FacilityTable />
        </Card>

      </div>
    </div>
  )
}
