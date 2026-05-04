'use server'

import {
  getDeviceCatalog,
  createDeviceCatalogEntry,
  updateDeviceCatalogEntry,
} from './api'
import type {
  DeviceCatalogEntry,
  DeviceCatalogResponse,
  CreateDeviceCatalogInput,
  UpdateDeviceCatalogInput,
} from './types'

export async function getDeviceCatalogAction(params?: {
  type?: string
  search?: string
  active_only?: boolean
  page?: number
  per_page?: number
}): Promise<{ success: true; data: DeviceCatalogResponse } | { success: false; error: string }> {
  try {
    const data = await getDeviceCatalog(params)
    return { success: true, data }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message ?? 'Erreur serveur' }
  }
}

export async function createDeviceCatalogAction(
  input: CreateDeviceCatalogInput,
): Promise<{ success: true; entry: DeviceCatalogEntry } | { success: false; error: string }> {
  try {
    const res = await createDeviceCatalogEntry(input)
    return { success: true, entry: res.data }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message ?? 'Erreur serveur' }
  }
}

export async function updateDeviceCatalogAction(
  uuid: string,
  input: UpdateDeviceCatalogInput,
): Promise<{ success: true; entry: DeviceCatalogEntry } | { success: false; error: string }> {
  try {
    const res = await updateDeviceCatalogEntry(uuid, input)
    return { success: true, entry: res.data }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message ?? 'Erreur serveur' }
  }
}
