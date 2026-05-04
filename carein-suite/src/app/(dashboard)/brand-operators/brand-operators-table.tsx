'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@carein/ui-kit'
import { Card } from '@carein/ui-kit'
import { Badge, type BadgeVariant } from '@carein/ui-kit'
import { DataTable, type Column } from '@carein/ui-kit'
import { formatDate, countryLabel } from '@/lib/formatters'
import type { BrandOperator } from '@/features/brand-operators/types'

const TYPE_LABELS: Record<string, string> = {
  ngo:        'ONG',
  public:     'Public',
  private:    'Privé',
  government: 'Gouvernemental',
}

export function BrandOperatorsTable({ data }: { data: BrandOperator[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')

  const filtered = data.filter(bo =>
    bo.name.toLowerCase().includes(search.toLowerCase()) ||
    bo.code.toLowerCase().includes(search.toLowerCase())
  )

  const columns: Column<BrandOperator>[] = [
    {
      key: 'code',
      header: 'Code',
      render: (row) => <span className="font-mono text-xs font-semibold text-primary">{row.code}</span>,
    },
    {
      key: 'name',
      header: 'Nom',
      render: (row) => (
        <div>
          <p className="font-medium text-sm">{row.name}</p>
          <p className="text-xs text-foreground/40">{countryLabel(row.country)}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (row) => <span className="text-xs text-foreground/60">{TYPE_LABELS[row.type] ?? row.type}</span>,
    },
    {
      key: 'status',
      header: 'Statut',
      render: (row) => (
        <Badge variant={row.status as BadgeVariant}>
          {row.status === 'active' ? 'Actif' : row.status === 'suspended' ? 'Suspendu' : row.status === 'pending' ? 'En attente' : 'Archivé'}
        </Badge>
      ),
    },
    {
      key: 'activated_at',
      header: 'Activé le',
      render: (row) => <span className="text-xs text-foreground/50 font-mono">{formatDate(row.activated_at)}</span>,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">Brand Operators</h1>
          <p className="text-sm text-foreground/50 mt-0.5">Gestion des tenants marque-blanche</p>
        </div>
        <Button onClick={() => router.push('/brand-operators/new')}>
          <Plus size={14} />
          Nouveau tenant
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou code…"
            className="text-sm px-3 py-1.5 rounded-[6px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 w-64"
          />
          <span className="text-xs text-foreground/40 ml-auto">
            {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
          </span>
        </div>
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(row) => row.id}
          onRowClick={(row) => router.push(`/brand-operators/${row.id}`)}
          emptyMessage="Aucun tenant trouvé"
        />
      </Card>
    </div>
  )
}
