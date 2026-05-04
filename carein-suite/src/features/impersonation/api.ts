import { requireAuth } from '@/features/auth/session'
import { apiGet, apiPost } from '@/lib/api-client'
import type { ImpersonationUser, ImpersonationSession } from './types'

export async function getTenantUsers(tenantCode: string): Promise<ImpersonationUser[]> {
  const { token } = await requireAuth()
  const res = await apiGet<{ data: ImpersonationUser[] }>(
    `/carein/users?tenant=${tenantCode}`,
    token,
  )
  return res.data
}

export async function startImpersonation(
  userUuid: string,
  reason?: string,
): Promise<ImpersonationSession> {
  const { token } = await requireAuth()
  return apiPost<ImpersonationSession>(
    '/carein/impersonate',
    { user_uuid: userUuid, reason },
    token,
  )
}
