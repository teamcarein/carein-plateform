'use client'

import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, ExternalLink, Copy, Check } from 'lucide-react'
import { Button } from '@carein/ui-kit'
import { getTenantUsersAction, startImpersonationAction } from '@/features/impersonation/actions'
import type { ImpersonationUser, ImpersonationSession, ImpersonationTenant } from '@/features/impersonation/types'

interface Tenant { id: string; code: string; name: string }

export function ImpersonationForm({ tenants, defaultTenantCode }: { tenants: Tenant[]; defaultTenantCode?: string }) {
  const [tenantCode,   setTenantCode]   = useState(defaultTenantCode ?? '')
  const [users,        setUsers]        = useState<ImpersonationUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [userUuid,     setUserUuid]     = useState('')
  const [reason,       setReason]       = useState('')
  const [starting,     setStarting]     = useState(false)
  const [error,        setError]        = useState<string | null>(null)
  const [session,      setSession]      = useState<ImpersonationSession | null>(null)
  const [copied,       setCopied]       = useState(false)

  useEffect(() => {
    if (defaultTenantCode) onTenantChange(defaultTenantCode)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function onTenantChange(code: string) {
    setTenantCode(code)
    setUserUuid('')
    setUsers([])
    setError(null)
    if (!code) return
    setLoadingUsers(true)
    const res = await getTenantUsersAction(code)
    setLoadingUsers(false)
    if (!res.success) { setError(res.error); return }
    setUsers(res.users)
  }

  async function onStart() {
    if (!userUuid) return
    if (!confirm('Démarrer une session d\'impersonation ? Cette action sera auditée.')) return
    setStarting(true)
    setError(null)
    const res = await startImpersonationAction(userUuid, reason || undefined)
    setStarting(false)
    if (!res.success) { setError(res.error); return }
    setSession(res.session)
  }

  function copyToken() {
    if (!session) return
    navigator.clipboard.writeText(session.token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (session) {
    return <SessionStarted session={session} onReset={() => { setSession(null); setUserUuid(''); setTenantCode(''); setUsers([]) }} onCopy={copyToken} copied={copied} />
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="px-4 py-3 rounded-[6px] bg-danger/8 text-danger text-sm">{error}</div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Brand Operator *</label>
        <select
          value={tenantCode}
          onChange={(e) => onTenantChange(e.target.value)}
          className="px-3 py-2 text-sm rounded-[6px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Sélectionner un BO…</option>
          {tenants.map((t) => (
            <option key={t.id} value={t.code}>{t.name} ({t.code})</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">
          Utilisateur *
          {loadingUsers && <span className="ml-2 text-foreground/30 normal-case font-normal">chargement…</span>}
        </label>
        <select
          value={userUuid}
          onChange={(e) => setUserUuid(e.target.value)}
          disabled={!tenantCode || loadingUsers}
          className="px-3 py-2 text-sm rounded-[6px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">
            {!tenantCode ? '— Sélectionner d\'abord un BO —' : users.length === 0 && !loadingUsers ? 'Aucun utilisateur actif' : 'Sélectionner un utilisateur…'}
          </option>
          {users.map((u) => (
            <option key={u.uuid} value={u.uuid}>
              {u.name} — {u.email} {u.role ? `(${u.role})` : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Motif (optionnel)</label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ex : support client, debug incident #42"
          className="px-3 py-2 text-sm rounded-[6px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button
          disabled={!userUuid || starting}
          loading={starting}
          onClick={onStart}
        >
          <Shield size={14} />
          Démarrer la session
        </Button>
      </div>
    </div>
  )
}

function SessionStarted({
  session,
  onReset,
  onCopy,
  copied,
}: {
  session: ImpersonationSession
  onReset: () => void
  onCopy: () => void
  copied: boolean
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-card)] bg-success/8 border border-success/20">
        <Shield size={15} className="text-success shrink-0" />
        <div>
          <p className="text-sm font-semibold text-success">Session démarrée</p>
          <p className="text-xs text-success/70">
            Impersonation de <strong>{session.user.name}</strong>
            {session.tenant && <span> ({session.tenant.name})</span>}
            {' '}— expire à {new Date(session.expires_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs text-foreground/40 uppercase tracking-wide mb-1">Token d'impersonation (2h)</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs bg-muted px-3 py-2 rounded-[6px] font-mono text-foreground/60 truncate">
            {session.token}
          </code>
          <button
            onClick={onCopy}
            className="p-2 rounded-[6px] hover:bg-foreground/5 text-foreground/40 hover:text-foreground transition-colors shrink-0"
            title="Copier le token"
          >
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
          </button>
        </div>
        <p className="text-xs text-foreground/30 mt-1.5">
          Utiliser ce token comme Bearer dans les requêtes API ou dans l'app client du BO.
        </p>
      </div>

      <div className="flex gap-2 pt-2 border-t border-border">
        <Button variant="outline" onClick={onReset} className="flex-1 justify-center">
          Nouvelle session
        </Button>
        <Button
          variant="ghost"
          className="flex-1 justify-center"
          onClick={() => window.open(`${process.env.NEXT_PUBLIC_CLIENT_APP_URL ?? '#'}?impersonation_token=${session.token}`, '_blank')}
        >
          <ExternalLink size={13} />
          Ouvrir dans l'app
        </Button>
      </div>
    </div>
  )
}
