import { requireAuth } from '@/features/auth/session'
import { apiGet } from '@/lib/api-client'
import type { TeamListResponse, TeamMember } from './types'

export async function getTeamMembers(): Promise<TeamMember[]> {
  const { token } = await requireAuth()
  const res = await apiGet<TeamListResponse>('/carein/team', token)
  return res.data
}
