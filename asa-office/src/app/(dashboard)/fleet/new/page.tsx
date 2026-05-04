'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Topbar } from '@/components/layout/topbar'
import { Card } from '@carein/ui-kit'
import { KitForm } from '@/components/fleet/kit-form'

function NewKitContent() {
  const params     = useSearchParams()
  const facilityId = params.get('facility') ?? undefined

  return (
    <Card>
      <KitForm defaultFacilityId={facilityId} />
    </Card>
  )
}

export default function NewKitPage() {
  return (
    <div>
      <Topbar />
      <div className="p-6">
        <h1 className="text-lg font-semibold mb-5">Nouvelle valise</h1>
        <Suspense>
          <NewKitContent />
        </Suspense>
      </div>
    </div>
  )
}
