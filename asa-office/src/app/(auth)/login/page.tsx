'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { loginAction, verifyOtpAction, LoginInput } from '@/features/auth/actions'

// ── Schemas ──────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email:    z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

const otpSchema = z.object({
  code: z.string().length(6, 'Code à 6 chiffres').regex(/^\d{6}$/, 'Chiffres uniquement'),
})
type OtpInput = z.infer<typeof otpSchema>

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [step, setStep]     = useState<'credentials' | 'otp'>('credentials')
  const [userId, setUserId] = useState<number | null>(null)
  const [error, setError]   = useState<string | null>(null)

  const loginForm = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })
  const otpForm   = useForm<OtpInput>({ resolver: zodResolver(otpSchema) })

  async function onLoginSubmit(data: LoginInput) {
    setError(null)
    const result = await loginAction(data)
    if (!result.success) { setError(result.error); return }
    setUserId(result.userId)
    setStep('otp')
  }

  async function onOtpSubmit(data: OtpInput) {
    setError(null)
    if (!userId) return
    const result = await verifyOtpAction({ userId, code: data.code })
    if (result && !result.success) setError(result.error)
  }

  return (
    <div className="h-screen flex overflow-hidden">

      {/* ── LEFT : form panel ─────────────────────────────────────────────── */}
      <div className="w-[46%] relative flex items-center justify-center bg-[#F0FAF6]">

        {/* Green organic blob */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[88px]"
          style={{
            background: 'linear-gradient(to bottom, #00E5B0, #00C896, #009B73)',
            borderRadius: '0 88px 88px 0',
          }}
        />

        {/* Form card */}
        <div className="relative z-10 w-[360px] bg-white rounded-[22px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.09)]">

          {/* Logo row */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-[11px] bg-primary/12 flex items-center justify-center flex-shrink-0">
              <HeartMonitorIcon />
            </div>
            <div>
              <p className="text-[17px] font-extrabold leading-tight tracking-tight">ASA TECH</p>
              <p className="text-[11px] text-foreground/50">Backoffice administrateur</p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            <StepDot n="1" state={step === 'credentials' ? 'active' : 'done'} />
            <div className={`flex-1 h-px transition-colors duration-300 ${step === 'otp' ? 'bg-primary' : 'bg-black/10'}`} />
            <StepDot n="2" state={step === 'otp' ? 'active' : 'idle'} />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-[9px] bg-danger/8 text-danger text-[12px]">
              {error}
            </div>
          )}

          {/* ── Step 1 : credentials ── */}
          {step === 'credentials' && (
            <>
              <p className="text-[13px] text-foreground/50 mb-5 leading-relaxed">
                Un code de vérification sera envoyé à votre adresse email.
              </p>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-3">
                <LoginField
                  label="E-mail"
                  type="email"
                  placeholder="admin@asa-tech.ci"
                  icon={<MailIcon />}
                  error={loginForm.formState.errors.email?.message}
                  {...loginForm.register('email')}
                />
                <LoginField
                  label="Mot de passe"
                  type="password"
                  placeholder="••••••••"
                  icon={<LockIcon />}
                  error={loginForm.formState.errors.password?.message}
                  {...loginForm.register('password')}
                />
                <button
                  type="submit"
                  disabled={loginForm.formState.isSubmitting}
                  className="w-full h-[46px] mt-2 bg-primary hover:bg-primary-hover text-primary-foreground font-extrabold text-[13px] tracking-widest rounded-[12px] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loginForm.formState.isSubmitting
                    ? <Spinner />
                    : 'SE CONNECTER'}
                </button>
              </form>
            </>
          )}

          {/* ── Step 2 : OTP ── */}
          {step === 'otp' && (
            <>
              <p className="text-[13px] text-foreground/50 mb-5 leading-relaxed">
                Entrez le code à 6 chiffres envoyé à votre adresse email.
              </p>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-3">
                <LoginField
                  label="Code de vérification"
                  type="text"
                  placeholder="0  0  0  0  0  0"
                  icon={<ShieldIcon />}
                  maxLength={6}
                  className="text-center text-xl font-mono tracking-[0.4em]"
                  error={otpForm.formState.errors.code?.message}
                  {...otpForm.register('code')}
                />
                <button
                  type="submit"
                  disabled={otpForm.formState.isSubmitting}
                  className="w-full h-[46px] mt-2 bg-primary hover:bg-primary-hover text-primary-foreground font-extrabold text-[13px] tracking-widest rounded-[12px] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {otpForm.formState.isSubmitting ? <Spinner /> : 'VÉRIFIER'}
                </button>
              </form>
              <button
                type="button"
                onClick={() => { setStep('credentials'); setError(null) }}
                className="mt-4 w-full text-[11px] text-foreground/35 hover:text-foreground/60 transition-colors"
              >
                ← Retour à la connexion
              </button>
            </>
          )}

        </div>
      </div>

      {/* ── RIGHT : brand panel ──────────────────────────────────────────── */}
      <div
        className="flex-1 relative flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #006B50 0%, #004436 50%, #001F18 100%)' }}
      >
        {/* Static decorative circles */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/[0.05]" />
        <div className="absolute -left-12 -bottom-12 w-52 h-52 rounded-full bg-white/[0.05]" />
        <div className="absolute right-20 bottom-20 w-28 h-28 rounded-full border border-white/[0.08]" />
        <div className="absolute left-16 top-16 w-16 h-16 rounded-full border border-white/[0.06]" />

        {/* Animated medical icons — no background, pure icons, varied sizes */}
        {/* Large */}
        <MedIcon pos="top-[13%] left-[8%]"    anim="float-a" delay="0s"    duration="3.2s" size={74} icon={<HeartIcon />}  />
        <MedIcon pos="bottom-[12%] left-[46%]" anim="float-c" delay="0.7s"  duration="3.8s" size={62} icon={<LungsIcon />}  />
        <MedIcon pos="bottom-[14%] right-[4%]" anim="float-b" delay="1.4s"  duration="3.0s" size={68} icon={<BrainIcon />}  />
        {/* Medium */}
        <MedIcon pos="top-[8%] left-[55%]"    anim="float-b" delay="0.5s"  duration="2.9s" size={52} icon={<BloodIcon />}  />
        <MedIcon pos="top-[50%] right-[3%]"   anim="float-c" delay="1.1s"  duration="3.6s" size={54} rotate={15} icon={<ThermIcon />}  />
        <MedIcon pos="top-[10%] right-[4%]"   anim="float-a" delay="2.0s"  duration="2.8s" size={48} icon={<StethIcon />} />
        <MedIcon pos="top-[40%] left-[4%]"    anim="float-b" delay="1.6s"  duration="3.4s" size={44} icon={<SyringeIcon />} rotate={-20} />
        {/* Small */}
        <MedIcon pos="bottom-[20%] left-[7%]" anim="float-a" delay="0.3s"  duration="2.6s" size={34} icon={<PillIcon />}   />
        <MedIcon pos="top-[7%] left-[32%]"    anim="float-c" delay="1.9s"  duration="3.1s" size={30} icon={<HeartIcon />}  />
        <MedIcon pos="bottom-[7%] right-[20%]" anim="float-b" delay="0.9s" duration="3.5s" size={28} icon={<BloodIcon />}  />
        <MedIcon pos="top-[30%] right-[14%]"  anim="float-a" delay="2.3s"  duration="2.7s" size={32} icon={<StethIcon />} />

        {/* Main branding content */}
        <div className="relative z-10 text-center px-10">
          <div className="w-[76px] h-[76px] mx-auto rounded-[22px] bg-white/10 border border-white/[0.18] flex items-center justify-center mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h3l3-7 3 14 3-10 2 3h4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-[38px] font-extrabold text-white tracking-tight leading-none mb-3">
            ASA TECH
          </h1>
          <p className="text-[14px] text-white/60 leading-relaxed mb-10">
            Système de diagnostics et<br />de santé connectée
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <StatPill value="2 400+" label="Patients" />
            <StatPill value="12"     label="Centres"  />
            <StatPill value="8 000+" label="Examens"  />
          </div>
        </div>
      </div>

    </div>
  )
}

// ── Sub-components ───────────────────────────────────────────────────────────

import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@carein/ui-kit'

type LoginFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  icon:  React.ReactNode
  error?: string
}

const LoginField = forwardRef<HTMLInputElement, LoginFieldProps>(
  ({ label, icon, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold text-foreground/50 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
          {icon}
        </span>
        <input
          ref={ref}
          className={cn(
            'w-full pl-10 pr-4 py-3 text-[14px] rounded-[12px] outline-none transition-all',
            'bg-[#F3FAF7] border border-[#D6EDE5]',
            'focus:border-primary focus:ring-2 focus:ring-primary/15',
            'placeholder:text-foreground/30',
            error && 'border-danger focus:ring-danger/15',
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="text-[11px] text-danger">{error}</p>}
    </div>
  )
)
LoginField.displayName = 'LoginField'

function StepDot({ n, state }: { n: string; state: 'active' | 'done' | 'idle' }) {
  return (
    <div
      className={cn(
        'w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-all',
        state === 'done'   && 'bg-primary text-primary-foreground',
        state === 'active' && 'border-2 border-primary text-primary bg-primary/8',
        state === 'idle'   && 'border border-black/10 text-foreground/25 bg-transparent',
      )}
    >
      {state === 'done' ? '✓' : n}
    </div>
  )
}

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.09] border border-white/[0.14]">
      <span className="text-white font-extrabold text-[14px]">{value}</span>
      <span className="text-white/55 text-[12px]">{label}</span>
    </div>
  )
}

function Spinner() {
  return <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="16" r="1.2" fill="currentColor"/>
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function HeartMonitorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 12h3l3-7 3 14 3-10 2 3h4" stroke="#00C896" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ── Animated medical icon wrapper — no background, pure icon ─────────────────

function MedIcon({
  pos, anim, delay, duration, size, icon, rotate = 0,
}: {
  pos: string; anim: string; delay: string; duration: string;
  size: number; icon: React.ReactNode; rotate?: number;
}) {
  return (
    <div
      className={`absolute text-white/70 ${pos}`}
      style={{
        width:     size,
        height:    size,
        animation: `${anim} ${duration} ease-in-out ${delay} infinite`,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
    >
      {icon}
    </div>
  )
}

// ── Medical SVG icons ─────────────────────────────────────────────────────────

const iconProps = { width: '100%', height: '100%', viewBox: '0 0 24 24', fill: 'none' as const }
const stroke    = { stroke: 'white', strokeWidth: '1.8', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

function HeartIcon()   { return <svg {...iconProps}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" {...stroke}/></svg> }
function SyringeIcon() { return <svg {...iconProps}><path d="M18 2l4 4-1.5 1.5-4-4L18 2z" {...stroke}/><path d="M16.5 3.5l4 4" {...stroke}/><path d="M13 7l-8 8 1 3 3 1 8-8" {...stroke}/><path d="M6 13l-3 3" {...stroke}/></svg> }
function ThermIcon()   { return <svg {...iconProps}><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" {...stroke}/><line x1="11.5" y1="6" x2="13.5" y2="6" {...stroke}/><line x1="11.5" y1="9" x2="13.5" y2="9" {...stroke}/></svg> }
function PillIcon()    { return <svg {...iconProps}><path d="M10.5 20.5l9-9a4.95 4.95 0 0 0-7-7l-9 9a4.95 4.95 0 0 0 7 7z" {...stroke}/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5" {...stroke}/></svg> }
function LungsIcon()   { return <svg {...iconProps}><path d="M12 4v10M12 4c-1.5 0-3 1.5-3 3v5c0 2 .5 4 2 5.5s3 2.5 5 2.5c2.5 0 4-1.5 4-4v-5c0-2-1-4-3-5" {...stroke}/><path d="M12 4c1.5 0 3 1.5 3 3v5c0 2-.5 4-2 5.5s-3 2.5-5 2.5c-2.5 0-4-1.5-4-4v-5c0-2 1-4 3-5" {...stroke}/></svg> }
function BloodIcon()   { return <svg {...iconProps}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" {...stroke}/></svg> }
function StethIcon()   { return <svg {...iconProps}><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" {...stroke}/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" {...stroke}/><circle cx="20" cy="10" r="2" {...stroke}/></svg> }
function BrainIcon()   { return <svg {...iconProps}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.77-3.6 3 3 0 0 1-2.5-3 2.5 2.5 0 0 1 1.13-2.08A3.5 3.5 0 0 1 7 6.58 2.5 2.5 0 0 1 9.5 2z" {...stroke}/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.77-3.6 3 3 0 0 0 2.5-3 2.5 2.5 0 0 0-1.13-2.08A3.5 3.5 0 0 0 17 6.58 2.5 2.5 0 0 0 14.5 2z" {...stroke}/></svg> }
