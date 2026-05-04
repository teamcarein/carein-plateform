export interface ImpersonationUser {
  uuid:  string
  name:  string
  email: string
  role:  string | null
}

export interface ImpersonationTenant {
  uuid: string
  code: string
  name: string
}

export interface ImpersonationSession {
  token:      string
  user:       ImpersonationUser
  tenant:     ImpersonationTenant | null
  expires_at: string
}
