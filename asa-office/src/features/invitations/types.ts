export type InvitationStatus = 'pending' | 'accepted' | 'revoked' | 'expired'
export type InvitationRole   = 'manager' | 'agent' | 'doctor'

export type Invitation = {
  uuid:         string
  email:        string
  role:         InvitationRole
  status:       InvitationStatus
  invited_by:   { name: string } | null
  expires_at:   string
  accepted_at:  string | null
  created_at:   string
}

export type InvitationList = {
  data: Invitation[]
  meta: { current_page: number; last_page: number; per_page: number; total: number }
}
