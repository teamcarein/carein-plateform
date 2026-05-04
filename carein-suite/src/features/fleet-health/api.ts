import { requireAuth } from '@/features/auth/session'
import { apiGet } from '@/lib/api-client'
import type { FleetHealthResponse } from './types'

export async function getFleetHealth(): Promise<FleetHealthResponse> {
  const { token } = await requireAuth()
  return apiGet<FleetHealthResponse>('/carein/fleet/health', token)
}
