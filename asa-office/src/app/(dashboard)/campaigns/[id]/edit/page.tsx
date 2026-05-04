'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Topbar } from '@/components/layout/topbar'
import { Card, Input, Button } from '@carein/ui-kit'
import { useCampaign, useUpdateCampaign } from '@/features/campaigns/hooks'
import { campaignSchema, CampaignInput } from '@/features/campaigns/types'

const selectCls = 'px-3 py-2 text-sm rounded-[var(--radius-btn,6px)] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 w-full'

export default function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router  = useRouter()
  const { data: campaign, isLoading, isError } = useCampaign(id)
  const mutation = useUpdateCampaign(id)

  const { register, handleSubmit, formState: { errors } } = useForm<CampaignInput>({
    resolver: zodResolver(campaignSchema),
    values: campaign ? {
      name:           campaign.name,
      code:           campaign.code ?? '',
      description:    campaign.description ?? '',
      objective_type: campaign.objective_type ?? 'screening',
      starts_at:      campaign.starts_at?.split('T')[0] ?? '',
      ends_at:        campaign.ends_at?.split('T')[0] ?? '',
      quota_per_day:  campaign.quota_per_day,
      quota_per_site: campaign.quota_per_site,
      quota_total:    campaign.quota_total ?? undefined,
    } : undefined,
  })

  function onSubmit(data: CampaignInput) {
    mutation.mutate(data, {
      onSuccess: () => router.push(`/campaigns/${id}`),
    })
  }

  if (isLoading) {
    return (
      <div>
        <Topbar />
        <div className="p-6 space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-10 rounded-[8px] bg-foreground/5 animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (isError || !campaign) {
    return (
      <div>
        <Topbar />
        <div className="p-6 text-center text-foreground/50 py-20">Campagne introuvable.</div>
      </div>
    )
  }

  return (
    <div>
      <Topbar />
      <div className="p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground mb-5 transition-colors"
        >
          <ArrowLeft size={14} /> Retour
        </button>

        <h1 className="text-lg font-semibold mb-5">Modifier — {campaign.name}</h1>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
            {mutation.error && (
              <div className="px-4 py-3 rounded-[var(--radius-btn,6px)] bg-danger/10 text-danger text-sm">
                {mutation.error.message}
              </div>
            )}

            <Input label="Nom de la campagne" error={errors.name?.message} {...register('name')} />
            <Input label="Code" placeholder="CAMP-2025-001" {...register('code')} />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Objectif</label>
              <select className={selectCls} {...register('objective_type')}>
                <option value="screening">Dépistage</option>
                <option value="consultation">Consultation</option>
                <option value="vaccination">Vaccination</option>
                <option value="follow_up">Suivi</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <Input label="Description" {...register('description')} />

            <div className="grid grid-cols-2 gap-4">
              <Input label="Date de début" type="date" error={errors.starts_at?.message} {...register('starts_at')} />
              <Input label="Date de fin"   type="date" error={errors.ends_at?.message}   {...register('ends_at')} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Quota / jour" type="number" min={1}
                error={errors.quota_per_day?.message}
                {...register('quota_per_day', { valueAsNumber: true })}
              />
              <Input
                label="Quota / site" type="number" min={1}
                error={errors.quota_per_site?.message}
                {...register('quota_per_site', { valueAsNumber: true })}
              />
            </div>

            <Input
              label="Quota total (optionnel)" type="number" min={1}
              {...register('quota_total', { valueAsNumber: true })}
            />

            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={mutation.isPending}>Enregistrer</Button>
              <Button type="button" variant="ghost" onClick={() => router.back()}>Annuler</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
