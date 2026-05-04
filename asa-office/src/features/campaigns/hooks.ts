'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCampaigns, getCampaign, createCampaign, updateCampaign, type CampaignFilters } from './api'
import { CampaignInput } from './types'

export function useCampaigns(filters: CampaignFilters = {}) {
  return useQuery({
    queryKey: ['campaigns', filters],
    queryFn: () => getCampaigns(filters),
  })
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ['campaigns', id],
    queryFn: () => getCampaign(id),
    enabled: !!id,
  })
}

export function useCreateCampaign() {
  const qc = useQueryClient()
  return useMutation<ReturnType<typeof createCampaign> extends Promise<infer T> ? T : never, Error, CampaignInput>({
    mutationFn: (data: CampaignInput) => createCampaign(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['campaigns'] }),
  })
}

export function useUpdateCampaign(uuid: string) {
  const qc = useQueryClient()
  return useMutation<ReturnType<typeof updateCampaign> extends Promise<infer T> ? T : never, Error, Partial<CampaignInput>>({
    mutationFn: (data) => updateCampaign(uuid, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['campaigns'] }),
  })
}
