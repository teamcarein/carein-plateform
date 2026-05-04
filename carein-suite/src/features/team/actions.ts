'use server'

import { requireAuth } from '@/features/auth/session'
import { apiPost, rethrowIfRedirect } from '@/lib/api-client'
import { revalidatePath } from 'next/cache'
import type { TeamMember } from './types'

export async function inviteTeamMemberAction(data: {
  name:      string
  email:     string
  password?: string
}): Promise<
  | { success: true;  member: TeamMember & { temp_password: string } }
  | { success: false; error: string }
> {
  try {
    const { token } = await requireAuth()
    const res = await apiPost<{ data: TeamMember & { temp_password: string } }>(
      '/carein/team',
      data,
      token,
    )
    revalidatePath('/carein-team')
    return { success: true, member: res.data }
  } catch (err) {
    rethrowIfRedirect(err)
    return { success: false, error: (err as Error).message }
  }
}
