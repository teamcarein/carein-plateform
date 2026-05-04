import { getInvitations } from '@/features/invitations/api'
import { getBrandOperators } from '@/features/brand-operators/api'
import { InvitationsTable } from './invitations-table'
import { InvitationFilters } from './invitation-filters'

export default async function InvitationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; tenant?: string }>
}) {
  const { status, tenant } = await searchParams

  const [invResult, bosResult] = await Promise.allSettled([
    getInvitations({ status, tenant }),
    getBrandOperators(),
  ])

  const data    = invResult.status === 'fulfilled' ? invResult.value.data : []
  const tenants = bosResult.status === 'fulfilled'
    ? bosResult.value.data.map((bo) => ({ code: bo.code, name: bo.name }))
    : []

  return (
    <div>
      <InvitationFilters tenants={tenants} />
      <InvitationsTable data={data} />
    </div>
  )
}
