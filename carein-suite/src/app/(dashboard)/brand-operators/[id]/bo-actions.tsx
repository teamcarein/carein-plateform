'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@carein/ui-kit'
import {
  suspendBrandOperatorAction,
  reactivateBrandOperatorAction,
  activateBrandOperatorAction,
} from '@/features/brand-operators/actions'

export function BOActions({ uuid, status }: { uuid: string; status: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  async function run(fn: () => Promise<{ success: boolean; error?: string }>) {
    setLoading(true)
    setError(null)
    const res = await fn()
    setLoading(false)
    if (!res.success) { setError(res.error ?? 'Erreur'); return }
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-danger mr-2">{error}</span>}
      {status === 'pending' && (
        <Button size="sm" loading={loading} onClick={() => run(() => activateBrandOperatorAction(uuid))}>
          Activer
        </Button>
      )}
      {status === 'active' && (
        <Button
          variant="outline"
          size="sm"
          loading={loading}
          onClick={() => {
            if (!confirm('Suspendre ce tenant ? Ses utilisateurs ne pourront plus se connecter.')) return
            run(() => suspendBrandOperatorAction(uuid))
          }}
        >
          Suspendre
        </Button>
      )}
      {status === 'suspended' && (
        <Button size="sm" loading={loading} onClick={() => run(() => reactivateBrandOperatorAction(uuid))}>
          Réactiver
        </Button>
      )}
      <Button size="sm" variant="ghost" onClick={() => router.push(`/brand-operators/${uuid}/edit`)}>
        Éditer
      </Button>
    </div>
  )
}
