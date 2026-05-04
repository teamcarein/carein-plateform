'use client'

import { useState, useTransition } from 'react'
import { Copy, Check, X } from 'lucide-react'
import { Button } from '@carein/ui-kit'
import { inviteTeamMemberAction } from '@/features/team/actions'

interface Props {
  onClose: () => void
}

export function InviteTeamMemberForm({ onClose }: Props) {
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [done,     setDone]     = useState<{ name: string; email: string; temp_password: string } | null>(null)
  const [copied,   setCopied]   = useState(false)
  const [pending,  start]       = useTransition()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    start(async () => {
      const res = await inviteTeamMemberAction({
        name,
        email,
        password: password || undefined,
      })
      if (!res.success) { setError(res.error); return }
      setDone({ name: res.member.name, email: res.member.email, temp_password: res.member.temp_password })
    })
  }

  function copyPassword() {
    if (!done) return
    navigator.clipboard.writeText(done.temp_password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inputCls = 'px-3 py-2 text-sm rounded-[6px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 w-full'

  if (done) {
    return (
      <div className="border border-border rounded-[var(--radius-card)] p-4 bg-success/5 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-success">Membre invité</p>
            <p className="text-xs text-foreground/50">{done.name} · {done.email}</p>
          </div>
          <button onClick={onClose} className="text-foreground/30 hover:text-foreground transition-colors">
            <X size={14} />
          </button>
        </div>
        <div>
          <p className="text-xs text-foreground/50 mb-1">Mot de passe temporaire — à transmettre de façon sécurisée</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-muted px-3 py-2 rounded-[6px] font-mono text-foreground/70 truncate">
              {done.temp_password}
            </code>
            <button
              onClick={copyPassword}
              className="p-2 rounded-[6px] hover:bg-foreground/5 text-foreground/40 hover:text-foreground transition-colors shrink-0"
            >
              {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>Fermer</Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="border border-border rounded-[var(--radius-card)] p-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-semibold">Inviter un membre</p>
        <button type="button" onClick={onClose} className="text-foreground/30 hover:text-foreground transition-colors">
          <X size={14} />
        </button>
      </div>

      {error && <p className="text-xs text-danger">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Nom *</label>
          <input className={inputCls} value={name} onChange={e => setName(e.target.value)} placeholder="Sarah Kouamé" required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Email *</label>
          <input className={inputCls} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="sarah@carein.io" required />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground/60 uppercase tracking-wide">
          Mot de passe <span className="normal-case font-normal">(généré si vide)</span>
        </label>
        <input
          className={inputCls}
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Laisser vide pour générer automatiquement"
          minLength={10}
        />
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>Annuler</Button>
        <Button type="submit" size="sm" loading={pending} disabled={!name || !email}>
          Créer le compte
        </Button>
      </div>
    </form>
  )
}
