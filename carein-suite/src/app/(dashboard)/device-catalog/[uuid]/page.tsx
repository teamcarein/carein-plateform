import { notFound } from 'next/navigation'
import { requireAuth } from '@/features/auth/session'
import { apiGet } from '@/lib/api-client'
import type { DeviceCatalogEntry } from '@/features/device-catalog/types'
import { DeviceCatalogEditForm } from './device-catalog-edit-form'

async function getEntry(uuid: string): Promise<DeviceCatalogEntry | null> {
  try {
    const { token } = await requireAuth()
    const res = await apiGet<{ data: DeviceCatalogEntry }>(`/admin/device-catalog/${uuid}`, token)
    return res.data
  } catch {
    return null
  }
}

export default async function DeviceCatalogDetailPage({
  params,
}: {
  params: Promise<{ uuid: string }>
}) {
  const { uuid } = await params
  const entry = await getEntry(uuid)
  if (!entry) notFound()

  return <DeviceCatalogEditForm entry={entry} />
}
