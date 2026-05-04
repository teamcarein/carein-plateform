'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Cpu } from 'lucide-react'
import { Input } from '@carein/ui-kit'
import { Button } from '@carein/ui-kit'
import { Card } from '@carein/ui-kit'
import { createDeviceCatalogAction } from '@/features/device-catalog/actions'

const schema = z.object({
  name:         z.string().min(1, 'Requis').max(150),
  type:         z.enum(['blood_pressure', 'oximeter', 'ecg', 'glucose', 'temperature', 'spirometer', 'scale', 'other']),
  protocol:     z.enum(['ble', 'usb', 'wifi', 'other']),
  manufacturer: z.string().max(100).optional().or(z.literal('')),
  description:  z.string().optional().or(z.literal('')),
})

type FormData = z.infer<typeof schema>

export default function NewDeviceCatalogPage() {
  const router      = useRouter()
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'other', protocol: 'ble' },
  })

  async function onSubmit(data: FormData) {
    setError(null)
    const result = await createDeviceCatalogAction({
      name:         data.name,
      type:         data.type,
      protocol:     data.protocol,
      manufacturer: data.manufacturer || undefined,
      description:  data.description  || undefined,
    })
    if (!result.success) { setError(result.error); return }
    router.push('/device-catalog')
    router.refresh()
  }

  return (
    <div className="p-6 space-y-6 max-w-lg">
      <div>
        <h1 className="text-xl font-bold">Nouveau modèle d'appareil</h1>
        <p className="text-sm text-foreground/50 mt-0.5">Référencer un nouveau modèle dans le catalogue CareIN.</p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-[6px] bg-danger/8 text-danger text-sm">{error}</div>
      )}

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nom du modèle *"
            placeholder="ex: OMRON HEM-7156T"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Fabricant"
            placeholder="ex: OMRON Healthcare"
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
              {errors.type && <p className="text-xs text-danger">{errors.type.message}</p>}
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
              {errors.protocol && <p className="text-xs text-danger">{errors.protocol.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Description</label>
            <textarea
              rows={3}
              placeholder="Notes techniques, modèle de référence, précisions..."
              className="px-3 py-2 text-sm rounded-[6px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              {...register('description')}
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Annuler
            </Button>
            <Button type="submit" loading={isSubmitting}>
              <Cpu size={14} />
              Ajouter au catalogue
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
