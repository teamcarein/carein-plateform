'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Patient } from '@/types'
import {
  getPatients, searchPatients, getPatient, updatePatient,
  type PatientFilters, type PatientSearchParams, type UpdatePatientInput,
} from './api'

export function usePatients(filters: PatientFilters = {}) {
  return useQuery({
    queryKey: ['patients', filters],
    queryFn: () => getPatients(filters),
  })
}

export function useSearchPatients(params: PatientSearchParams) {
  return useQuery({
    queryKey: ['patients', 'search', params],
    queryFn: () => searchPatients(params),
    enabled: params.q.length >= 2,
  })
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: ['patients', id],
    queryFn: () => getPatient(id),
    enabled: !!id,
  })
}

export function useUpdatePatient(id: string) {
  const qc = useQueryClient()
  return useMutation<Patient, Error, UpdatePatientInput>({
    mutationFn: (data) => updatePatient(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['patients'] }),
  })
}
