'use client'

import { useSearchParams } from 'next/navigation'
import { Topbar } from '@/components/layout/topbar'
import { Card } from '@carein/ui-kit'
import { KitForm } from '@/components/fleet/kit-form'

export default function NewKitPage() {
  const params     = useSearchParams()
  const facilityId = params.get('facility') ?? undefined

  return (
    <div>
      <Topbar />
      <div className="p-6">
        <h1 className="text-lg font-semibold mb-5">Nouvelle valise</h1>
        <Card>
          <KitForm defaultFacilityId={facilityId} />
        </Card>
      </div>
    </div>
  )
}
