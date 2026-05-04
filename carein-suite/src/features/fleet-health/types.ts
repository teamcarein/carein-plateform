export type HealthScore = 'good' | 'degraded' | 'critical' | 'warning' | 'unknown'

export interface FleetHealthSummary {
  tablets_total:         number
  tablets_online:        number
  tablets_offline:       number
  tablets_alert:         number
  kits_total:            number
  kits_active:           number
  devices_total:         number
  calibrations_due:      number
  calibrations_due_soon: number
}

export interface AlertTablet {
  uuid:         string
  model:        string | null
  serial:       string | null
  last_seen_at: string | null
  tenant:       { code: string; name: string } | null
}

export interface TenantFleetRow {
  code:             string
  name:             string
  tablets_online:   number
  tablets_total:    number
  kits_active:      number
  kits_total:       number
  calibrations_due: number
  last_activity:    string | null
  health:           HealthScore
}

export interface FleetHealthResponse {
  summary:          FleetHealthSummary
  alert_tablets:    AlertTablet[]
  tenant_breakdown: TenantFleetRow[]
}
