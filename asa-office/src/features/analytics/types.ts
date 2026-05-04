export type CampaignKpi = {
  total_encounters:     number
  validated_encounters: number
  pending_review:       number
}

export type CampaignDashboardEntry = {
  uuid:   string
  name:   string
  status: string
  kpi:    CampaignKpi
}

export type ManagerDashboard = {
  campaigns: CampaignDashboardEntry[]
}
