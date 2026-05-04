'use client'

import { use } from 'react'
import { Cpu, Building2, Wifi, Usb, Bluetooth } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardHeader, CardTitle, Badge } from '@carein/ui-kit'
import { useDevice } from '@/features/devices/hooks'
import { formatDeviceType, formatDeviceProtocol, formatDeviceStatus, formatRelative, formatDatetime } from '@/lib/formatters'

const PROTOCOL_ICON: Record<string, React.ReactNode> = {
  usb:       <Usb size={14} />,
  bluetooth: <Bluetooth size={14} />,
  network:   <Wifi size={14} />,
}

const STATUS_VARIANT = {
  active:      'active',
  maintenance: 'anomaly',
  inactive:    'default',
} as const

export default function DeviceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: device, isLoading, isError, refetch } = useDevice(id)

  if (isError) {
    return (
      <div>
        <Topbar />
        <div className="p-6 text-center text-foreground/50">
          <p className="mb-3">Appareil introuvable</p>
          <button onClick={() => refetch()} className="text-primary hover:underline text-sm">
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Topbar />
      <div className="p-6 space-y-6">

        {/* Header */}
        <Card>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-5 w-1/3 bg-foreground/8 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-foreground/5 rounded animate-pulse" />
            </div>
          ) : device ? (
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                <Cpu size={22} className="text-secondary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-lg font-semibold">{device.name}</h1>
                  <Badge variant={STATUS_VARIANT[device.status]}>
                    {formatDeviceStatus(device.status)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-foreground/50 flex-wrap">
                  <span className="font-mono text-xs">{device.serial}</span>
                  <span>{formatDeviceType(device.type)}</span>
                  <span className="flex items-center gap-1">
                    {PROTOCOL_ICON[device.protocol]}
                    {formatDeviceProtocol(device.protocol)}
                  </span>
                  {device.facility && (
                    <span className="flex items-center gap-1">
                      <Building2 size={12} />
                      {device.facility.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </Card>

        {/* Infos */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-7 bg-foreground/5 rounded animate-pulse" />
                ))}
              </div>
            ) : device ? (
              <dl className="space-y-3 text-sm">
                <Row label="Type" value={formatDeviceType(device.type)} />
                <Row label="Protocole" value={formatDeviceProtocol(device.protocol)} />
                <Row label="Numéro de série" value={device.serial} mono />
                <Row label="Structure" value={device.facility?.name ?? '—'} />
                {device.last_seen_at && (
                  <Row label="Dernière connexion" value={formatDatetime(device.last_seen_at)} />
                )}
              </dl>
            ) : null}
          </Card>

          <Card>
            <CardHeader><CardTitle>Activité récente</CardTitle></CardHeader>
            <p className="text-sm text-foreground/40 text-center py-8">
              {device?.last_seen_at
                ? `Dernière vue ${formatRelative(device.last_seen_at)}`
                : 'Aucune activité enregistrée'}
            </p>
          </Card>
        </div>

      </div>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-foreground/50">{label}</dt>
      <dd className={mono ? 'font-mono text-xs font-medium' : 'font-medium'}>{value}</dd>
    </div>
  )
}
