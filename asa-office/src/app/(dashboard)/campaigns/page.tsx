import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { Button } from '@carein/ui-kit'
import { Card } from '@carein/ui-kit'
import { CampaignTable } from '@/components/campaigns/campaign-table'

export default function CampaignsPage() {
  return (
    <div>
      <Topbar
        actions={
          <Link href="/campaigns/new">
            <Button size="sm">
              <Plus size={14} />
              Nouvelle campagne
            </Button>
          </Link>
        }
      />
      <div className="p-6">
        <Card>
          <CampaignTable />
        </Card>
      </div>
    </div>
  )
}
