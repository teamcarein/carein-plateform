import { api } from '@/lib/api-client'
import { Device, PaginatedResponse } from '@/types'

export type DeviceFilters = {
  facility_id?: string
  status?: Device['status']
  type?: Device['type']
  page?: number
  per_page?: number
}

export function getDevices(filters: DeviceFilters = {}): Promise<PaginatedResponse<Device>> {
  return api.get('devices', filters)
}

export function getDevice(id: string): Promise<Device> {
  return api.get(`devices/${id}`)
}
