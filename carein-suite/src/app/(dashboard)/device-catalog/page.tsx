import { getDeviceCatalog } from '@/features/device-catalog/api'
import { DeviceCatalogTable } from './device-catalog-table'

export default async function DeviceCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; search?: string; page?: string }>
}) {
  const { type, search, page } = await searchParams

  const result = await getDeviceCatalog({
    type:        type || undefined,
    search:      search || undefined,
    page:        page ? Number(page) : 1,
    per_page:    30,
    active_only: false,
  }).catch(() => null)

  const data = result?.data ?? []
  const meta = result?.meta ?? { current_page: 1, last_page: 1, per_page: 30, total: 0 }

  return <DeviceCatalogTable data={data} meta={meta} />
}
