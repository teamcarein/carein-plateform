'use client'

import { useQuery } from '@tanstack/react-query'
import { getFacilities, getFacility, type FacilityFilters } from './api'

export function useFacilities(filters: FacilityFilters = {}) {
  return useQuery({
    queryKey: ['facilities', filters],
    queryFn: () => getFacilities(filters),
  })
}

export function useFacility(id: string) {
  return useQuery({
    queryKey: ['facilities', id],
    queryFn: () => getFacility(id),
    enabled: !!id,
  })
}
