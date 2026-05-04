'use server'

import { requireAuth } from '@/features/auth/session'
import { apiGet, apiPost, rethrowIfRedirect } from '@/lib/api-client'
import type { ImpersonationUser, ImpersonationSession } from './types'

export async function getTenantUsersAction(
  tenantCode: string,
): Promise<{ success: true; users: ImpersonationUser[] } | { success: false; error: string }> {
  try {
    const { token } = await requireAuth()
    const res = await apiGet<{ data: ImpersonationUser[] }>(
      `/carein/users?tenant=${tenantCode}`,
      token,
    )
    return { success: true, users: res.data }
  } catch (err) {
    rethrowIfRedirect(err)
    return { success: false, error: (err as Error).message }
  }
}

export async function startImpersonationAction(
  userUuid: string,
  reason?: string,
): Promise<{ success: true; session: ImpersonationSession } | { success: false; error: string }> {
  try {
    const { token } = await requireAuth()
    const session = await apiPost<ImpersonationSession>(
      '/carein/impersonate',
      { user_uuid: userUuid, reason: reason || undefined },
      token,
    )
    return { success: true, session }
  } catch (err) {
    rethrowIfRedirect(err)
    return { success: false, error: (err as Error).message }
  }
}
