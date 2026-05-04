import { api } from '@/lib/api-client'
import { Campaign, CampaignStatus, PaginatedResponse } from '@/types'
import { CampaignInput } from './types'

export type CampaignFilters = {
  status?: CampaignStatus
  page?: number
  per_page?: number
}

export function getCampaigns(filters: CampaignFilters = {}): Promise<PaginatedResponse<Campaign>> {
  return api.get('campaigns', filters)
}

export function getCampaign(id: string): Promise<Campaign> {
  return api.get(`campaigns/${id}`)
}

export function createCampaign(data: CampaignInput): Promise<Campaign> {
  return api.post('campaigns', data)
}

export function updateCampaign(uuid: string, data: Partial<CampaignInput>): Promise<Campaign> {
  return api.patch(`campaigns/${uuid}`, data)
}
