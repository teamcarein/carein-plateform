import { api } from '@/lib/api-client'
import { Facility, PaginatedResponse } from '@/types'

export type FacilityFilters = {
  active_only?: boolean
  page?: number
  per_page?: number
}

export function getFacilities(filters: FacilityFilters = {}): Promise<PaginatedResponse<Facility>> {
  return api.get('facilities', filters)
}

export function getFacility(id: string): Promise<Facility> {
  return api.get(`facilities/${id}`)
}
