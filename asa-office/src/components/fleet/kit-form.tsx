'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Input, Button } from '@carein/ui-kit'
import { useCreateKit, useUpdateKit } from '@/features/fleet/hooks'
import { useFacilities } from '@/features/facilities/hooks'
import { Kit } from '@/features/fleet/types'
import { CreateKitInput } from '@/features/fleet/api'

const KIT_TYPES: { value: Kit['kit_type']; label: string }[] = [
  { value: 'general',    label: 'Généraliste'  },
  { value: 'maternity',  label: 'Maternité'    },
  { value: 'cardiology', label: 'Cardiologie'  },
  { value: 'pediatrics', label: 'Pédiatrie'    },
  { value: 'custom',     label: 'Personnalisé' },
]

const KIT_STATUSES_CREATE: { value: Kit['status']; label: string }[] = [
  { value: 'in_stock',    label: 'En stock'    },
  { value: 'maintenance', label: 'Maintenance' },
]

const KIT_STATUSES_EDIT: { value: Kit['status']; label: string }[] = [
  { value: 'in_stock',    label: 'En stock'    },
  { value: 'assigned',    label: 'Assigné'     },
  { value: 'active',      label: 'Actif'       },
  { value: 'in_transit',  label: 'En transit'  },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'retired',     label: 'Retraité'    },
]

const selectCls = 'px-3 py-2 text-sm rounded-[var(--radius-btn,6px)] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 w-full'

interface KitFormProps {
  kit?:               Kit
  defaultFacilityId?: string
}

export function KitForm({ kit, defaultFacilityId }: KitFormProps) {
  const router         = useRouter()
  const createMutation = useCreateKit()
  const updateMutation = useUpdateKit(kit?.uuid ?? '')
  const mutation       = kit ? updateMutation : createMutation
  const isPending      = mutation.isPending

  const { data: facilitiesData } = useFacilities({ active_only: true, per_page: 200 })
  const facilities = facilitiesData?.data ?? []

  const { register, handleSubmit, formState: { errors } } = useForm<CreateKitInput>({
    defaultValues: kit ? {
      name:                  kit.name,
      code:                  kit.code,
      kit_type:              kit.kit_type,
      status:                kit.status,
      notes:                 kit.notes ?? '',
      assigned_facility_id:  kit.assigned_facility_id ?? '',
      assigned_campaign_id:  kit.assigned_campaign_id ?? '',
    } : {
      kit_type:             'general',
      status:               'in_stock',
      assigned_facility_id: defaultFacilityId ?? '',
    },
  })

  function onSubmit(data: CreateKitInput) {
    const payload: CreateKitInput = {
      ...data,
      notes:                data.notes                || undefined,
      assigned_facility_id: data.assigned_facility_id || undefined,
      assigned_campaign_id: data.assigned_campaign_id || undefined,
    }
    if (kit) {
      updateMutation.mutate(payload, { onSuccess: () => router.push(`/fleet/${kit.uuid}`) })
    } else {
      createMutation.mutate(payload, { onSuccess: (created) => router.push(`/fleet/${created.uuid}`) })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
      {mutation.error && (
        <div className="px-4 py-3 rounded-[var(--radius-btn,6px)] bg-danger/10 text-danger text-sm">
          {mutation.error.message}
        </div>
      )}

      <Input
        label="Nom de la valise"
        placeholder="Valise Maternité Zone Nord"
        error={errors.name?.message}
        {...register('name', { required: 'Champ obligatoire' })}
      />

      <Input
        label="Code"
        placeholder="KIT-2025-001"
        error={errors.code?.message}
        {...register('code', { required: 'Champ obligatoire' })}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Type</label>
          <select className={selectCls} {...register('kit_type')}>
            {KIT_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Statut</label>
          <select className={selectCls} {...register('status')}>
            {(kit ? KIT_STATUSES_EDIT : KIT_STATUSES_CREATE).map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">
          Structure médicale
        </label>
        <select className={selectCls} {...register('assigned_facility_id')}>
          <option value="">— Non assignée —</option>
          {facilities.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
        <p className="text-[11px] text-foreground/40">Structure à laquelle cette valise est affectée</p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Notes</label>
        <textarea
          className="px-3 py-2 text-sm rounded-[var(--radius-btn,6px)] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 w-full resize-none"
          rows={3}
          placeholder="Observations, équipement spécifique…"
          {...register('notes')}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={isPending}>
          {kit ? 'Enregistrer les modifications' : 'Créer la valise'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
