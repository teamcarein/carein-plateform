export type DeviceType     = 'blood_pressure' | 'oximeter' | 'ecg' | 'glucose' | 'temperature' | 'spirometer' | 'scale' | 'other'
export type DeviceProtocol = 'ble' | 'usb' | 'wifi' | 'other'

export type CatalogEntry = {
  uuid:         string
  name:         string
  manufacturer: string | null
  type:         DeviceType
  protocol:     DeviceProtocol
  description:  string | null
  is_active:    boolean
}

export type CreateCatalogEntryPayload = {
  name:         string
  manufacturer?: string
  type:         DeviceType
  protocol:     DeviceProtocol
  description?: string
}

export type CatalogResponse = {
  data: CatalogEntry[]
  meta: { current_page: number; last_page: number; per_page: number; total: number }
}
