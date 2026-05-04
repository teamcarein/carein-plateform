'use client'

import { useState } from 'react'
import { X, Key, Copy, Check, AlertTriangle, Clock } from 'lucide-react'
import { Card, Button } from '@carein/ui-kit'
import { useGenerateProvisioningToken } from '@/features/fleet/hooks'
import type { TabletUser, ProvisioningToken } from '@/features/fleet/types'

export function ProvisioningTokenCard({
  user,
  onClose,
}: {
  user:    TabletUser
  onClose: () => void
}) {
  const [token,   setToken]   = useState<ProvisioningToken | null>(null)
  const [copied,  setCopied]  = useState(false)
  const { mutate, isPending, error } = useGenerateProvisioningToken()

  function generate() {
    mutate(user.id, { onSuccess: setToken })
  }

  function copy() {
    if (!token) return
    navigator.clipboard.writeText(token.token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const expiresAt = token
    ? new Date(token.expires_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <Card className="border-warning/30 bg-warning/3">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Key size={15} className="text-warning" />
          <div>
            <p className="font-semibold text-sm">Token de provisioning</p>
            <p className="text-xs text-foreground/50">{user.name} · {user.matricule}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded text-foreground/40 hover:text-foreground transition-colors">
          <X size={15} />
        </button>
      </div>

      {error && (
        <div className="mb-3 px-3 py-2 rounded-[6px] bg-danger/8 text-danger text-xs">{error.message}</div>
      )}

      {!token ? (
        <div className="space-y-3">
          <div className="flex items-start gap-2 text-xs text-warning/80 bg-warning/8 px-3 py-2.5 rounded-[6px]">
            <AlertTriangle size={13} className="shrink-0 mt-0.5" />
            <span>Le token sera affiché <strong>une seule fois</strong> et expire dans 15 minutes. Remettez-le immédiatement à la personne qui configure la tablette.</span>
          </div>
          <div className="flex justify-end">
            <Button size="sm" loading={isPending} onClick={generate}>
              <Key size={13} />
              Générer le token
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-success bg-success/8 px-3 py-2 rounded-[6px]">
            <Clock size={12} />
            Expire à <strong>{expiresAt}</strong> — usage unique
          </div>

          <div>
            <p className="text-xs text-foreground/40 uppercase tracking-wide mb-1.5">Token (à copier maintenant)</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-muted px-4 py-3 rounded-[8px] font-mono text-sm font-bold tracking-widest text-foreground break-all">
                {token.token}
              </code>
              <button
                onClick={copy}
                className="p-2.5 rounded-[8px] border border-border hover:bg-foreground/5 text-foreground/40 hover:text-foreground transition-colors shrink-0"
              >
                {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <p className="text-xs text-foreground/40">
            Sur la tablette : ouvrir l'app CareIN → Première configuration → entrer ce token + le numéro de série de la tablette.
          </p>

          <div className="flex justify-end">
            <Button size="sm" variant="ghost" onClick={onClose}>Fermer</Button>
          </div>
        </div>
      )}
    </Card>
  )
}
