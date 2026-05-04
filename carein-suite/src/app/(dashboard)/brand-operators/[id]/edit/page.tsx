import { notFound } from 'next/navigation'
import { getBrandOperator } from '@/features/brand-operators/api'
import { EditBrandOperatorForm } from './edit-form'

export default async function EditBrandOperatorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let bo
  try {
    bo = await getBrandOperator(id)
  } catch {
    notFound()
  }

  return <EditBrandOperatorForm bo={bo} />
}
