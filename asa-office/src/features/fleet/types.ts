export type TabletUser = {
  id:        string
  name:      string
  matricule: string
  facility:  { id: string; name: string } | null
  is_active: boolean
}

export type ProvisioningToken = {
  token:      string
  expires_at: string
}

export type KitType   = 'maternity' | 'cardiology' | 'pediatrics' | 'general' | 'custom'
export type KitStatus = 'in_stock' | 'assigned' | 'active' | 'in_transit' | 'maintenance' | 'retired'

export type KitDevice = {
  id:           string
  kit_id:       string
  device_id:    string
  attached_at:  string
  detached_at?: string
  ble_address?: string
  device?: {
    id:             string
    name:           string
    type:           string
    serial_number?: string
    fleet_status:   string
    calibration_next_at?: string
  }
}

export type Tablet = {
  id:                string
  assigned_user_id?: string
  serial?:           string
  model?:            string
  status:            'pending' | 'active' | 'revoked' | 'wiped'
  android_version?:  string
  battery_health_pct?: number
  free_storage_mb?:  number
  app_version?:      string
  last_seen_at?:     string
  created_at:        string
  user?: { id: string; name: string; email: string }
}

export type Kit = {
  id:                   string
  uuid:                 string
  code:                 string
  name:                 string
  kit_type:             KitType
  status:               KitStatus
  tablet_id?:           string
  assigned_facility_id?: string
  assigned_campaign_id?: string
  assigned_user_id?:    string
  last_synced_at?:      string
  notes?:               string
  created_at:           string
  tablet?:              Tablet
  active_devices?:      KitDevice[]
  facility?:            { id: string; name: string }
  campaign?:            { id: string; name: string }
  user?:                { id: string; name: string }
}

export type FleetOverview = {
  kits:                  Record<string, number>
  devices:               Record<string, number>
  calibrations_due:      number
  calibrations_due_soon: number
  tablets_total:         number
  tablets_active:        number
}

export type FleetDevice = {
  id:                    string
  name:                  string
  type:                  string
  serial_number?:        string
  firmware_version?:     string
  fleet_status:          'active' | 'maintenance' | 'retired' | 'lost'
  calibration_last_at?:  string
  calibration_next_at?:  string
  qr_code?:              string
  purchase_date?:        string
  warranty_until?:       string
  current_kit?:          { id: string; code: string; name: string }
  facility?:             { id: string; name: string }
}
