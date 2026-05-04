'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Topbar } from '@/components/layout/topbar'
import { Card, Badge, Button, Input, DataTable, type Column } from '@carein/ui-kit'
import { Mail, Plus, X, Clock, CheckCircle, Ban, AlertTriangle } from 'lucide-react'
import { useInvitations, useCreateInvitation, useRevokeInvitation } from '@/features/invitations/hooks'
import { formatRelative } from '@/lib/formatters'
import type { Invitation, InvitationRole } from '@/features/invitations/types'

const ROLE_LABELS: Record<InvitationRole, string> = {
  manager: 'Manager',
  agent:   'Agent',
  doctor:  'Médecin',
}

const STATUS_VARIANT: Record<string, 'active' | 'default' | 'anomaly'> = {
  pending:  'default',
  accepted: 'active',
  revoked:  'anomaly',
  expired:  'anomaly',
}

const STATUS_LABELS: Record<string, string> = {
  pending:  'En attente',
  accepted: 'Acceptée',
  revoked:  'Révoquée',
  expired:  'Expirée',
}

const STATUS_ICONS: Record<string, React.ElementType> = {
  pending:  Clock,
  accepted: CheckCircle,
  revoked:  Ban,
  expired:  AlertTriangle,
}

const schema = z.object({
  email: z.string().email('Email invalide'),
  role:  z.enum(['manager', 'agent', 'doctor']),
})
type FormData = z.infer<typeof schema>

function InviteForm({ onClose }: { onClose: () => void }) {
  const { mutate, isPending, error } = useCreateInvitation()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'agent' },
  })

  function onSubmit(data: FormData) {
    mutate(data, { onSuccess: onClose })
  }

  return (
    <Card className="border-primary/30 bg-primary/2">
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-sm">Inviter un collaborateur</p>
        <button onClick={onClose} className="p-1 rounded text-foreground/40 hover:text-foreground transition-colors">
          <X size={15} />
        </button>
      </div>

      {error && (
        <div className="mb-3 px-3 py-2 rounded-[6px] bg-danger/8 text-danger text-xs">{error.message}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <Input
              label="Adresse email *"
              type="email"
              placeholder="jean.dupont@structure.org"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground/60 mb-1.5">Rôle *</label>
            <select
              {...register('role')}
              className="w-full px-3 py-2.5 text-sm rounded-[10px] border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="agent">Agent</option>
              <option value="doctor">Médecin</option>
              <option value="manager">Manager</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-foreground/40">
          Un email d'invitation sera envoyé. Le lien expire dans 7 jours.
        </p>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>Annuler</Button>
          <Button type="submit" size="sm" loading={isPending}>
            <Mail size={13} />
            Envoyer l'invitation
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default function InvitationsPage() {
  const [showForm, setShowForm] = useState(false)
  const { data, isLoading } = useInvitations()
  const { mutate: revoke, isPending: revoking } = useRevokeInvitation()

  const invitations = data?.data ?? []
  const pending = invitations.filter(i => i.status === 'pending').length

  const columns: Column<Invitation>[] = [
    {
      key: 'email',
      header: 'Destinataire',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Mail size={12} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">{row.email}</p>
            {row.invited_by && (
              <p className="text-xs text-foreground/40">par {row.invited_by.name}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Rôle',
      render: (row) => (
        <span className="text-sm text-foreground/70">{ROLE_LABELS[row.role] ?? row.role}</span>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      render: (row) => {
        const Icon = STATUS_ICONS[row.status] ?? Clock
        return (
          <div className="flex items-center gap-1.5">
            <Badge variant={STATUS_VARIANT[row.status] ?? 'default'}>
              <Icon size={10} />
              {STATUS_LABELS[row.status] ?? row.status}
            </Badge>
          </div>
        )
      },
    },
    {
      key: 'expires_at',
      header: 'Envoyée',
      render: (row) => (
        <span className="text-xs text-foreground/40 font-mono">{formatRelative(row.created_at)}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => row.status === 'pending' ? (
        <Button
          size="sm"
          variant="ghost"
          loading={revoking}
          onClick={(e) => {
            e.stopPropagation()
            if (confirm('Révoquer cette invitation ?')) revoke(row.uuid)
          }}
        >
          Révoquer
        </Button>
      ) : null,
    },
  ]

  return (
    <div>
      <Topbar />
      <div className="p-6 space-y-6">

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">Invitations</h1>
            <p className="text-sm text-foreground/50 mt-0.5">
              {pending > 0 ? `${pending} en attente · ` : ''}{invitations.length} au total
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} variant="outline">
            <Plus size={14} />
            Inviter
          </Button>
        </div>

        {showForm && <InviteForm onClose={() => setShowForm(false)} />}

        <Card className="p-0 overflow-hidden">
          <DataTable
            columns={columns}
            data={invitations}
            loading={isLoading}
            keyExtractor={(row) => row.uuid}
            emptyMessage="Aucune invitation — envoyez-en une ci-dessus"
          />
        </Card>

      </div>
    </div>
  )
}
