'use client'

import { Package, Tablet, AlertTriangle, Plus } from 'lucide-react'
import Link from 'next/link'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardHeader, CardTitle, Button } from '@carein/ui-kit'
import { MetricCard } from '@carein/ui-kit'
import { KitTable } from '@/components/fleet/kit-table'
import { useFleetOverview } from '@/features/fleet/hooks'

export default function FleetPage() {
  const { data: overview } = useFleetOverview()

  return (
    <div>
      <Topbar />
      <div className="p-6 space-y-6">

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard
            title="Kits actifs"
            value={overview?.kits?.active ?? '—'}
            icon={Package}
            colorScheme="primary"
          />
          <MetricCard
            title="Kits en stock"
            value={overview?.kits?.in_stock ?? '—'}
            icon={Package}
            colorScheme="secondary"
          />
          <MetricCard
            title="Tablettes actives"
            value={overview?.tablets_active ?? '—'}
            icon={Tablet}
            colorScheme="extra"
          />
          <MetricCard
            title="Calibrations dues"
            value={overview?.calibrations_due ?? '—'}
            icon={AlertTriangle}
            colorScheme="warning"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Valises terrain</CardTitle>
            <Link href="/fleet/new">
              <Button size="sm">
                <Plus size={13} /> Nouvelle valise
              </Button>
            </Link>
          </CardHeader>
          <KitTable />
        </Card>

      </div>
    </div>
  )
}
