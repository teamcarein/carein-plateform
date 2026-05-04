'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Building2, Check } from 'lucide-react'
import { Input } from '@carein/ui-kit'
import { Button } from '@carein/ui-kit'
import { Card } from '@carein/ui-kit'
import { createBrandOperatorAction } from '@/features/brand-operators/actions'

// Miroir exact de la validation Laravel côté backend
const schema = z.object({
  code:     z.string().min(3).max(6).regex(/^[A-Z0-9]{3,6}$/, '3-6 caractères majuscules ou chiffres'),
  name:     z.string().min(2, 'Nom requis'),
  type:     z.enum(['ngo', 'public', 'private', 'government']),
  country:  z.string().length(2, 'Code pays ISO 2 lettres (ex: CI)'),
  language: z.string().min(2).max(5, 'Code langue (ex: fr, en)'),
  currency: z.string().length(3, 'Code devise ISO 3 lettres (ex: XOF)'),
  timezone: z.string().min(3, 'Timezone requise'),
})

type FormData = z.infer<typeof schema>

const TIMEZONES_AFRICA = [
  'Africa/Abidjan', 'Africa/Accra', 'Africa/Brazzaville', 'Africa/Dakar',
  'Africa/Douala', 'Africa/Lagos', 'Africa/Lome', 'Africa/Nairobi',
  'Africa/Ouagadougou', 'Africa/Tunis',
]

export default function NewBrandOperatorPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess]         = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'private', language: 'fr', currency: 'XOF', timezone: 'Africa/Abidjan' },
  })

  async function onSubmit(data: FormData) {
    setServerError(null)
    const result = await createBrandOperatorAction({ ...data, code: data.code.toUpperCase() })
    if (!result.success) { setServerError(result.error); return }
    setSuccess(true)
    setTimeout(() => router.push(`/brand-operators/${result.bo.id}`), 1200)
  }

  if (success) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <Check size={22} className="text-success" />
          </div>
          <p className="font-semibold">Tenant créé</p>
          <p className="text-sm text-foreground/50 mt-1">Redirection en cours…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-xl">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Building2 size={18} className="text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Nouveau tenant</h1>
          <p className="text-sm text-foreground/50">POST /admin/tenants — role:superadmin</p>
        </div>
      </div>

      {serverError && (
        <div className="px-4 py-3 rounded-[6px] bg-danger/8 text-danger text-sm">{serverError}</div>
      )}

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input label="Nom complet *" placeholder="ASA TECH" error={errors.name?.message} {...register('name')} />
            </div>
            <Input label="Code interne *" placeholder="ASATECH" error={errors.code?.message} {...register('code')} />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Type *</label>
              <select className="px-3 py-2 text-sm rounded-[6px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30" {...register('type')}>
                <option value="private">Privé</option>
                <option value="ngo">ONG</option>
                <option value="public">Public</option>
                <option value="government">Gouvernemental</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Pays *</label>
              <select className="px-3 py-2 text-sm rounded-[6px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30" {...register('country')}>
                <option value="">—</option>
                <option value="CI">CI — Côte d'Ivoire</option>
                <option value="CG">CG — Congo-Brazzaville</option>
                <option value="SN">SN — Sénégal</option>
                <option value="GH">GH — Ghana</option>
                <option value="CM">CM — Cameroun</option>
                <option value="ML">ML — Mali</option>
                <option value="BF">BF — Burkina Faso</option>
                <option value="TG">TG — Togo</option>
              </select>
              {errors.country && <p className="text-xs text-danger">{errors.country.message}</p>}
            </div>
            <Input label="Langue *" placeholder="fr" error={errors.language?.message} {...register('language')} />
            <Input label="Devise *" placeholder="XOF" error={errors.currency?.message} {...register('currency')} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Timezone *</label>
            <select className="px-3 py-2 text-sm rounded-[6px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30" {...register('timezone')}>
              {TIMEZONES_AFRICA.map(tz => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Annuler</Button>
            <Button type="submit" loading={isSubmitting}>
              <Building2 size={14} />
              Créer le tenant
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
