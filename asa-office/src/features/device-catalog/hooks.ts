'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDeviceCatalog, createCatalogEntry, toggleCatalogEntry, provisionDeviceForKit } from './api'
import type { CreateCatalogEntryPayload } from './types'

const QK = ['device-catalog']

export function useDeviceCatalog(params?: { search?: string; type?: string; active_only?: boolean }) {
  return useQuery({
    queryKey: [...QK, params],
    queryFn:  () => getDeviceCatalog(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateCatalogEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCatalogEntryPayload) => createCatalogEntry(payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: QK }),
  })
}

export function useToggleCatalogEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ uuid, is_active }: { uuid: string; is_active: boolean }) =>
      toggleCatalogEntry(uuid, is_active),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK }),
  })
}

export function useProvisionDevice(kitUuid: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { device_catalog_uuid: string; serial_number?: string }) =>
      provisionDeviceForKit(kitUuid, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['fleet', 'kits', kitUuid] })
    },
  })
}
