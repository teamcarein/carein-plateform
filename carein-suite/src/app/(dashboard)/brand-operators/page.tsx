import { getBrandOperators } from '@/features/brand-operators/api'
import { BrandOperatorsTable } from './brand-operators-table'

export default async function BrandOperatorsPage() {
  const res = await getBrandOperators()
  return <BrandOperatorsTable data={res.data} />
}
