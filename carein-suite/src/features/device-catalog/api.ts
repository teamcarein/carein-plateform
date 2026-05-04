import { requireAuth } from '@/features/auth/session'
import { apiGet, apiPost, apiPatch } from '@/lib/api-client'
import type {
  DeviceCatalogEntry,
  DeviceCatalogResponse,
  CreateDeviceCatalogInput,
  UpdateDeviceCatalogInput,
} from './types'

export async function getDeviceCatalog(params?: {
  type?:        string
  search?:      string
  active_only?: boolean
  per_page?:    number
  page?:        number
}): Promise<DeviceCatalogResponse> {
  const { token } = await requireAuth()
  const qs = new URLSearchParams()
  if (params?.type)        qs.set('type',        params.type)
  if (params?.search)      qs.set('search',      params.search)
  if (params?.per_page)    qs.set('per_page',    String(params.per_page))
  if (params?.page)        qs.set('page',        String(params.page))
  if (params?.active_only !== undefined) qs.set('active_only', String(params.active_only))
  const query = qs.toString() ? `?${qs.toString()}` : ''
  return apiGet<DeviceCatalogResponse>(`/admin/device-catalog${query}`, token)
}

export async function createDeviceCatalogEntry(
  data: CreateDeviceCatalogInput,
): Promise<{ data: DeviceCatalogEntry }> {
  const { token } = await requireAuth()
  return apiPost<{ data: DeviceCatalogEntry }>('/admin/device-catalog', data, token)
}

export async function updateDeviceCatalogEntry(
  uuid: string,
  data: UpdateDeviceCatalogInput,
): Promise<{ data: DeviceCatalogEntry }> {
  const { token } = await requireAuth()
  return apiPatch<{ data: DeviceCatalogEntry }>(`/admin/device-catalog/${uuid}`, data, token)
}
