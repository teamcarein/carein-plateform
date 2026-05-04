export interface AuditLogActor {
  uuid:  string
  name:  string
  email: string
}

export interface AuditLogTenant {
  uuid: string
  code: string
  name: string
}

export interface AuditLog {
  id:               number
  action:           string
  subject:          string
  subject_id:       number | null
  bounded_context:  string | null
  context:          Record<string, unknown> | null
  performed_by:     AuditLogActor | null
  tenant:           AuditLogTenant | null
  created_at:       string
}

export interface AuditLogsMeta {
  current_page: number
  last_page:    number
  per_page:     number
  total:        number
}

export interface AuditLogsListResponse {
  data: AuditLog[]
  meta: AuditLogsMeta
}
