'use client'

import { use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, MapPin, Users, Package, Tablet, Cpu, AlertTriangle, Plus, ArrowRight } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardHeader, CardTitle, Badge, Button } from '@carein/ui-kit'
import { PatientTable } from '@/components/patients/patient-table'
import { DeviceTable } from '@/components/devices/device-table'
import { useFacility } from '@/features/facilities/hooks'
import { useKits } from '@/features/fleet/hooks'
import { Kit, KitStatus, KitType } from '@/features/fleet/types'
import { formatRelative } from '@/lib/formatters'

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

function FacilityKitsSection({ facilityId }: { facilityId: string }) {
  const { data, isLoading } = useKits({ facility_id: facilityId, per_page: 50 })
  const kits = data?.data ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Valises ({isLoading ? '…' : kits.length})</CardTitle>
        <Link href={`/fleet/new?facility=${facilityId}`}>
          <Button size="sm" variant="outline">
            <Plus size={13} /> Nouvelle valise
          </Button>
        </Link>
      </CardHeader>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-16 rounded-[10px] bg-foreground/5 animate-pulse" />
          ))}
        </div>
      ) : kits.length === 0 ? (
        <div className="py-10 text-center">
          <Package size={28} className="mx-auto text-foreground/15 mb-2" />
          <p className="text-sm text-foreground/40">Aucune valise assignée à cette structure</p>
          <Link href={`/fleet/new?facility=${facilityId}`} className="text-xs text-primary hover:underline mt-1 inline-block">
            Créer une valise →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {kits.map((kit) => (
            <KitRow key={kit.uuid ?? kit.id} kit={kit} />
          ))}
        </div>
      )}
    </Card>
  )
}

function KitRow({ kit }: { kit: Kit }) {
  const router = useRouter()
  const online = isOnline(kit.tablet?.last_seen_at)
  const calibDue = kit.active_devices?.some(d =>
    d.device?.calibration_next_at && new Date(d.device.calibration_next_at) <= new Date()
  )

  return (
    <button
      onClick={() => router.push(`/fleet/${kit.uuid ?? kit.id}`)}
      className="w-full flex items-center justify-between px-4 py-3 rounded-[10px] border border-border hover:bg-foreground/[0.02] transition-colors text-left"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          <Package size={15} className="text-foreground/40" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm font-medium">{kit.code}</span>
            <Badge variant={kitStatusVariant(kit.status)}>{formatKitStatus(kit.status)}</Badge>
          </div>
          <p className="text-xs text-foreground/50 mt-0.5 truncate">
            {kit.name} · {formatKitType(kit.kit_type)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {calibDue && (
          <span className="flex items-center gap-1 text-xs text-warning">
            <AlertTriangle size={11} /> Calibration
          </span>
        )}
        <div className="flex items-center gap-3 text-xs text-foreground/40">
          <span className="flex items-center gap-1">
            <Cpu size={11} />
            {kit.active_devices?.length ?? 0}
          </span>
          {kit.tablet ? (
            <span className={`flex items-center gap-1 ${online ? 'text-primary' : 'text-foreground/30'}`}>
              <Tablet size={11} />
              {online ? 'En ligne' : kit.tablet.last_seen_at ? formatRelative(kit.tablet.last_seen_at) : 'Hors ligne'}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-foreground/20">
              <Tablet size={11} /> —
            </span>
          )}
        </div>
        <ArrowRight size={13} className="text-foreground/20" />
      </div>
    </button>
  )
}

export default function FacilityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: facility, isLoading, isError, refetch } = useFacility(id)

  if (isError) {
    return (
      <div>
        <Topbar />
        <div className="p-6 text-center text-foreground/50">
          <p className="mb-3">Structure introuvable</p>
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
          ) : facility ? (
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <Building2 size={22} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-lg font-semibold">{facility.name}</h1>
                  {facility.code && (
                    <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-foreground/8 text-foreground/50">
                      {facility.code}
                    </span>
                  )}
                  <Badge variant={facility.is_active ? 'active' : 'default'}>
                    {facility.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-foreground/50 flex-wrap">
                  {(facility.city || facility.country) && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {[facility.city, facility.country].filter(Boolean).join(', ')}
                    </span>
                  )}
                  {facility.address && (
                    <span>{facility.address}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {facility.users_count ?? 0} agent{(facility.users_count ?? 0) !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </Card>

        {/* Valises de la structure */}
        {!isLoading && <FacilityKitsSection facilityId={id} />}

        {/* Patients de la structure */}
        <Card>
          <CardHeader><CardTitle>Patients</CardTitle></CardHeader>
          {!isLoading && <PatientTable facilityId={id} />}
        </Card>

        {/* Appareils de la structure */}
        <Card>
          <CardHeader><CardTitle>Appareils</CardTitle></CardHeader>
          {!isLoading && <DeviceTable facilityId={id} />}
        </Card>

      </div>
    </div>
  )
}
