'use client'

import { useState, useRef, forwardRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { saveBrandAction, uploadLogoAction } from './actions'

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'carein.cloud'

function toSubdomain(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 63)
}

const SUBDOMAIN_RE = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/

const schema = z.object({
  name:            z.string().min(2, 'Nom requis (min 2 caractères)'),
  subdomain:       z.string().min(3, 'Min 3 caractères').max(63, 'Max 63 caractères').regex(SUBDOMAIN_RE, 'Minuscules, chiffres et tirets uniquement (pas en début/fin)'),
  description:     z.string().max(500, '500 caractères max').optional().default(''),
  primary_color:   z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur invalide'),
  secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur invalide'),
})

type FormData = z.infer<typeof schema>

const STEPS = ['Identité', 'Couleurs', 'Logo'] as const

export default function OnboardingPage() {
  const router                            = useRouter()
  const [step, setStep]                   = useState(0)
  const [subdomainTouched, setSubdomainTouched] = useState(false)
  const [logoPreview, setLogoPreview]     = useState<string | null>(null)
  const [logoFile, setLogoFile]           = useState<File | null>(null)
  const [logoError, setLogoError]         = useState<string | null>(null)
  const [serverError, setServerError]     = useState<string | null>(null)
  const fileRef                           = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, watch, trigger, setValue, formState: { errors, isSubmitting } } =
    useForm<FormData>({
      resolver: zodResolver(schema) as Resolver<FormData>,
      defaultValues: { primary_color: '#00C896', secondary_color: '#006B50', description: '' },
    })

  const primaryColor   = watch('primary_color')
  const secondaryColor = watch('secondary_color')
  const brandName      = watch('name')
  const subdomain      = watch('subdomain')

  useEffect(() => {
    if (!subdomainTouched && brandName) {
      setValue('subdomain', toSubdomain(brandName), { shouldValidate: false })
    }
  }, [brandName, subdomainTouched, setValue])

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setLogoError('Fichier trop lourd (max 2 Mo)'); return }
    setLogoError(null)
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  async function goNext() {
    const fields: (keyof FormData)[][] = [['name', 'subdomain', 'description'], ['primary_color', 'secondary_color'], []]
    const ok = await trigger(fields[step] as (keyof FormData)[])
    if (ok) setStep(s => s + 1)
  }

  async function onSubmit(data: FormData) {
    setServerError(null)

    if (logoFile) {
      const fd = new FormData()
      fd.append('logo', logoFile)
      const logoRes = await uploadLogoAction(fd)
      if (!logoRes.success) { setServerError(logoRes.error); return }
    }

    const result = await saveBrandAction(data)
    if (result && !result.success) setServerError(result.error)
  }

  return (
    <div className="min-h-screen bg-[#F0FAF6] flex items-center justify-center p-4">

      <div className="w-full max-w-[520px]">

        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-[14px] flex items-center justify-center mx-auto mb-4"
            style={{ background: primaryColor }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h3l3-7 3 14 3-10 2 3h4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Bienvenue{brandName ? `, ${brandName}` : ''}</h1>
          <p className="text-sm text-foreground/50 mt-1">Configurez votre espace en 3 étapes</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-6">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors"
                  style={{
                    background: i < step ? primaryColor : i === step ? primaryColor : '#E5E7EB',
                    color:      i <= step ? 'white' : '#9CA3AF',
                  }}
                >
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-foreground' : 'text-foreground/40'}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px" style={{ background: i < step ? primaryColor : '#E5E7EB' }} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-8">

          {serverError && (
            <div className="mb-5 px-4 py-3 rounded-[10px] bg-red-50 text-red-600 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>

            {/* STEP 0 — Identité */}
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-bold mb-0.5">Identité de votre projet</h2>
                  <p className="text-xs text-foreground/40">Comment sera affiché votre espace sur la plateforme</p>
                </div>
                <Field label="Nom du projet" error={errors.name?.message}>
                  <input
                    {...register('name')}
                    placeholder="Ex : Clinique du Plateau"
                    className={inputCls}
                  />
                </Field>

                <Field label="Sous-domaine" error={errors.subdomain?.message}>
                  <div className="flex items-center rounded-[10px] overflow-hidden border border-[#D6EDE5] bg-[#F3FAF7] focus-within:border-[#00C896] focus-within:ring-2 focus-within:ring-[#00C896]/15">
                    <input
                      {...register('subdomain', {
                        onChange: () => setSubdomainTouched(true),
                      })}
                      placeholder="clinique-du-plateau"
                      className="flex-1 px-4 py-3 text-sm outline-none bg-transparent placeholder:text-foreground/30"
                    />
                    <span className="px-3 py-3 text-sm text-foreground/40 bg-[#EBF5F0] border-l border-[#D6EDE5] shrink-0 font-mono">
                      .{BASE_DOMAIN}
                    </span>
                  </div>
                  {subdomain && !errors.subdomain && (
                    <p className="text-[11px] text-foreground/40 mt-0.5">
                      Votre espace sera accessible sur{' '}
                      <span className="font-mono text-foreground/60">{subdomain}.{BASE_DOMAIN}</span>
                    </p>
                  )}
                </Field>

                <Field label="Description" error={errors.description?.message}>
                  <textarea
                    {...register('description')}
                    rows={3}
                    placeholder="Décrivez votre organisation en quelques mots…"
                    className={`${inputCls} resize-none`}
                  />
                </Field>
              </div>
            )}

            {/* STEP 1 — Couleurs */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-bold mb-0.5">Couleurs de votre marque</h2>
                  <p className="text-xs text-foreground/40">Définissez l'identité visuelle de votre espace</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Couleur primaire" error={errors.primary_color?.message}>
                    <ColorPicker {...register('primary_color')} value={primaryColor} />
                  </Field>
                  <Field label="Couleur secondaire" error={errors.secondary_color?.message}>
                    <ColorPicker {...register('secondary_color')} value={secondaryColor} />
                  </Field>
                </div>

                {/* Preview */}
                <div className="rounded-[12px] p-4 border border-border bg-[#FAFAFA]">
                  <p className="text-[11px] text-foreground/40 mb-3 uppercase tracking-wide font-semibold">Aperçu</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0"
                      style={{ background: primaryColor }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M3 12h3l3-7 3 14 3-10 2 3h4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{brandName || 'Mon Projet'}</p>
                      <p className="text-[11px]" style={{ color: primaryColor }}>Actif</p>
                    </div>
                    <div
                      className="ml-auto px-3 py-1 rounded-full text-[11px] font-bold text-white"
                      style={{ background: primaryColor }}
                    >
                      Action
                    </div>
                  </div>
                  <div className="mt-3 h-1 rounded-full" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }} />
                </div>
              </div>
            )}

            {/* STEP 2 — Logo */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-bold mb-0.5">Logo de votre projet</h2>
                  <p className="text-xs text-foreground/40">JPG, PNG ou WebP · max 2 Mo. Vous pourrez le modifier depuis les paramètres.</p>
                </div>

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full border-2 border-dashed border-border rounded-[14px] p-8 flex flex-col items-center gap-3 hover:border-primary/40 transition-colors cursor-pointer"
                >
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-20 h-20 object-contain rounded-[10px]"
                    />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-[12px] flex items-center justify-center"
                      style={{ background: `${primaryColor}18` }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="18" height="18" rx="3" stroke={primaryColor} strokeWidth="1.5"/>
                        <circle cx="8.5" cy="8.5" r="1.5" stroke={primaryColor} strokeWidth="1.5"/>
                        <path d="M21 15l-5-5L5 21" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-sm font-semibold" style={{ color: primaryColor }}>
                      {logoPreview ? 'Changer le logo' : 'Choisir un fichier'}
                    </p>
                    <p className="text-xs text-foreground/40 mt-0.5">Cliquez pour parcourir</p>
                  </div>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={handleLogoChange}
                />
                {logoError && <p className="text-xs text-red-500">{logoError}</p>}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-8">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => s - 1)}
                  className="text-sm text-foreground/50 hover:text-foreground transition-colors"
                >
                  ← Retour
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="text-sm text-foreground/40 hover:text-foreground/60 transition-colors"
                >
                  Passer
                </button>
              )}

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="px-6 py-2.5 rounded-[10px] text-sm font-bold text-white transition-colors"
                  style={{ background: primaryColor }}
                >
                  Continuer →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-[10px] text-sm font-bold text-white transition-opacity disabled:opacity-60 flex items-center gap-2"
                  style={{ background: primaryColor }}
                >
                  {isSubmitting ? <Spinner /> : 'Terminer la configuration'}
                </button>
              )}
            </div>

          </form>
        </div>

        <p className="text-center text-xs text-foreground/30 mt-4">
          Vous pouvez modifier ces informations à tout moment dans les Paramètres.
        </p>
      </div>
    </div>
  )
}

const inputCls = 'w-full px-4 py-3 text-sm rounded-[10px] outline-none bg-[#F3FAF7] border border-[#D6EDE5] focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/15 placeholder:text-foreground/30'

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold text-foreground/50 uppercase tracking-wide">{label}</label>
      {children}
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  )
}

const ColorPicker = forwardRef<HTMLInputElement, {
  value:    string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  onBlur:   React.FocusEventHandler<HTMLInputElement>
  name:     string
}>(function ColorPicker({ value, onChange, onBlur, name }, ref) {
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 rounded-[10px] bg-[#F3FAF7] border border-[#D6EDE5]">
      <input
        ref={ref}
        type="color"
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="w-7 h-7 rounded-[6px] border-0 cursor-pointer bg-transparent p-0"
      />
      <span className="text-sm font-mono text-foreground/70 select-all">{value}</span>
    </div>
  )
})

function Spinner() {
  return <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
}
