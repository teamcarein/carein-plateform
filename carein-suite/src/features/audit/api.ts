import { requireAuth } from '@/features/auth/session'
import { apiGet } from '@/lib/api-client'
import type { AuditLogsListResponse } from './types'

export async function getAuditLogs(params?: {
  tenant?:          string
  bounded_context?: string
  page?:            number
  per_page?:        number
}): Promise<AuditLogsListResponse> {
  const { token } = await requireAuth()
  const qs = new URLSearchParams()
  if (params?.tenant)          qs.set('tenant', params.tenant)
  if (params?.bounded_context) qs.set('bounded_context', params.bounded_context)
  if (params?.page)            qs.set('page', String(params.page))
  if (params?.per_page)        qs.set('per_page', String(params.per_page))
  const query = qs.toString() ? `?${qs.toString()}` : ''
  return apiGet<AuditLogsListResponse>(`/carein/audit-logs${query}`, token)
}
