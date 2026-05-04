import { api } from '@/lib/api-client'
import type { Invitation, InvitationList, InvitationRole } from './types'

export function getInvitations(params?: { status?: string }): Promise<InvitationList> {
  return api.get('invitations', params)
}

export function createInvitation(data: { email: string; role: InvitationRole }): Promise<{ data: Invitation }> {
  return api.post('invitations', data)
}

export function revokeInvitation(uuid: string): Promise<{ status: string }> {
  return api.delete(`invitations/${uuid}`)
}
