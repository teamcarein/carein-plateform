import { requireAuth } from '@/features/auth/session'
import { apiGet } from '@/lib/api-client'
import type { AnalyticsOverview } from './types'

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  const { token } = await requireAuth()
  return apiGet<AnalyticsOverview>('/carein/analytics/overview', token)
}
