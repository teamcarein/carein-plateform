'use client'

import { useQuery } from '@tanstack/react-query'
import { getDevices, getDevice, type DeviceFilters } from './api'

export function useDevices(filters: DeviceFilters = {}) {
  return useQuery({
    queryKey: ['devices', filters],
    queryFn: () => getDevices(filters),
  })
}

export function useDevice(id: string) {
  return useQuery({
    queryKey: ['devices', id],
    queryFn: () => getDevice(id),
    enabled: !!id,
  })
}
