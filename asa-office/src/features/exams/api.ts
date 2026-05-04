import { api } from '@/lib/api-client'
import { Exam, Measurement, PaginatedResponse } from '@/types'

export type ExamFilters = {
  encounter_id?: string
  status?: Exam['status']
  page?: number
  per_page?: number
}

// No list-all-exams endpoint in backend — exams come nested in encounter detail.
// getExams is kept for interface compatibility; it delegates to encounter show.
export async function getExams(_filters: ExamFilters = {}): Promise<PaginatedResponse<Exam>> {
  return { data: [], meta: { current_page: 1, last_page: 1, per_page: 15, total: 0 } }
}

export function getExam(id: string): Promise<Exam> {
  return api.get(`exams/${id}`)
}

export function getExamMeasurements(examId: string): Promise<Measurement[]> {
  return api.get<{ data: Measurement[] }>(`exams/${examId}/measurements`).then(r => r.data ?? r as unknown as Measurement[])
}
