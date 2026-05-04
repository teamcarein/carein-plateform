export type DeviceType     = 'blood_pressure' | 'oximeter' | 'ecg' | 'glucose' | 'temperature' | 'spirometer' | 'scale' | 'other'
export type DeviceProtocol = 'ble' | 'usb' | 'wifi' | 'other'

export const DEVICE_TYPE_LABELS: Record<DeviceType, string> = {
  blood_pressure: 'Tensiomètre',
  oximeter:       'Oxymètre',
  ecg:            'ECG',
  glucose:        'Glycémie',
  temperature:    'Thermomètre',
  spirometer:     'Spiromètre',
  scale:          'Balance',
  other:          'Autre',
}

export const DEVICE_PROTOCOL_LABELS: Record<DeviceProtocol, string> = {
  ble:   'Bluetooth BLE',
  usb:   'USB',
  wifi:  'Wi-Fi',
  other: 'Autre',
}

export interface DeviceCatalogEntry {
  uuid:           string
  name:           string
  manufacturer:   string | null
  type:           DeviceType
  protocol:       DeviceProtocol
  description:    string | null
  specifications: Record<string, string>[] | null
  is_active:      boolean
  created_at:     string
}

export interface DeviceCatalogMeta {
  current_page: number
  last_page:    number
  per_page:     number
  total:        number
}

export interface DeviceCatalogResponse {
  data: DeviceCatalogEntry[]
  meta: DeviceCatalogMeta
}

export interface CreateDeviceCatalogInput {
  name:           string
  type:           DeviceType
  protocol:       DeviceProtocol
  manufacturer?:  string
  description?:   string
}

export interface UpdateDeviceCatalogInput extends Partial<CreateDeviceCatalogInput> {
  is_active?: boolean
}
