import { useRouter } from 'next/navigation'
import { Campaign } from '@/types'
import { Badge } from '@carein/ui-kit'
import { Card } from '@carein/ui-kit'
import { formatDate, formatObjectiveType, formatCampaignStatus } from '@/lib/formatters'

type CampaignCardProps = {
  campaign: Campaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const router = useRouter()

  return (
    <Card
      className="cursor-pointer hover:border-primary/40 transition-colors"
      onClick={() => router.push(`/campaigns/${campaign.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{campaign.name}</p>
          <p className="text-xs text-foreground/50 mt-0.5">{formatObjectiveType(campaign.objective_type)}</p>
        </div>
        <Badge variant={campaign.status} className="ml-2 shrink-0">
          {formatCampaignStatus(campaign.status)}
        </Badge>
      </div>

      {campaign.organization && (
        <p className="text-xs text-foreground/60 mb-3 truncate">{campaign.organization.name}</p>
      )}

      <div className="flex items-center justify-between text-xs text-foreground/50">
        <span className="font-mono">{formatDate(campaign.starts_at)}</span>
        <div className="flex items-center gap-3">
          <span>
            <span className="font-mono font-semibold text-foreground">{campaign.quota_per_day}</span>
            {' '}/ jour
          </span>
          <span>
            <span className="font-mono font-semibold text-foreground">{campaign.quota_per_site}</span>
            {' '}/ site
          </span>
        </div>
      </div>
    </Card>
  )
}
