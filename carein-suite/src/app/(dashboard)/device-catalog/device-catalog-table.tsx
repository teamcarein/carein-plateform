'use client'

import { useState, useTransition } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Plus, Search, Cpu } from 'lucide-react'
import { Button } from '@carein/ui-kit'
import { Card } from '@carein/ui-kit'
import { Badge, type BadgeVariant } from '@carein/ui-kit'
import { DataTable, type Column } from '@carein/ui-kit'
import { Input } from '@carein/ui-kit'
import type { DeviceCatalogEntry, DeviceCatalogMeta, DeviceType } from '@/features/device-catalog/types'
import { DEVICE_TYPE_LABELS, DEVICE_PROTOCOL_LABELS } from '@/features/device-catalog/types'
import { formatDate } from '@/lib/formatters'

const DEVICE_TYPES: { value: string; label: string }[] = [
  { value: '',               label: 'Tous les types'  },
  { value: 'blood_pressure', label: 'Tensiomètre'     },
  { value: 'oximeter',       label: 'Oxymètre'        },
  { value: 'ecg',            label: 'ECG'             },
  { value: 'glucose',        label: 'Glycémie'        },
  { value: 'temperature',    label: 'Thermomètre'     },
  { value: 'spirometer',     label: 'Spiromètre'      },
  { value: 'scale',          label: 'Balance'         },
  { value: 'other',          label: 'Autre'           },
]

export function DeviceCatalogTable({
  data,
  meta,
}: {
  data: DeviceCatalogEntry[]
  meta: DeviceCatalogMeta
}) {
  const router      = useRouter()
  const pathname    = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get('search') ?? '')

  function updateParams(updates: Record<string, string | undefined>, keepPage = false) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [k, v] of Object.entries(updates)) {
      if (v) params.set(k, v)
      else params.delete(k)
    }
    if (!keepPage) params.delete('page')
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    updateParams({ search: search || undefined })
  }

  const columns: Column<DeviceCatalogEntry>[] = [
    {
      key: 'name',
      header: 'Appareil',
      render: (row) => (
        <div>
          <p className="text-sm font-medium">{row.name}</p>
          {row.manufacturer && (
            <p className="text-xs text-foreground/40">{row.manufacturer}</p>
          )}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (row) => (
        <span className="text-xs text-foreground/70">
          {DEVICE_TYPE_LABELS[row.type as DeviceType] ?? row.type}
        </span>
      ),
    },
    {
      key: 'protocol',
      header: 'Protocole',
      render: (row) => (
        <span className="text-xs font-mono text-foreground/50">
          {DEVICE_PROTOCOL_LABELS[row.protocol] ?? row.protocol}
        </span>
      ),
    },
    {
      key: 'is_active',
      header: 'Statut',
      render: (row) => (
        <Badge variant={row.is_active ? ('success' as BadgeVariant) : ('default' as BadgeVariant)}>
          {row.is_active ? 'Actif' : 'Inactif'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Ajouté le',
      render: (row) => (
        <span className="text-xs text-foreground/40 font-mono">{formatDate(row.created_at)}</span>
      ),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">Catalogue d'appareils</h1>
          <p className="text-sm text-foreground/50 mt-0.5">
            {meta.total} modèle{meta.total !== 1 ? 's' : ''} référencé{meta.total !== 1 ? 's' : ''} par CareIN
          </p>
        </div>
        <Button onClick={() => router.push('/device-catalog/new')}>
          <Plus size={14} />
          Ajouter un modèle
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="pl-8 pr-3 py-2 text-sm rounded-[6px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 w-56"
          />
        </form>

        <select
          value={searchParams.get('type') ?? ''}
          onChange={(e) => updateParams({ type: e.target.value || undefined })}
          className="px-3 py-2 text-sm rounded-[6px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {DEVICE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <Card className="p-0 overflow-hidden">
        <DataTable
          columns={columns}
          data={data}
          keyExtractor={(row) => row.uuid}
          onRowClick={(row) => router.push(`/device-catalog/${row.uuid}`)}
          emptyMessage="Aucun appareil dans le catalogue"
        />
      </Card>

      {meta.last_page > 1 && (
        <div className="flex items-center justify-between text-sm text-foreground/50">
          <span>Page {meta.current_page} / {meta.last_page}</span>
          <div className="flex gap-2">
            {meta.current_page > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateParams({ page: String(meta.current_page - 1) }, true)}
              >
                Précédent
              </Button>
            )}
            {meta.current_page < meta.last_page && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateParams({ page: String(meta.current_page + 1) }, true)}
              >
                Suivant
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
