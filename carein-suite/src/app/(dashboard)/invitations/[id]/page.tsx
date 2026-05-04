import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Clock, CheckCircle, XCircle, Ban } from 'lucide-react'
import { Card, Badge, type BadgeVariant } from '@carein/ui-kit'
import { getInvitation } from '@/features/invitations/api'
import { formatDate, formatDateTime } from '@/lib/formatters'
import { CopyButton } from './copy-button'
import { RevokeButton } from './revoke-button'

const STATUS_LABELS: Record<string, string> = {
  pending:  'En attente',
  accepted: 'Acceptée',
  expired:  'Expirée',
  revoked:  'Révoquée',
}

const ROLE_LABELS: Record<string, string> = {
  owner: 'Owner', manager: 'Manager', agent: 'Agent terrain', doctor: 'Médecin',
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  pending:  <Clock       size={13} className="text-warning"       />,
  accepted: <CheckCircle size={13} className="text-success"       />,
  expired:  <XCircle     size={13} className="text-foreground/40" />,
  revoked:  <Ban         size={13} className="text-danger"        />,
}

export default async function InvitationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let inv
  try {
    const res = await getInvitation(id)
    inv = res.data
  } catch {
    notFound()
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/invitations" className="text-foreground/40 hover:text-foreground transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Mail size={16} className="text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">{inv.tenant?.name ?? inv.email}</h1>
              <Badge variant={inv.status as BadgeVariant}>
                <span className="flex items-center gap-1">
                  {STATUS_ICON[inv.status]}
                  {STATUS_LABELS[inv.status] ?? inv.status}
                </span>
              </Badge>
            </div>
            <p className="text-xs text-foreground/40 font-mono mt-0.5">{inv.uuid}</p>
          </div>
        </div>
        {inv.status === 'pending' && (
          <RevokeButton uuid={inv.uuid} />
        )}
      </div>

      <Card>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {[
            { label: 'Email',       value: inv.email,                                           mono: true  },
            { label: 'Rôle',        value: ROLE_LABELS[inv.role] ?? inv.role,                   mono: false },
            { label: 'Tenant',      value: inv.tenant ? `${inv.tenant.name} · ${inv.tenant.code}` : '—', mono: false },
            { label: 'Invité par',  value: inv.invited_by?.name ?? '—',                         mono: false },
            { label: 'Créée le',    value: formatDateTime(inv.created_at),                      mono: false },
            { label: 'Expire le',   value: formatDate(inv.expires_at),                          mono: false },
            { label: 'Acceptée le', value: inv.accepted_at ? formatDateTime(inv.accepted_at) : '—', mono: false },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs text-foreground/40 uppercase tracking-wide mb-0.5">{item.label}</p>
              <p className={`text-sm font-medium ${item.mono ? 'font-mono text-xs' : ''}`}>{item.value}</p>
            </div>
          ))}
        </div>

        {inv.status === 'pending' && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-foreground/40 uppercase tracking-wide mb-1">Lien d'invitation</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-muted px-3 py-2 rounded-[6px] font-mono text-foreground/60 truncate">
                {inv.link}
              </code>
              <CopyButton text={inv.link} />
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
