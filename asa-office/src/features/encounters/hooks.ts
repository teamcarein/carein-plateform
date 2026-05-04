'use client'

import { useQuery } from '@tanstack/react-query'
import {
  getEncounters, getEncounter, getEncounterExams, getPatientEncounters,
  type EncounterFilters,
} from './api'

export function useEncounters(filters: EncounterFilters = {}) {
  return useQuery({
    queryKey: ['encounters', filters],
    queryFn: () => getEncounters(filters),
  })
}

export function useEncounter(id: string) {
  return useQuery({
    queryKey: ['encounters', id],
    queryFn: () => getEncounter(id),
    enabled: !!id,
  })
}

export function useEncounterExams(id: string) {
  return useQuery({
    queryKey: ['encounters', id, 'exams'],
    queryFn: () => getEncounterExams(id),
    enabled: !!id,
  })
}

export function usePatientEncounters(patientId: string) {
  return useQuery({
    queryKey: ['patients', patientId, 'encounters'],
    queryFn: () => getPatientEncounters(patientId),
    enabled: !!patientId,
  })
}
