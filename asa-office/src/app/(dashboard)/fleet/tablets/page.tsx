'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardHeader, CardTitle, Badge, Button } from '@carein/ui-kit'
import { DataTable, type Column } from '@carein/ui-kit'
import { Plus, Tablet, User, Key, WifiOff, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { useTablets, useTabletUsers } from '@/features/fleet/hooks'
import { formatRelative } from '@/lib/formatters'
import type { Tablet as TabletType, TabletUser } from '@/features/fleet/types'
import { CreateTabletUserForm } from './create-tablet-user-form'
import { ProvisioningTokenCard } from './provisioning-token-card'

const STATUS_VARIANT: Record<string, 'active' | 'default' | 'anomaly'> = {
  active:  'active',
  pending: 'default',
  revoked: 'anomaly',
  wiped:   'anomaly',
}

const STATUS_LABELS: Record<string, string> = {
  active:  'Active',
  pending: 'En attente',
  revoked: 'Révoquée',
  wiped:   'Effacée',
}

function isOnline(lastSeen?: string) {
  if (!lastSeen) return false
  return Date.now() - new Date(lastSeen).getTime() < 10 * 60 * 1000
}

export default function TabletsPage() {
  const [showCreateForm, setShowCreateForm]       = useState(false)
  const [tokenForUser, setTokenForUser]           = useState<TabletUser | null>(null)

  const { data: tabletsData, isLoading: loadingTablets } = useTablets()
  const { data: usersData,   isLoading: loadingUsers   } = useTabletUsers()

  const tablets = tabletsData?.data ?? []
  const users   = usersData?.data   ?? []

  const tabletColumns: Column<TabletType>[] = [
    {
      key: 'serial',
      header: 'Tablette',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isOnline(row.last_seen_at) ? 'bg-success/10' : 'bg-foreground/5'}`}>
            <Tablet size={14} className={isOnline(row.last_seen_at) ? 'text-success' : 'text-foreground/30'} />
          </div>
          <div>
            <p className="text-sm font-medium">{row.model ?? 'Tablette Android'}</p>
            {row.serial && <p className="text-xs font-mono text-foreground/40">{row.serial}</p>}
          </div>
        </div>
      ),
    },
    {
      key: 'user',
      header: 'Agent assigné',
      render: (row) => row.user
        ? (
          <div>
            <p className="text-sm">{row.user.name}</p>
          </div>
        )
        : <span className="text-xs text-foreground/30">—</span>,
    },
    {
      key: 'status',
      header: 'Statut',
      render: (row) => (
        <Badge variant={STATUS_VARIANT[row.status] ?? 'default'}>
          {STATUS_LABELS[row.status] ?? row.status}
        </Badge>
      ),
    },
    {
      key: 'last_seen_at',
      header: 'Dernière vue',
      render: (row) => row.last_seen_at
        ? (
          <span className={`text-xs font-mono ${isOnline(row.last_seen_at) ? 'text-success' : 'text-foreground/40'}`}>
            {isOnline(row.last_seen_at) ? 'En ligne' : formatRelative(row.last_seen_at)}
          </span>
        )
        : <span className="text-xs text-foreground/30">Jamais connectée</span>,
    },
  ]

  const userColumns: Column<TabletUser>[] = [
    {
      key: 'name',
      header: 'Agent',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
            <User size={12} className="text-secondary" />
          </div>
          <div>
            <p className="text-sm font-medium">{row.name}</p>
            <p className="text-xs font-mono text-foreground/40">{row.matricule}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'facility',
      header: 'Structure',
      render: (row) => (
        <span className="text-sm text-foreground/60">{row.facility?.name ?? '—'}</span>
      ),
    },
    {
      key: 'provisioned',
      header: 'Tablette',
      render: (row) => {
        const linked = tablets.find(t => t.user?.id === row.id)
        return linked
          ? <span className="flex items-center gap-1 text-xs text-success"><CheckCircle size={12} /> Provisionnée</span>
          : <span className="flex items-center gap-1 text-xs text-foreground/40"><Clock size={12} /> En attente</span>
      },
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => { e.stopPropagation(); setTokenForUser(row) }}
        >
          <Key size={12} />
          Générer token
        </Button>
      ),
    },
  ]

  return (
    <div>
      <Topbar />
      <div className="p-6 space-y-8">

        {/* Tablettes provisionnées */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold">Tablettes</h1>
              <p className="text-sm text-foreground/50 mt-0.5">
                {tablets.filter(t => isOnline(t.last_seen_at)).length} en ligne · {tablets.length} enregistrée{tablets.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {tablets.length === 0 && !loadingTablets ? (
            <div className="rounded-[14px] border border-border border-dashed py-14 text-center">
              <WifiOff size={28} className="mx-auto text-foreground/15 mb-3" />
              <p className="text-sm text-foreground/40">Aucune tablette provisionnée</p>
              <p className="text-xs text-foreground/30 mt-1">Créez un utilisateur tablette puis générez un token de provisioning</p>
            </div>
          ) : (
            <Card className="p-0 overflow-hidden">
              <DataTable
                columns={tabletColumns}
                data={tablets}
                loading={loadingTablets}
                keyExtractor={(row) => row.id}
                emptyMessage="Aucune tablette"
              />
            </Card>
          )}
        </div>

        {/* Utilisateurs tablette */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold">Utilisateurs tablette</h2>
              <p className="text-sm text-foreground/50 mt-0.5">Comptes agents pour l'accès mobile</p>
            </div>
            <Button onClick={() => setShowCreateForm(true)} variant="outline">
              <Plus size={14} />
              Nouvel utilisateur
            </Button>
          </div>

          {showCreateForm && (
            <CreateTabletUserForm onClose={() => setShowCreateForm(false)} />
          )}

          {tokenForUser && (
            <ProvisioningTokenCard
              user={tokenForUser}
              onClose={() => setTokenForUser(null)}
            />
          )}

          <Card className="p-0 overflow-hidden">
            <DataTable
              columns={userColumns}
              data={users}
              loading={loadingUsers}
              keyExtractor={(row) => row.id}
              emptyMessage="Aucun utilisateur tablette — créez-en un ci-dessus"
            />
          </Card>
        </div>

      </div>
    </div>
  )
}
