'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Copy, Check } from 'lucide-react'
import { Input } from '@carein/ui-kit'
import { Button } from '@carein/ui-kit'
import { Card } from '@carein/ui-kit'
import { createInvitationAction } from '@/features/invitations/actions'

const schema = z.object({
  email:       z.string().email('Email invalide'),
  role:        z.enum(['owner', 'manager', 'agent', 'doctor']),
  tenant_code: z.string().max(6).optional().or(z.literal('')),
})

type FormData = z.infer<typeof schema>

export default function NewInvitationPage() {
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  const [copied, setCopied]               = useState(false)
  const [serverError, setServerError]     = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'owner' },
  })

  async function onSubmit(data: FormData) {
    setServerError(null)
    const result = await createInvitationAction({
      email:       data.email,
      role:        data.role,
      tenant_code: data.tenant_code || undefined,
    })
    if (!result.success) { setServerError(result.error); return }
    setGeneratedLink(result.link)
  }

  function copyLink() {
    if (!generatedLink) return
    navigator.clipboard.writeText(generatedLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (generatedLink) {
    return (
      <div className="p-6 max-w-lg">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <Send size={22} className="text-success" />
          </div>
          <h1 className="text-xl font-bold">Invitation générée</h1>
          <p className="text-sm text-foreground/50 mt-1">Partagez ce lien — valable 7 jours.</p>
        </div>

        <Card className="space-y-4">
          <div className="bg-muted rounded-[6px] px-4 py-3 font-mono text-xs break-all text-foreground/70">
            {generatedLink}
          </div>
          <div className="flex gap-2">
            <Button onClick={copyLink} variant="outline" className="flex-1 justify-center">
              {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
              {copied ? 'Copié !' : 'Copier le lien'}
            </Button>
            <Button
              onClick={() => window.open(`mailto:?body=${encodeURIComponent(generatedLink)}`)}
              variant="ghost"
              className="flex-1 justify-center"
            >
              <Send size={14} />
              Envoyer par email
            </Button>
          </div>
          <button
            onClick={() => { setGeneratedLink(null); setCopied(false) }}
            className="w-full text-xs text-foreground/40 hover:text-foreground/60 text-center"
          >
            Générer une autre invitation
          </button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-lg">
      <div>
        <h1 className="text-xl font-bold">Nouvelle invitation</h1>
        <p className="text-sm text-foreground/50 mt-0.5">Inviter un utilisateur à rejoindre la plateforme.</p>
      </div>

      {serverError && (
        <div className="px-4 py-3 rounded-[6px] bg-danger/8 text-danger text-sm">{serverError}</div>
      )}

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email *"
            type="email"
            placeholder="owner@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Rôle *</label>
              <select
                className="px-3 py-2 text-sm rounded-[6px] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                {...register('role')}
              >
                <option value="owner">Owner</option>
                <option value="manager">Manager</option>
                <option value="agent">Agent terrain</option>
                <option value="doctor">Médecin</option>
              </select>
            </div>
            <Input
              label="Code tenant (optionnel)"
              placeholder="ASATECH"
              error={errors.tenant_code?.message}
              {...register('tenant_code')}
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => history.back()}>
              Annuler
            </Button>
            <Button type="submit" loading={isSubmitting}>
              <Send size={14} />
              Générer l'invitation
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
