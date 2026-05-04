import { api } from '@/lib/api-client'
import type { CatalogEntry, CatalogResponse, CreateCatalogEntryPayload } from './types'

export function getDeviceCatalog(params?: { search?: string; type?: string; active_only?: boolean }): Promise<CatalogResponse> {
  return api.get('fleet/device-catalog', { ...params, per_page: 100 })
}

export function createCatalogEntry(payload: CreateCatalogEntryPayload): Promise<CatalogEntry> {
  return api.post('fleet/device-catalog', payload)
}

export function toggleCatalogEntry(uuid: string, is_active: boolean): Promise<CatalogEntry> {
  return api.patch(`fleet/device-catalog/${uuid}`, { is_active })
}

export function provisionDeviceForKit(
  kitUuid: string,
  payload: { device_catalog_uuid: string; serial_number?: string },
): Promise<CatalogEntry> {
  return api.post(`fleet/kits/${kitUuid}/provision-device`, payload)
}
