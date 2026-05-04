'use client'

import { useQuery } from '@tanstack/react-query'
import { getManagerDashboard } from './api'

export function useManagerDashboard(campaignUuid?: string) {
  return useQuery({
    queryKey: ['analytics', 'dashboard', campaignUuid],
    queryFn:  () => getManagerDashboard(campaignUuid),
    staleTime: 1000 * 60 * 5,
  })
}
