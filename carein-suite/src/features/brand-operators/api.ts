import { requireAuth } from '@/features/auth/session'
import { apiGet, apiPatch, apiPost } from '@/lib/api-client'
import type { BrandOperator, TenantsListResponse, CreateTenantInput, UpdateTenantInput } from './types'

// GET /admin/tenants
export async function getBrandOperators(params?: {
  status?:  string
  country?: string
}): Promise<TenantsListResponse> {
  const { token } = await requireAuth()
  const qs = new URLSearchParams()
  if (params?.status)  qs.set('status', params.status)
  if (params?.country) qs.set('country', params.country)
  const query = qs.toString() ? `?${qs.toString()}` : ''
  return apiGet<TenantsListResponse>(`/admin/tenants${query}`, token)
}

// GET /admin/tenants/{uuid}
export async function getBrandOperator(uuid: string): Promise<BrandOperator> {
  const { token } = await requireAuth()
  const res = await apiGet<{ data: BrandOperator }>(`/admin/tenants/${uuid}`, token)
  return res.data
}

// PATCH /admin/tenants/{uuid}
export async function updateBrandOperator(uuid: string, data: UpdateTenantInput): Promise<BrandOperator> {
  const { token } = await requireAuth()
  const res = await apiPatch<{ data: BrandOperator }>(`/admin/tenants/${uuid}`, data, token)
  return res.data
}

// POST /admin/tenants
export async function createBrandOperator(data: CreateTenantInput): Promise<BrandOperator> {
  const { token } = await requireAuth()
  const res = await apiPost<{ data: BrandOperator }>('/admin/tenants', data, token)
  return res.data
}

// POST /admin/tenants/{uuid}/activate (pending → active)
export async function activateBrandOperator(uuid: string): Promise<BrandOperator> {
  const { token } = await requireAuth()
  const res = await apiPost<{ data: BrandOperator }>(`/admin/tenants/${uuid}/activate`, {}, token)
  return res.data
}

// POST /admin/tenants/{uuid}/suspend (active → suspended, body: {reason?})
export async function suspendBrandOperator(uuid: string, reason?: string): Promise<BrandOperator> {
  const { token } = await requireAuth()
  const res = await apiPost<{ data: BrandOperator }>(
    `/admin/tenants/${uuid}/suspend`,
    reason ? { reason } : {},
    token,
  )
  return res.data
}

// POST /admin/tenants/{uuid}/reactivate (suspended → active)
export async function reactivateBrandOperator(uuid: string): Promise<BrandOperator> {
  const { token } = await requireAuth()
  const res = await apiPost<{ data: BrandOperator }>(`/admin/tenants/${uuid}/reactivate`, {}, token)
  return res.data
}

// POST /admin/tenants/{uuid}/archive (suspended → archived)
export async function archiveBrandOperator(uuid: string): Promise<BrandOperator> {
  const { token } = await requireAuth()
  const res = await apiPost<{ data: BrandOperator }>(`/admin/tenants/${uuid}/archive`, {}, token)
  return res.data
}
