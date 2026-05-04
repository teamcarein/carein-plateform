'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Plus, Copy, Check } from 'lucide-react'
import { Button } from '@carein/ui-kit'
import { Card } from '@carein/ui-kit'
import { Badge, type BadgeVariant } from '@carein/ui-kit'
import { DataTable, type Column } from '@carein/ui-kit'
import { formatDate } from '@/lib/formatters'
import type { Invitation } from '@/features/invitations/types'

const STATUS_LABELS: Record<Invitation['status'], string> = {
  pending:  'En attente',
  accepted: 'Acceptée',
  expired:  'Expirée',
  revoked:  'Révoquée',
}

const ROLE_LABELS: Record<Invitation['role'], string> = {
  owner:   'Owner',
  manager: 'Manager',
  agent:   'Agent',
  doctor:  'Médecin',
}

export function InvitationsTable({ data }: { data: Invitation[] }) {
  const router = useRouter()
  const [copied, setCopied] = useState<string | null>(null)

  const pending = data.filter(i => i.status === 'pending')

  function copyLink(inv: Invitation, e: React.MouseEvent) {
    e.stopPropagation()
    navigator.clipboard.writeText(inv.link)
    setCopied(inv.uuid)
    setTimeout(() => setCopied(null), 2000)
  }

  const columns: Column<Invitation>[] = [
    {
      key: 'email',
      header: 'Email',
      render: (row) => <span className="text-sm font-mono">{row.email}</span>,
    },
    {
      key: 'tenant',
      header: 'Tenant',
      render: (row) => row.tenant
        ? (
          <div>
            <p className="text-sm font-medium">{row.tenant.name}</p>
            <p className="text-xs text-foreground/40 font-mono">{row.tenant.code}</p>
          </div>
        )
        : <span className="text-xs text-foreground/30">—</span>,
    },
    {
      key: 'role',
      header: 'Rôle',
      render: (row) => <span className="text-xs text-foreground/60">{ROLE_LABELS[row.role]}</span>,
    },
    {
      key: 'status',
      header: 'Statut',
      render: (row) => <Badge variant={row.status as BadgeVariant}>{STATUS_LABELS[row.status]}</Badge>,
    },
    {
      key: 'expires_at',
      header: 'Expire le',
      render: (row) => (
        <span className="text-xs text-foreground/50 font-mono">{formatDate(row.expires_at)}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => row.status === 'pending' ? (
        <button
          onClick={(e) => copyLink(row, e)}
          className="flex items-center gap-1.5 text-xs text-primary hover:underline"
        >
          {copied === row.uuid ? <Check size={11} /> : <Copy size={11} />}
          {copied === row.uuid ? 'Copié' : 'Copier le lien'}
        </button>
      ) : null,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">Invitations</h1>
          <p className="text-sm text-foreground/50 mt-0.5">Générer et suivre les invitations Brand Operator</p>
        </div>
        <Button onClick={() => router.push('/invitations/new')}>
          <Plus size={14} />
          Nouvelle invitation
        </Button>
      </div>

      {pending.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-card)] bg-warning/8 border border-warning/20">
          <Mail size={15} className="text-warning shrink-0" />
          <p className="text-sm text-warning">
            <span className="font-semibold">{pending.length} invitation{pending.length > 1 ? 's' : ''}</span>{' '}
            en attente de consommation.
          </p>
        </div>
      )}

      <Card className="p-0 overflow-hidden">
        <DataTable
          columns={columns}
          data={data}
          keyExtractor={(row) => row.uuid}
          onRowClick={(row) => router.push(`/invitations/${row.uuid}`)}
          emptyMessage="Aucune invitation"
        />
      </Card>
    </div>
  )
}
