'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { campaignSchema, CampaignInput } from '@/features/campaigns/types'
import { useCreateCampaign } from '@/features/campaigns/hooks'
import { Input } from '@carein/ui-kit'
import { Button } from '@carein/ui-kit'

const today = new Date().toISOString().split('T')[0]

export function CampaignForm() {
  const router = useRouter()
  const { mutate, isPending, error } = useCreateCampaign()

  const { register, handleSubmit, formState: { errors } } = useForm<CampaignInput>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      objective_type: 'screening',
      starts_at: today,
      quota_per_day: 20,
      quota_per_site: 100,
    },
  })

  function onSubmit(data: CampaignInput) {
    mutate(data, {
      onSuccess: (campaign) => router.push(`/campaigns/${campaign.id}`),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
      {error && (
        <div className="px-4 py-3 rounded-[8px] bg-danger/10 text-danger text-sm">
          {error.message}
        </div>
      )}

      <Input
        label="Nom de la campagne"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Code (optionnel)"
        placeholder="ex: CAMP-2025-001"
        {...register('code')}
      />

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">
          Objectif
        </label>
        <select
          {...register('objective_type')}
          className="px-3 py-2 text-sm rounded-[8px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="screening">Dépistage</option>
          <option value="consultation">Consultation</option>
          <option value="vaccination">Vaccination</option>
          <option value="follow_up">Suivi</option>
          <option value="other">Autre</option>
        </select>
        {errors.objective_type && (
          <p className="text-xs text-danger">{errors.objective_type.message}</p>
        )}
      </div>

      <Input
        label="Description (optionnel)"
        {...register('description')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date de début"
          type="date"
          error={errors.starts_at?.message}
          {...register('starts_at')}
        />
        <Input
          label="Date de fin"
          type="date"
          error={errors.ends_at?.message}
          {...register('ends_at')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Quota / jour"
          type="number"
          min={1}
          error={errors.quota_per_day?.message}
          {...register('quota_per_day', { valueAsNumber: true })}
        />
        <Input
          label="Quota / site"
          type="number"
          min={1}
          error={errors.quota_per_site?.message}
          {...register('quota_per_site', { valueAsNumber: true })}
        />
      </div>

      <Input
        label="Quota total (optionnel)"
        type="number"
        min={1}
        {...register('quota_total', { valueAsNumber: true })}
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={isPending}>
          Créer la campagne
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
