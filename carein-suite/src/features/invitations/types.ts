export type InvitationStatus = 'pending' | 'accepted' | 'revoked' | 'expired'
export type InvitationRole   = 'owner' | 'manager' | 'agent' | 'doctor'

export interface InvitationTenant {
  uuid: string
  code: string
  name: string
}

export interface InvitationActor {
  uuid: string
  name: string
}

export interface Invitation {
  uuid:        string
  email:       string
  role:        InvitationRole
  status:      InvitationStatus
  tenant:      InvitationTenant | null
  invited_by:  InvitationActor | null
  expires_at:  string
  accepted_at: string | null
  created_at:  string
  link:        string
}

export interface InvitationsListMeta {
  current_page: number
  last_page:    number
  per_page:     number
  total:        number
}

export interface InvitationsListResponse {
  data: Invitation[]
  meta: InvitationsListMeta
}

export interface CreateInvitationInput {
  email:        string
  role:         InvitationRole
  tenant_code?: string
}
