export type BrandOperatorStatus = 'pending' | 'active' | 'suspended' | 'archived'
export type TenantType = 'ngo' | 'public' | 'private' | 'government'

// Shape de TenantResource retourné par le backend
export interface BrandOperator {
  id:           string   // uuid retourné comme "id" par TenantResource
  code:         string
  name:         string
  type:         TenantType
  country:      string
  language:     string
  currency:     string
  timezone:     string
  logo_path:    string | null
  theme:        Record<string, unknown> | null
  settings:     Record<string, unknown> | null
  status:       BrandOperatorStatus
  activated_at: string | null
  suspended_at: string | null
  archived_at:  string | null
  created_at:   string
}

// POST /admin/tenants
export interface CreateTenantInput {
  code:      string   // max 6, /^[A-Z0-9]{3,6}$/
  name:      string
  type:      TenantType
  country:   string   // 2 chars ISO
  language:  string   // max 5, ex: "fr", "fr-FR"
  currency:  string   // 3 chars ISO, ex: "XOF"
  timezone:  string   // ex: "Africa/Abidjan"
  theme?:    Record<string, unknown>
  settings?: Record<string, unknown>
}

// PATCH /admin/tenants/{uuid}
export interface UpdateTenantInput {
  name?:     string
  type?:     TenantType
  country?:  string
  language?: string
  currency?: string
  timezone?: string
}

// Réponse list — le backend retourne le résultat brut du handler
export interface TenantsListResponse {
  data:          BrandOperator[]
  current_page?: number
  per_page?:     number
  total?:        number
}
