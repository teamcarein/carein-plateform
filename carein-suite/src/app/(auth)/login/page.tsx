'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, Lock, Mail } from 'lucide-react'
import { Button } from '@carein/ui-kit'
import { Input } from '@carein/ui-kit'
import { loginAction, verifyOtpAction } from '@/features/auth/actions'

const credentialsSchema = z.object({
  email:    z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

const otpSchema = z.object({
  code: z.string().length(6, 'Code à 6 chiffres'),
})

type CredentialsForm = z.infer<typeof credentialsSchema>
type OtpForm        = z.infer<typeof otpSchema>

export default function LoginPage() {
  const [step, setStep]     = useState<'credentials' | 'otp'>('credentials')
  const [userId, setUserId] = useState<number | null>(null)
  const [error, setError]   = useState<string | null>(null)

  const credForm = useForm<CredentialsForm>({ resolver: zodResolver(credentialsSchema) })
  const otpForm  = useForm<OtpForm>({ resolver: zodResolver(otpSchema) })

  async function onCredentials(data: CredentialsForm) {
    setError(null)
    const result = await loginAction(data)
    if (!result.success) {
      setError(result.error)
      return
    }
    setUserId(result.userId)
    setStep('otp')
  }

  async function onOtp(data: OtpForm) {
    if (!userId) return
    setError(null)
    const result = await verifyOtpAction({ userId, code: data.code })
    if (!result.success) {
      setError(result.error)
    }
    // on success verifyOtpAction calls redirect('/dashboard') server-side
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold">CareIN Cockpit</h1>
          <p className="text-sm text-foreground/50 mt-2">Accès réservé à l'équipe CareIN</p>
        </div>

        <div className="bg-surface border border-border rounded-[var(--radius-card)] p-6 shadow-sm">

          <div className="flex items-center gap-2 mb-5">
            <StepDot n="1" state={step === 'credentials' ? 'active' : 'done'} />
            <div className={`flex-1 h-px transition-colors ${step === 'otp' ? 'bg-primary' : 'bg-foreground/10'}`} />
            <StepDot n="2" state={step === 'otp' ? 'active' : 'idle'} />
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-[6px] bg-danger/8 text-danger text-sm">
              {error}
            </div>
          )}

          {step === 'credentials' ? (
            <form onSubmit={credForm.handleSubmit(onCredentials)} className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-foreground/40 mb-2">
                <Lock size={11} />
                <span>Connexion sécurisée</span>
              </div>
              <Input
                label="Adresse email"
                type="email"
                placeholder="prenom.nom@carein.io"
                error={credForm.formState.errors.email?.message}
                {...credForm.register('email')}
              />
              <Input
                label="Mot de passe"
                type="password"
                placeholder="••••••••"
                error={credForm.formState.errors.password?.message}
                {...credForm.register('password')}
              />
              <Button
                type="submit"
                className="w-full justify-center"
                loading={credForm.formState.isSubmitting}
              >
                <Mail size={14} />
                Recevoir le code
              </Button>
            </form>
          ) : (
            <form onSubmit={otpForm.handleSubmit(onOtp)} className="space-y-4">
              <p className="text-sm text-foreground/50">
                Entrez le code à 6 chiffres envoyé à votre adresse email.
              </p>
              <Input
                label="Code de vérification"
                type="text"
                placeholder="0  0  0  0  0  0"
                maxLength={6}
                className="text-center text-xl font-mono tracking-[0.4em]"
                error={otpForm.formState.errors.code?.message}
                {...otpForm.register('code')}
              />
              <Button
                type="submit"
                className="w-full justify-center"
                loading={otpForm.formState.isSubmitting}
              >
                <Shield size={14} />
                Vérifier
              </Button>
              <button
                type="button"
                onClick={() => { setStep('credentials'); setError(null) }}
                className="w-full text-xs text-foreground/35 hover:text-foreground/60 transition-colors mt-1"
              >
                ← Retour
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-foreground/40 mt-6">
          Problème d'accès ?{' '}
          <a href="mailto:support@carein.io" className="text-primary hover:underline">
            support@carein.io
          </a>
        </p>
      </div>
    </div>
  )
}

function StepDot({ n, state }: { n: string; state: 'active' | 'done' | 'idle' }) {
  return (
    <div className={[
      'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all',
      state === 'done'   ? 'bg-primary text-primary-foreground' : '',
      state === 'active' ? 'border-2 border-primary text-primary bg-primary/8' : '',
      state === 'idle'   ? 'border border-foreground/15 text-foreground/25' : '',
    ].join(' ')}>
      {state === 'done' ? '✓' : n}
    </div>
  )
}
