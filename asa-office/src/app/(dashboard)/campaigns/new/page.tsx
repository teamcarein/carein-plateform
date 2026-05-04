import { Topbar } from '@/components/layout/topbar'
import { Card } from '@carein/ui-kit'
import { CampaignForm } from '@/components/campaigns/campaign-form'

export default function NewCampaignPage() {
  return (
    <div>
      <Topbar />
      <div className="p-6">
        <h1 className="text-lg font-semibold mb-5">Nouvelle campagne</h1>
        <Card>
          <CampaignForm />
        </Card>
      </div>
    </div>
  )
}
