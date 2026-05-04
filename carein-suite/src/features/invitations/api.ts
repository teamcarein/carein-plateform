import { requireAuth } from '@/features/auth/session'
import { apiGet, apiPost, apiDelete } from '@/lib/api-client'
import type {
  Invitation,
  InvitationsListResponse,
  CreateInvitationInput,
} from './types'

export async function getInvitations(params?: {
  status?:  string
  tenant?:  string
  per_page?: number
}): Promise<InvitationsListResponse> {
  const { token } = await requireAuth()
  const qs = new URLSearchParams()
  if (params?.status)   qs.set('status',   params.status)
  if (params?.tenant)   qs.set('tenant',   params.tenant)
  if (params?.per_page) qs.set('per_page', String(params.per_page))
  const query = qs.toString() ? `?${qs.toString()}` : ''
  return apiGet<InvitationsListResponse>(`/carein/invitations${query}`, token)
}

export async function createInvitation(data: CreateInvitationInput): Promise<{ data: Invitation }> {
  const { token } = await requireAuth()
  return apiPost<{ data: Invitation }>('/carein/invitations', data, token)
}

export async function getInvitation(uuid: string): Promise<{ data: Invitation }> {
  const { token } = await requireAuth()
  return apiGet<{ data: Invitation }>(`/carein/invitations/${uuid}`, token)
}

export async function revokeInvitation(uuid: string): Promise<void> {
  const { token } = await requireAuth()
  await apiDelete(`/carein/invitations/${uuid}`, token)
}
