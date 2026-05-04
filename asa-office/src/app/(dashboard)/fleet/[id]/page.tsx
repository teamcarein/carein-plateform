'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Cpu, Tablet, Wifi, Battery, HardDrive, RefreshCw, AlertTriangle, Pencil, Plus, Link2, Link2Off, QrCode } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardHeader, CardTitle, Badge, MetricCard, Button } from '@carein/ui-kit'
import { useKit, useTablets, useAssignTablet } from '@/features/fleet/hooks'
import { useDeviceCatalog, useProvisionDevice } from '@/features/device-catalog/hooks'
import type { CatalogEntry } from '@/features/device-catalog/types'
import { formatRelative, formatDate } from '@/lib/formatters'
import { KitStatus, KitType, Tablet as TabletType } from '@/features/fleet/types'
import { KitQrCode } from '@/components/fleet/kit-qr-code'

function formatKitStatus(status: KitStatus): string {
  const labels: Record<KitStatus, string> = {
    in_stock: 'En stock', assigned: 'Assigné', active: 'Actif',
    in_transit: 'En transit', maintenance: 'Maintenance', retired: 'Retraité',
  }
  return labels[status] ?? status
}

function formatKitType(type: KitType): string {
  const labels: Record<KitType, string> = {
    maternity: 'Maternité', cardiology: 'Cardiologie', pediatrics: 'Pédiatrie',
    general: 'Généraliste', custom: 'Personnalisé',
  }
  return labels[type] ?? type
}

function kitStatusVariant(status: KitStatus) {
  const map: Record<KitStatus, string> = {
    active: 'active', assigned: 'planned', in_stock: 'default',
    in_transit: 'paused', maintenance: 'needs_info', retired: 'cancelled',
  }
  return map[status] as never
}

function isOnline(lastSeen?: string) {
  if (!lastSeen) return false
  return Date.now() - new Date(lastSeen).getTime() < 10 * 60 * 1000
}

function TabletCard({ tablet }: { tablet: TabletType }) {
  const online = isOnline(tablet.last_seen_at)
  return (
    <div className="rounded-[12px] border border-border bg-surface p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tablet size={16} className="text-extra" />
          <span className="font-medium text-sm">{tablet.model ?? 'Tablette Android'}</span>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${online ? 'bg-primary/12 text-primary' : 'bg-foreground/5 text-foreground/40'}`}>
          {online ? 'En ligne' : 'Hors ligne'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tablet.android_version && (
          <InfoRow icon={<Wifi size={13} />} label="Android" value={tablet.android_version} />
        )}
        {tablet.app_version && (
          <InfoRow icon={<RefreshCw size={13} />} label="App" value={`v${tablet.app_version}`} />
        )}
        {tablet.battery_health_pct !== undefined && (
          <InfoRow icon={<Battery size={13} />} label="Batterie" value={`${tablet.battery_health_pct}%`} color={tablet.battery_health_pct < 20 ? 'var(--color-danger)' : undefined} />
        )}
        {tablet.free_storage_mb !== undefined && (
          <InfoRow icon={<HardDrive size={13} />} label="Stockage libre" value={`${Math.round(tablet.free_storage_mb / 1024)} Go`} />
        )}
      </div>

      {tablet.last_seen_at && (
        <p className="text-xs text-foreground/40">
          Dernière activité : {formatRelative(tablet.last_seen_at)}
        </p>
      )}

      {tablet.user && (
        <p className="text-xs text-foreground/60 border-t border-border pt-3">
          Agent assigné : <span className="font-medium text-foreground">{tablet.user.name}</span>
        </p>
      )}
    </div>
  )
}

function InfoRow({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-foreground/40">{icon}</span>
      <div>
        <p className="text-[10px] text-foreground/40 uppercase tracking-wide">{label}</p>
        <p className="text-xs font-medium" style={color ? { color } : undefined}>{value}</p>
      </div>
    </div>
  )
}

function TabletAssignSection({ kitUuid }: { kitUuid: string }) {
  const [open, setOpen]       = useState(false)
  const [selected, setSelected] = useState('')
  const { data: tablets }     = useTablets()
  const { mutate, isPending, error } = useAssignTablet(kitUuid)

  const available = tablets?.data?.filter(t => t.status === 'active') ?? []

  function confirm() {
    if (!selected) return
    mutate(selected, { onSuccess: () => setOpen(false) })
  }

  if (!open) {
    return (
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Plus size={13} /> Assigner une tablette
      </Button>
    )
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-xs text-danger">{error.message}</p>
      )}
      <select
        value={selected}
        onChange={e => setSelected(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded-[var(--radius-btn,6px)] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <option value="">— Sélectionner une tablette —</option>
        {available.map(t => (
          <option key={t.id} value={t.id}>
            {t.model ?? 'Tablette'} · {t.serial ?? t.id}
            {t.user ? ` — ${t.user.name}` : ''}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <Button size="sm" disabled={!selected || isPending} loading={isPending} onClick={confirm}>
          Confirmer
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Annuler
        </Button>
      </div>
    </div>
  )
}

function ProvisionDeviceSection({ kitUuid }: { kitUuid: string }) {
  const [open, setOpen]           = useState(false)
  const [selected, setSelected]   = useState<CatalogEntry | null>(null)
  const [serial, setSerial]       = useState('')
  const { data: catalog, isLoading: catalogLoading } = useDeviceCatalog()
  const { mutate, isPending, error } = useProvisionDevice(kitUuid)

  const entries = catalog?.data ?? []

  function confirm() {
    if (!selected) return
    mutate(
      { device_catalog_uuid: selected.uuid, serial_number: serial || undefined },
      { onSuccess: () => { setOpen(false); setSelected(null); setSerial('') } },
    )
  }

  if (!open) {
    return (
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Plus size={13} /> Ajouter un appareil
      </Button>
    )
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-xs text-danger">{error.message}</p>}
      <select
        value={selected?.uuid ?? ''}
        onChange={(e) => {
          const entry = entries.find(c => c.uuid === e.target.value) ?? null
          setSelected(entry)
        }}
        className="w-full px-3 py-2 text-sm rounded-[var(--radius-btn,6px)] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
        disabled={catalogLoading}
      >
        <option value="">— Sélectionner un modèle —</option>
        {entries.map(c => (
          <option key={c.uuid} value={c.uuid}>
            {c.name}{c.manufacturer ? ` · ${c.manufacturer}` : ''}
          </option>
        ))}
      </select>

      {selected && (
        <input
          type="text"
          placeholder="N° de série (optionnel)"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-[var(--radius-btn,6px)] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
        />
      )}

      <div className="flex gap-2">
        <Button size="sm" disabled={!selected || isPending} loading={isPending} onClick={confirm}>
          Confirmer
        </Button>
        <Button size="sm" variant="ghost" onClick={() => { setOpen(false); setSelected(null); setSerial('') }}>
          Annuler
        </Button>
      </div>
    </div>
  )
}

export default function FleetKitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router  = useRouter()
  const { data: kit, isLoading, isError } = useKit(id)

  if (isLoading) {
    return (
      <div>
        <Topbar />
        <div className="p-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-[14px] bg-foreground/5 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (isError || !kit) {
    return (
      <div>
        <Topbar />
        <div className="p-6">
          <p className="text-foreground/50 text-center py-20">Kit introuvable.</p>
        </div>
      </div>
    )
  }

  const destination = kit.facility?.name ?? kit.campaign?.name ?? kit.user?.name

  return (
    <div>
      <Topbar />
      <div className="p-6 space-y-6">

        {/* Header */}
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft size={14} /> Retour Parc matériel
          </button>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono text-lg font-bold">{kit.code}</span>
                <Badge variant={kitStatusVariant(kit.status)}>{formatKitStatus(kit.status)}</Badge>
              </div>
              <p className="text-sm text-foreground/60">{kit.name} — {formatKitType(kit.kit_type)}</p>
              {destination && (
                <p className="text-sm text-foreground/50 mt-1">Assigné à : <span className="font-medium text-foreground">{destination}</span></p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {kit.last_synced_at && (
                <p className="text-xs text-foreground/40">Dernière synchro : {formatRelative(kit.last_synced_at)}</p>
              )}
              <button
                onClick={() => router.push(`/fleet/${kit.uuid}/edit`)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-[var(--radius-btn,6px)] border border-border hover:bg-foreground/5 transition-colors"
              >
                <Pencil size={13} /> Modifier
              </button>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          <MetricCard
            title="Appareils actifs"
            value={kit.active_devices?.length ?? 0}
            icon={Cpu}
            colorScheme="primary"
          />
          <MetricCard
            title="Tablette"
            value={kit.tablet ? (isOnline(kit.tablet.last_seen_at) ? 'En ligne' : 'Hors ligne') : 'Non assignée'}
            icon={Tablet}
            colorScheme={kit.tablet && isOnline(kit.tablet.last_seen_at) ? 'primary' : 'warning'}
          />
          <MetricCard
            title="Calibrations dues"
            value={kit.active_devices?.filter(d => {
              if (!d.device?.calibration_next_at) return false
              return new Date(d.device.calibration_next_at) <= new Date()
            }).length ?? 0}
            icon={AlertTriangle}
            colorScheme="warning"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* QR Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode size={15} />
                Étiquette valise
              </CardTitle>
            </CardHeader>
            <div className="py-2">
              <KitQrCode kit={kit} />
            </div>
            <p className="text-[11px] text-foreground/30 text-center mt-2 pb-1">
              Scannez avec l'app mobile pour charger cette valise
            </p>
          </Card>

          {/* Tablette */}
          <Card>
            <CardHeader>
              <CardTitle>Tablette</CardTitle>
              {kit.status !== 'retired' && (
                <TabletAssignSection kitUuid={kit.uuid ?? id} />
              )}
            </CardHeader>
            {kit.tablet
              ? <TabletCard tablet={kit.tablet} />
              : <p className="text-sm text-foreground/40 py-6 text-center">Aucune tablette assignée à cette valise.</p>
            }
          </Card>

          {/* Appareils */}
          <Card>
            <CardHeader>
              <CardTitle>Appareils médicaux</CardTitle>
              {kit.status !== 'retired' && (
                <ProvisionDeviceSection kitUuid={kit.uuid ?? id} />
              )}
            </CardHeader>
            {kit.active_devices && kit.active_devices.length > 0 ? (
              <div className="space-y-2">
                {kit.active_devices.map((kd) => {
                  const dev        = kd.device
                  const calibDue   = dev?.calibration_next_at && new Date(dev.calibration_next_at) <= new Date()
                  const isPaired   = !!kd.ble_address
                  return (
                    <div key={kd.id} className="flex items-center justify-between px-4 py-3 rounded-[10px] border border-border">
                      <div className="flex items-center gap-3">
                        <Cpu size={14} className="text-foreground/40" />
                        <div>
                          <p className="text-sm font-medium">{dev?.name ?? 'Appareil'}</p>
                          {dev?.serial_number && (
                            <p className="text-xs text-foreground/40 font-mono">{dev.serial_number}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`flex items-center gap-1 text-xs ${isPaired ? 'text-primary' : 'text-foreground/30'}`}>
                          {isPaired
                            ? <><Link2 size={11} /> Apparié</>
                            : <><Link2Off size={11} /> Non apparié</>
                          }
                        </span>
                        {calibDue && (
                          <span className="text-xs text-warning flex items-center gap-1">
                            <AlertTriangle size={11} /> Calibration due
                          </span>
                        )}
                        {dev?.calibration_next_at && !calibDue && (
                          <span className="text-xs text-foreground/40">
                            {formatDate(dev.calibration_next_at)}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-foreground/40 py-8 text-center">Aucun appareil attaché à cette valise.</p>
            )}
          </Card>

        </div>

      </div>
    </div>
  )
}
