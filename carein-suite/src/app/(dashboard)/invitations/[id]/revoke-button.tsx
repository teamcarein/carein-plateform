'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Ban } from 'lucide-react'
import { Button } from '@carein/ui-kit'
import { revokeInvitationAction } from '@/features/invitations/actions'

export function RevokeButton({ uuid }: { uuid: string }) {
  const router    = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  async function handleRevoke() {
    if (!confirm('Révoquer cette invitation ? L\'action est irréversible.')) return
    setLoading(true)
    setError(null)
    const res = await revokeInvitationAction(uuid)
    setLoading(false)
    if (!res.success) { setError(res.error ?? 'Erreur'); return }
    router.push('/invitations')
    router.refresh()
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="outline" size="sm" loading={loading} onClick={handleRevoke}>
        <Ban size={13} />
        Révoquer
      </Button>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
