import { api } from '@/lib/api-client'
import { Encounter, Exam, PaginatedResponse } from '@/types'

export type EncounterFilters = {
  page?: number
  per_page?: number
}

// Backend exposes only the awaiting-review list as a paginated encounters list.
// Per-patient encounters come from GET /patients/{id}/history.
export function getEncounters(filters: EncounterFilters = {}): Promise<PaginatedResponse<Encounter>> {
  return api.get('encounters/awaiting-review', filters)
}

export function getEncounter(id: string): Promise<Encounter> {
  return api.get(`encounters/${id}`)
}

export function getPatientEncounters(patientId: string): Promise<{ data: Encounter[] }> {
  return api.get(`patients/${patientId}/history`)
}

export function getEncounterExams(encounterId: string): Promise<Exam[]> {
  return api.get<{ data: Exam[] }>(`encounters/${encounterId}`).then(r => r.data ?? [])
}
