'use client'

import { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { acceptInvitationAction } from './actions'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://suite.carein.cloud/api/v1'

const ROLE_LABELS: Record<string, string> = {
  owner:   'Propriétaire',
  manager: 'Manager',
  agent:   'Agent terrain',
  doctor:  'Médecin',
}

interface InvitationDetails {
  email:      string
  role:       string
  tenant:     { name: string; code: string } | null
  expires_at: string
}

const schema = z.object({
  name:                  z.string().min(2, 'Nom requis (min 2 caractères)'),
  password:              z.string().min(8, 'Mot de passe requis (min 8 caractères)'),
  password_confirmation: z.string().min(1, 'Confirmation requise'),
}).refine(d => d.password === d.password_confirmation, {
  message: 'Les mots de passe ne correspondent pas',
  path:    ['password_confirmation'],
})

type FormData = z.infer<typeof schema>

export default function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null)
  const [status, setStatus]         = useState<'loading' | 'ready' | 'invalid'>('loading')
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    fetch(`${API}/public/invitations/${token}`, {
      headers: { Accept: 'application/json' },
    })
      .then(r => r.json())
      .then(body => {
        if (body.data) { setInvitation(body.data); setStatus('ready') }
        else           { setStatus('invalid') }
      })
      .catch(() => setStatus('invalid'))
  }, [token])

  async function onSubmit(data: FormData) {
    setServerError(null)
    const result = await acceptInvitationAction(token, data)
    if (result && !result.success) setServerError(result.error)
  }

  return (
    <div className="h-screen flex overflow-hidden">

      {/* LEFT — form */}
      <div className="w-[46%] relative flex items-center justify-center bg-[#F0FAF6]">
        <div
          className="absolute left-0 top-0 bottom-0 w-[88px]"
          style={{ background: 'linear-gradient(to bottom, #00E5B0, #00C896, #009B73)', borderRadius: '0 88px 88px 0' }}
        />

        <div className="relative z-10 w-[380px] bg-white rounded-[22px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.09)]">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-[11px] bg-primary/12 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 12h3l3-7 3 14 3-10 2 3h4" stroke="#00C896" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-[17px] font-extrabold leading-tight tracking-tight">ASA TECH</p>
              <p className="text-[11px] text-foreground/50">Activation de votre compte</p>
            </div>
          </div>

          {status === 'loading' && (
            <div className="py-10 text-center text-[13px] text-foreground/40">Chargement…</div>
          )}

          {status === 'invalid' && (
            <div className="py-6 text-center">
              <p className="font-semibold text-danger mb-1">Invitation invalide</p>
              <p className="text-[13px] text-foreground/50">Ce lien est expiré, déjà utilisé ou introuvable.</p>
            </div>
          )}

          {status === 'ready' && invitation && (
            <>
              {/* Invitation badge */}
              <div className="bg-[#F0FAF6] border border-[#C8E6DA] rounded-[12px] px-4 py-3 mb-5 space-y-1">
                <p className="text-[11px] text-foreground/40 uppercase tracking-wide font-semibold">Invitation pour</p>
                <p className="text-[14px] font-semibold">{invitation.email}</p>
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                    {ROLE_LABELS[invitation.role] ?? invitation.role}
                  </span>
                  {invitation.tenant && (
                    <span className="text-[11px] text-foreground/50 font-mono">
                      {invitation.tenant.name}
                    </span>
                  )}
                </div>
              </div>

              {serverError && (
                <div className="mb-4 px-4 py-3 rounded-[9px] bg-danger/8 text-danger text-[12px]">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <Field label="Votre nom complet" error={errors.name?.message}>
                  <input placeholder="Prénom Nom" {...register('name')}
                    className="w-full px-4 py-3 text-[14px] rounded-[12px] outline-none bg-[#F3FAF7] border border-[#D6EDE5] focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-foreground/30" />
                </Field>
                <Field label="Mot de passe" error={errors.password?.message}>
                  <input type="password" placeholder="••••••••" {...register('password')}
                    className="w-full px-4 py-3 text-[14px] rounded-[12px] outline-none bg-[#F3FAF7] border border-[#D6EDE5] focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-foreground/30" />
                </Field>
                <Field label="Confirmer le mot de passe" error={errors.password_confirmation?.message}>
                  <input type="password" placeholder="••••••••" {...register('password_confirmation')}
                    className="w-full px-4 py-3 text-[14px] rounded-[12px] outline-none bg-[#F3FAF7] border border-[#D6EDE5] focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-foreground/30" />
                </Field>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-[46px] mt-2 bg-primary hover:bg-primary-hover text-primary-foreground font-extrabold text-[13px] tracking-widest rounded-[12px] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Spinner /> : 'CRÉER MON COMPTE'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* RIGHT — brand */}
      <div
        className="flex-1 relative flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #006B50 0%, #004436 50%, #001F18 100%)' }}
      >
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/[0.05]" />
        <div className="absolute -left-12 -bottom-12 w-52 h-52 rounded-full bg-white/[0.05]" />

        <div className="relative z-10 text-center px-10">
          <div className="w-[76px] h-[76px] mx-auto rounded-[22px] bg-white/10 border border-white/[0.18] flex items-center justify-center mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h3l3-7 3 14 3-10 2 3h4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-[38px] font-extrabold text-white tracking-tight leading-none mb-3">ASA TECH</h1>
          <p className="text-[14px] text-white/60 leading-relaxed">
            Rejoignez la plateforme de<br />diagnostics et de santé connectée
          </p>
        </div>
      </div>

    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold text-foreground/50 uppercase tracking-wide">{label}</label>
      {children}
      {error && <p className="text-[11px] text-danger">{error}</p>}
    </div>
  )
}

function Spinner() {
  return <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
}
