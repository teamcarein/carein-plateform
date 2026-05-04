'use client'

import { useState, useMemo } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { Card, Badge, Button } from '@carein/ui-kit'
import { Search, X, Plus } from 'lucide-react'
import { useDeviceCatalog, useCreateCatalogEntry, useToggleCatalogEntry } from '@/features/device-catalog/hooks'
import type { CatalogEntry, DeviceType, DeviceProtocol, CreateCatalogEntryPayload } from '@/features/device-catalog/types'

// ── Labels ────────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<DeviceType, string> = {
  blood_pressure: 'Tensiomètre',
  oximeter:       'Oxymètre',
  ecg:            'ECG',
  glucose:        'Glucomètre',
  temperature:    'Thermomètre',
  spirometer:     'Spiromètre',
  scale:          'Balance',
  other:          'Autre',
}

const PROTOCOL_LABELS: Record<DeviceProtocol, string> = {
  ble:   'Bluetooth',
  usb:   'USB',
  wifi:  'Wi-Fi',
  other: 'Autre',
}

const PROTOCOL_COLOR: Record<DeviceProtocol, string> = {
  ble:   'text-blue-500 bg-blue-50',
  usb:   'text-orange-500 bg-orange-50',
  wifi:  'text-teal-500 bg-teal-50',
  other: 'text-foreground/40 bg-foreground/5',
}

const DEVICE_TYPES: DeviceType[]     = ['blood_pressure', 'oximeter', 'ecg', 'glucose', 'temperature', 'spirometer', 'scale', 'other']
const DEVICE_PROTOCOLS: DeviceProtocol[] = ['ble', 'usb', 'wifi', 'other']

// ── Device card ───────────────────────────────────────────────────────────────

function DeviceCard({ entry }: { entry: CatalogEntry }) {
  const { mutate: toggle, isPending } = useToggleCatalogEntry()

  return (
    <Card className={`p-4 transition-all ${entry.is_active ? 'hover:border-primary/30' : 'opacity-60'}`}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-[10px] bg-primary/8 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
          {TYPE_LABELS[entry.type]?.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{entry.name}</p>
              {entry.manufacturer && (
                <p className="text-xs text-foreground/40 mt-0.5">{entry.manufacturer}</p>
              )}
            </div>
            <button
              onClick={() => toggle({ uuid: entry.uuid, is_active: !entry.is_active })}
              disabled={isPending}
              className="shrink-0 mt-0.5"
            >
              <Badge variant={entry.is_active ? 'active' : 'default'}>
                {entry.is_active ? 'Actif' : 'Inactif'}
              </Badge>
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            <span className="text-xs text-foreground/60 bg-foreground/6 px-2 py-0.5 rounded-full border border-border/60">
              {TYPE_LABELS[entry.type]}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PROTOCOL_COLOR[entry.protocol]}`}>
              {PROTOCOL_LABELS[entry.protocol]}
            </span>
          </div>

          {entry.description && (
            <p className="text-xs text-foreground/40 mt-2 line-clamp-2 leading-relaxed">
              {entry.description}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}

// ── New entry form ────────────────────────────────────────────────────────────

function NewEntryForm({ onClose }: { onClose: () => void }) {
  const { mutateAsync: create, isPending } = useCreateCatalogEntry()
  const [form, setForm] = useState<CreateCatalogEntryPayload>({
    name: '', manufacturer: '', type: 'other', protocol: 'ble', description: '',
  })
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof CreateCatalogEntryPayload>(key: K, val: CreateCatalogEntryPayload[K]) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!form.name.trim()) { setError('Le nom est requis.'); return }
    try {
      await create(form)
      onClose()
    } catch {
      setError('Erreur lors de la création.')
    }
  }

  return (
    <Card className="border-primary/30">
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border">
        <p className="text-sm font-semibold">Nouveau modèle de dispositif</p>
        <button onClick={onClose} className="text-foreground/30 hover:text-foreground">
          <X size={16} />
        </button>
      </div>
      <form onSubmit={submit} className="p-4 grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-foreground/50">Nom *</label>
          <input
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Ex : CONTEC CMS50D"
            className="text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-foreground/50">Fabricant</label>
          <input
            value={form.manufacturer ?? ''}
            onChange={e => set('manufacturer', e.target.value)}
            placeholder="Ex : CONTEC Medical"
            className="text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-foreground/50">Type</label>
          <select
            value={form.type}
            onChange={e => set('type', e.target.value as DeviceType)}
            className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {DEVICE_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-foreground/50">Protocole</label>
          <select
            value={form.protocol}
            onChange={e => set('protocol', e.target.value as DeviceProtocol)}
            className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {DEVICE_PROTOCOLS.map(p => <option key={p} value={p}>{PROTOCOL_LABELS[p]}</option>)}
          </select>
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-xs font-medium text-foreground/50">Description</label>
          <input
            value={form.description ?? ''}
            onChange={e => set('description', e.target.value)}
            placeholder="Compatibilité, notes, version firmware supportée…"
            className="text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        {error && <p className="col-span-2 text-xs text-destructive">{error}</p>}
        <div className="col-span-2 flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>Annuler</Button>
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? 'Création…' : 'Créer'}
          </Button>
        </div>
      </form>
    </Card>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DeviceCatalogPage() {
  const [search,      setSearch]      = useState('')
  const [typeFilter,  setTypeFilter]  = useState<DeviceType | ''>('')
  const [protoFilter, setProtoFilter] = useState<DeviceProtocol | ''>('')
  const [showForm,    setShowForm]    = useState(false)

  const { data, isLoading } = useDeviceCatalog()

  const all     = data?.data ?? []
  const active  = all.filter(e => e.is_active).length
  const inactive = all.length - active

  const entries = useMemo(() => {
    return all.filter(e => {
      if (typeFilter  && e.type     !== typeFilter)  return false
      if (protoFilter && e.protocol !== protoFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          e.name.toLowerCase().includes(q) ||
          (e.manufacturer ?? '').toLowerCase().includes(q) ||
          TYPE_LABELS[e.type].toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [all, search, typeFilter, protoFilter])

  const hasFilters = !!(search || typeFilter || protoFilter)

  return (
    <div>
      <Topbar />
      <div className="p-6 space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">Catalogue d&apos;appareils</h1>
            <p className="text-sm text-foreground/50 mt-0.5">
              {all.length} modèle{all.length !== 1 ? 's' : ''} · {active} actif{active !== 1 ? 's' : ''} · {inactive} inactif{inactive !== 1 ? 's' : ''}
            </p>
          </div>
          <Button size="sm" onClick={() => setShowForm(v => !v)}>
            <Plus size={14} />
            Nouveau modèle
          </Button>
        </div>

        {/* New entry form */}
        {showForm && <NewEntryForm onClose={() => setShowForm(false)} />}

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground/30 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher…"
              className="pl-7 pr-7 py-1.5 text-sm border border-border rounded-lg bg-background w-48 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground">
                <X size={12} />
              </button>
            )}
          </div>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as DeviceType | '')}
            className="text-sm border border-border rounded-lg px-2.5 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Tous les types</option>
            {DEVICE_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
          </select>

          <select
            value={protoFilter}
            onChange={e => setProtoFilter(e.target.value as DeviceProtocol | '')}
            className="text-sm border border-border rounded-lg px-2.5 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Tous les protocoles</option>
            {DEVICE_PROTOCOLS.map(p => <option key={p} value={p}>{PROTOCOL_LABELS[p]}</option>)}
          </select>

          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setTypeFilter(''); setProtoFilter('') }}
              className="text-xs text-foreground/40 hover:text-foreground flex items-center gap-1"
            >
              <X size={11} /> Effacer les filtres
            </button>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 rounded-[14px] bg-foreground/5 animate-pulse" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-[14px] border border-border border-dashed py-16 text-center">
            <p className="text-sm text-foreground/40">
              {hasFilters ? 'Aucun modèle correspond aux filtres.' : 'Catalogue vide — ajoutez votre premier modèle.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map(entry => (
              <DeviceCard key={entry.uuid} entry={entry} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
