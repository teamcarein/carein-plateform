'use client'

import { use } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { Card } from '@carein/ui-kit'
import { PatientTable } from '@/components/patients/patient-table'
import { useCampaign } from '@/features/campaigns/hooks'

export default function CampaignPatientsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: campaign } = useCampaign(id)

  return (
    <div>
      <Topbar />
      <div className="p-6 space-y-4">
        <h1 className="text-lg font-semibold">
          Patients {campaign ? `— ${campaign.name}` : ''}
        </h1>
        <Card>
          <PatientTable campaignId={id} />
        </Card>
      </div>
    </div>
  )
}
