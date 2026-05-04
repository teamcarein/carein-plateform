import { api } from '@/lib/api-client'
import { PaginatedResponse } from '@/types'
import { Kit, FleetDevice, FleetOverview, Tablet, TabletUser, ProvisioningToken } from './types'

export type CreateKitInput = {
  name:                   string
  code:                   string
  kit_type:               Kit['kit_type']
  status?:                Kit['status']
  notes?:                 string
  assigned_facility_id?:  string
  assigned_campaign_id?:  string
}

export type UpdateKitInput = Partial<CreateKitInput>

export type KitFilters = {
  status?:      Kit['status']
  kit_type?:    Kit['kit_type']
  facility_id?: string
  campaign_id?: string
  page?:        number
  per_page?:    number
}

export type FleetDeviceFilters = {
  fleet_status?: FleetDevice['fleet_status']
  type?: string
  page?: number
  per_page?: number
}

export function getKits(filters: KitFilters = {}): Promise<PaginatedResponse<Kit>> {
  return api.get('fleet/kits', filters)
}

export function getKit(id: string): Promise<Kit> {
  return api.get(`fleet/kits/${id}`)
}

export function getFleetOverview(): Promise<FleetOverview> {
  return api.get('fleet/overview')
}

export function getFleetDevices(filters: FleetDeviceFilters = {}): Promise<PaginatedResponse<FleetDevice>> {
  return api.get('fleet/devices', filters)
}

export function getFleetDevice(id: string): Promise<FleetDevice> {
  return api.get(`fleet/devices/${id}`)
}

export function getTablets(): Promise<PaginatedResponse<Tablet>> {
  return api.get('admin/tablets')
}

export function getCalibrationsDue(): Promise<{ data: FleetDevice[] }> {
  return api.get('fleet/calibrations/due')
}

export function assignTabletToKit(kitUuid: string, tabletUuid: string): Promise<Kit> {
  return api.post(`fleet/kits/${kitUuid}/assign-tablet`, { tablet_uuid: tabletUuid })
}

export function getTabletUsers(): Promise<{ data: TabletUser[] }> {
  return api.get('admin/tablets/users')
}

export function createTabletUser(data: {
  name: string
  matricule: string
  pin: string
  facility_id?: number
}): Promise<TabletUser> {
  return api.post('admin/tablets/users', data)
}

export function generateProvisioningToken(userUuid: string): Promise<ProvisioningToken> {
  return api.post(`admin/tablets/users/${userUuid}/provisioning-token`)
}

export function createKit(data: CreateKitInput): Promise<Kit> {
  return api.post('fleet/kits', data)
}

export function updateKit(id: string, data: UpdateKitInput): Promise<Kit> {
  return api.patch(`fleet/kits/${id}`, data)
}

export function deleteKit(id: string): Promise<void> {
  return api.delete(`fleet/kits/${id}`)
}
