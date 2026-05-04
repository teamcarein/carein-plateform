export type TeamMemberStatus = 'active' | 'inactive'

export interface TeamMember {
  id:            string
  name:          string
  email:         string
  role:          string
  status:        TeamMemberStatus
  last_login_at: string | null
  created_at:    string
}

export interface TeamListResponse {
  data: TeamMember[]
}
