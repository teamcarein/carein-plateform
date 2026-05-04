import { api } from '@/lib/api-client'
import { Patient, PaginatedResponse } from '@/types'

export type PatientFilters = {
  campaign_id?: string
  facility_id?: string
  gender?: Patient['gender']
  search?: string
  page?: number
  per_page?: number
}

export type PatientSearchParams = {
  q: string
  per_page?: number
}

export function getPatients(filters: PatientFilters = {}): Promise<PaginatedResponse<Patient>> {
  return api.get('patients', filters)
}

export function searchPatients(params: PatientSearchParams): Promise<PaginatedResponse<Patient>> {
  return api.get('patients/search', { q: params.q, per_page: params.per_page })
}

export function getPatient(id: string): Promise<Patient> {
  return api.get(`patients/${id}`)
}

export type UpdatePatientInput = {
  last_name?:  string
  first_name?: string
  birth_date?: string
  gender?:     'male' | 'female'
  phone?:      string
  height_cm?:  number
  weight_kg?:  number
}

export function updatePatient(id: string, data: UpdatePatientInput): Promise<Patient> {
  return api.patch(`patients/${id}`, data)
}
