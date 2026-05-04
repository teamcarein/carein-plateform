import { api } from '@/lib/api-client'
import { ManagerDashboard } from './types'

export function getManagerDashboard(campaignUuid?: string): Promise<ManagerDashboard> {
  return api.get('reporting/dashboards/manager', campaignUuid ? { campaign_uuid: campaignUuid } : {})
}
