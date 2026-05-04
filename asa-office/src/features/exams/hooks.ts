'use client'

import { useQuery } from '@tanstack/react-query'
import { getExams, getExam, getExamMeasurements, ExamFilters } from './api'

export function useExams(filters: ExamFilters = {}) {
  return useQuery({
    queryKey: ['exams', filters],
    queryFn: () => getExams(filters),
  })
}

export function useExam(id: string) {
  return useQuery({
    queryKey: ['exams', id],
    queryFn: () => getExam(id),
    enabled: !!id,
  })
}

export function useExamMeasurements(id: string) {
  return useQuery({
    queryKey: ['exams', id, 'measurements'],
    queryFn: () => getExamMeasurements(id),
    enabled: !!id,
  })
}
