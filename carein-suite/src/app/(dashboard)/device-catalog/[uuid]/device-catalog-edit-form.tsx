'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'
import { Input } from '@carein/ui-kit'
import { Button } from '@carein/ui-kit'
import { Card } from '@carein/ui-kit'
import { Badge, type BadgeVariant } from '@carein/ui-kit'
import { updateDeviceCatalogAction } from '@/features/device-catalog/actions'
import type { DeviceCatalogEntry } from '@/features/device-catalog/types'
import { DEVICE_TYPE_LABELS, DEVICE_PROTOCOL_LABELS } from '@/features/device-catalog/types'
import { formatDate } from '@/lib/formatters'

const schema = z.object({
  name:         z.string().min(1).max(150),
  type:         z.enum(['blood_pressure', 'oximeter', 'ecg', 'glucose', 'temperature', 'spirometer', 'scale', 'other']),
  protocol:     z.enum(['ble', 'usb', 'wifi', 'other']),
  manufacturer: z.string().max(100).optional().or(z.literal('')),
  description:  z.string().optional().or(z.literal('')),
  is_active:    z.boolean(),
})

type FormData = z.infer<typeof schema>

export function DeviceCatalogEditForm({ entry }: { entry: DeviceCatalogEntry }) {
  const router        = useRouter()
  const [error, setError]     = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:         entry.name,
      type:         entry.type,
      protocol:     entry.protocol,
      manufacturer: entry.manufacturer ?? '',
      description:  entry.description  ?? '',
      is_active:    entry.is_active,
    },
  })

  async function onSubmit(data: FormData) {
    setError(null)
    setSuccess(false)
    const result = await updateDeviceCatalogAction(entry.uuid, {
      name:         data.name,
      type:         data.type,
      protocol:     data.protocol,
      manufacturer: data.manufacturer || undefined,
      description:  data.description  || undefined,
      is_active:    data.is_active,
    })
    if (!result.success) { setError(result.error); return }
    setSuccess(true)
    router.refresh()
  }

  return (
    <div className="p-6 space-y-6 max-w-lg">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/device-catalog')}
          className="p-1.5 rounded-[6px] text-foreground/40 hover:text-foreground hover:bg-muted transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{entry.name}</h1>
          <p className="text-xs text-foreground/40 font-mono mt-0.5">{entry.uuid}</p>
        </div>
        <Badge variant={entry.is_active ? ('success' as BadgeVariant) : ('default' as BadgeVariant)}>
          {entry.is_active ? 'Actif' : 'Inactif'}
        </Badge>
      </div>

      <div className="flex gap-4 text-xs text-foreground/40">
        <span>{DEVICE_TYPE_LABELS[entry.type]} · {DEVICE_PROTOCOL_LABELS[entry.protocol]}</span>
        <span>Ajouté le {formatDate(entry.created_at)}</span>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-[6px] bg-danger/8 text-danger text-sm">{error}</div>
      )}
      {success && (
        <div className="px-4 py-3 rounded-[6px] bg-success/8 text-success text-sm">Modifications enregistrées.</div>
      )}

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nom du modèle *"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Fabricant"
            error={errors.manufacturer?.message}
            {...register('manufacturer')}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Type *</label>
              <select
                className="px-3 py-2 text-sm rounded-[6px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                {...register('type')}
              >
                <option value="blood_pressure">Tensiomètre</option>
                <option value="oximeter">Oxymètre</option>
                <option value="ecg">ECG</option>
                <option value="glucose">Glycémie</option>
                <option value="temperature">Thermomètre</option>
                <option value="spirometer">Spiromètre</option>
                <option value="scale">Balance</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Protocole *</label>
              <select
                className="px-3 py-2 text-sm rounded-[6px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                {...register('protocol')}
              >
                <option value="ble">Bluetooth BLE</option>
                <option value="usb">USB</option>
                <option value="wifi">Wi-Fi</option>
                <option value="other">Autre</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Description</label>
            <textarea
              rows={3}
              className="px-3 py-2 text-sm rounded-[6px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              {...register('description')}
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              id="is_active"
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
              {...register('is_active')}
            />
            <label htmlFor="is_active" className="text-sm text-foreground/70">Appareil actif (visible dans les fleets)</label>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => router.push('/device-catalog')}>
              Annuler
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
              <Save size={14} />
              Enregistrer
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
