'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Building2, Check } from 'lucide-react'
import Link from 'next/link'
import { Button, Input, Card } from '@carein/ui-kit'
import { updateBrandOperatorAction } from '@/features/brand-operators/actions'
import type { BrandOperator } from '@/features/brand-operators/types'

const TIMEZONES_AFRICA = [
  'Africa/Abidjan', 'Africa/Accra', 'Africa/Brazzaville', 'Africa/Dakar',
  'Africa/Douala', 'Africa/Lagos', 'Africa/Lome', 'Africa/Nairobi',
  'Africa/Ouagadougou', 'Africa/Tunis',
]

export function EditBrandOperatorForm({ bo }: { bo: BrandOperator }) {
  const router = useRouter()

  const [form, setForm] = useState({
    name:     bo.name,
    type:     bo.type,
    country:  bo.country,
    language: bo.language,
    currency: bo.currency,
    timezone: bo.timezone,
  })

  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const res = await updateBrandOperatorAction(bo.id, form)
    setSaving(false)
    if (!res.success) { setError(res.error); return }
    setSuccess(true)
    setTimeout(() => router.push(`/brand-operators/${bo.id}`), 1000)
  }

  if (success) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <Check size={22} className="text-success" />
          </div>
          <p className="font-semibold">Modifications enregistrées</p>
          <p className="text-sm text-foreground/50 mt-1">Redirection en cours…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-xl">
      <div className="flex items-center gap-4">
        <Link href={`/brand-operators/${bo.id}`} className="text-foreground/40 hover:text-foreground transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 size={18} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Éditer {bo.name}</h1>
            <p className="text-sm text-foreground/50 font-mono">{bo.code}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-[6px] bg-danger/8 text-danger text-sm">{error}</div>
      )}

      <Card>
        <form onSubmit={onSubmit} className="space-y-5">
          <Input
            label="Nom complet *"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Type *</label>
              <select
                value={form.type}
                onChange={(e) => set('type', e.target.value)}
                className="px-3 py-2 text-sm rounded-[6px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="private">Privé</option>
                <option value="ngo">ONG</option>
                <option value="public">Public</option>
                <option value="government">Gouvernemental</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Pays *</label>
              <select
                value={form.country}
                onChange={(e) => set('country', e.target.value)}
                className="px-3 py-2 text-sm rounded-[6px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="CI">CI — Côte d'Ivoire</option>
                <option value="CG">CG — Congo-Brazzaville</option>
                <option value="SN">SN — Sénégal</option>
                <option value="GH">GH — Ghana</option>
                <option value="CM">CM — Cameroun</option>
                <option value="ML">ML — Mali</option>
                <option value="BF">BF — Burkina Faso</option>
                <option value="TG">TG — Togo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Langue *"
              value={form.language}
              onChange={(e) => set('language', e.target.value)}
              placeholder="fr"
              required
            />
            <Input
              label="Devise *"
              value={form.currency}
              onChange={(e) => set('currency', e.target.value)}
              placeholder="XOF"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Timezone *</label>
            <select
              value={form.timezone}
              onChange={(e) => set('timezone', e.target.value)}
              className="px-3 py-2 text-sm rounded-[6px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {TIMEZONES_AFRICA.map(tz => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Annuler</Button>
            <Button type="submit" loading={saving}>
              Enregistrer
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
