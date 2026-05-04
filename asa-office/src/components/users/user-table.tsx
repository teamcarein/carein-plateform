'use client'

import { useState } from 'react'
import { User, UserRole } from '@/types'
import { DataTable, Column, Pagination } from '@carein/ui-kit'
import { Badge } from '@carein/ui-kit'
import { useUsers } from '@/features/users/hooks'
import { formatUserRole, formatRelative } from '@/lib/formatters'
import { ApiError } from '@/lib/api-client'
import type { UserFilters } from '@/features/users/api'

export function UserTable() {
  const [page, setPage]       = useState(1)
  const [roleFilter, setRole] = useState<UserRole | ''>('')
  const [activeFilter, setActive] = useState<string>('')

  const filters: UserFilters = {
    role:      roleFilter  || undefined,
    is_active: activeFilter === '' ? undefined : activeFilter === 'true',
    page,
    per_page:  15,
  }

  const { data, isLoading, isError, error, refetch } = useUsers(filters)

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Utilisateur',
      render: (row) => (
        <div>
          <p className="font-medium text-sm">{row.name}</p>
          <p className="text-xs text-foreground/40">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Rôle',
      render: (row) => <span className="text-sm">{formatUserRole(row.role)}</span>,
    },
    {
      key: 'facility',
      header: 'Structure',
      render: (row) => (
        <span className="text-sm text-foreground/60">{row.facility?.name ?? '—'}</span>
      ),
    },
    {
      key: 'is_active',
      header: 'Statut',
      render: (row) => (
        <Badge variant={row.is_active ? 'active' : 'default'}>
          {row.is_active ? 'Actif' : 'Inactif'}
        </Badge>
      ),
    },
    {
      key: 'last_login_at',
      header: 'Dernière connexion',
      render: (row) =>
        row.last_login_at ? (
          <span className="text-xs text-foreground/50">{formatRelative(row.last_login_at)}</span>
        ) : (
          <span className="text-foreground/30">—</span>
        ),
    },
  ]

  if (isError) {
    if (error instanceof ApiError && error.status === 403) {
      return (
        <div className="py-12 text-center text-foreground/50">
          <p className="text-sm">Accès réservé aux super-administrateurs.</p>
        </div>
      )
    }
    return (
      <div className="py-12 text-center text-foreground/50">
        <p className="mb-3">Erreur lors du chargement des utilisateurs</p>
        <button onClick={() => refetch()} className="text-primary hover:underline text-sm">
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <select
          value={roleFilter}
          onChange={(e) => { setRole(e.target.value as UserRole | ''); setPage(1) }}
          className="text-sm px-3 py-1.5 rounded-[8px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Tous les rôles</option>
          <option value="admin">Administrateur</option>
          <option value="supervisor">Superviseur</option>
          <option value="nurse">Infirmier(e)</option>
          <option value="technician">Technicien</option>
          <option value="agent">Agent terrain</option>
        </select>

        <select
          value={activeFilter}
          onChange={(e) => { setActive(e.target.value); setPage(1) }}
          className="text-sm px-3 py-1.5 rounded-[8px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Tous les statuts</option>
          <option value="true">Actif</option>
          <option value="false">Inactif</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        loading={isLoading}
        keyExtractor={(row) => row.id}
      />

      {data && (
        <Pagination
          currentPage={data.meta?.current_page ?? 1}
          lastPage={data.meta?.last_page ?? 1}
          total={data.meta?.total ?? 0}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
