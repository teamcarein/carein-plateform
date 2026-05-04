'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getKits, getKit, getFleetOverview, getFleetDevices, getFleetDevice,
  getTablets, getTabletUsers, createTabletUser, generateProvisioningToken,
  getCalibrationsDue, createKit, updateKit, deleteKit, assignTabletToKit,
  type KitFilters, type FleetDeviceFilters, type CreateKitInput, type UpdateKitInput,
} from './api'
import { Kit, TabletUser, ProvisioningToken } from './types'

export function useKits(filters: KitFilters = {}) {
  return useQuery({ queryKey: ['fleet', 'kits', filters], queryFn: () => getKits(filters) })
}

export function useKit(id: string) {
  return useQuery({ queryKey: ['fleet', 'kits', id], queryFn: () => getKit(id), enabled: !!id })
}

export function useFleetOverview() {
  return useQuery({ queryKey: ['fleet', 'overview'], queryFn: getFleetOverview })
}

export function useFleetDevices(filters: FleetDeviceFilters = {}) {
  return useQuery({ queryKey: ['fleet', 'devices', filters], queryFn: () => getFleetDevices(filters) })
}

export function useFleetDevice(id: string) {
  return useQuery({ queryKey: ['fleet', 'devices', id], queryFn: () => getFleetDevice(id), enabled: !!id })
}

export function useTablets() {
  return useQuery({ queryKey: ['fleet', 'tablets'], queryFn: getTablets })
}

export function useCalibrationsDue() {
  return useQuery({ queryKey: ['fleet', 'calibrations-due'], queryFn: getCalibrationsDue })
}

export function useAssignTablet(kitUuid: string) {
  const qc = useQueryClient()
  return useMutation<Kit, Error, string>({
    mutationFn: (tabletUuid) => assignTabletToKit(kitUuid, tabletUuid),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fleet', 'kits', kitUuid] }),
  })
}

export function useCreateKit() {
  const qc = useQueryClient()
  return useMutation<Kit, Error, CreateKitInput>({
    mutationFn: createKit,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fleet'] }),
  })
}

export function useUpdateKit(id: string) {
  const qc = useQueryClient()
  return useMutation<Kit, Error, UpdateKitInput>({
    mutationFn: (data) => updateKit(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fleet'] }),
  })
}

export function useDeleteKit() {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: deleteKit,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fleet'] }),
  })
}

export function useTabletUsers() {
  return useQuery({
    queryKey: ['fleet', 'tablet-users'],
    queryFn:  getTabletUsers,
  })
}

export function useCreateTabletUser() {
  const qc = useQueryClient()
  return useMutation<TabletUser, Error, Parameters<typeof createTabletUser>[0]>({
    mutationFn: createTabletUser,
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['fleet', 'tablet-users'] }),
  })
}

export function useGenerateProvisioningToken() {
  return useMutation<ProvisioningToken, Error, string>({
    mutationFn: generateProvisioningToken,
  })
}
