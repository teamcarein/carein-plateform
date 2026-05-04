'use client'

import { useState, useRef, useEffect, forwardRef } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, AlertCircle, Globe, Palette, ImageIcon } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardHeader, CardTitle } from '@carein/ui-kit'
import { api } from '@/lib/api-client'
import { uploadLogoAction } from '@/app/onboarding/actions'

// ── Types ─────────────────────────────────────────────────────────────────────

type TenantData = {
  name:       string
  subdomain:  string
  settings?:  { description?: string }
  theme?:     { primary?: string; secondary?: string }
  logo_url?:  string
}

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
  name:            z.string().min(2, 'Nom requis (min 2 caractères)'),
  description:     z.string().max(500).optional().default(''),
  primary_color:   z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur invalide'),
  secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur invalide'),
})
type FormData = z.infer<typeof schema>

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const qc = useQueryClient()

  const { data: tenant, isLoading } = useQuery<TenantData>({
    queryKey: ['tenant'],
    queryFn:  () => api.get('tenants/me'),
  })

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: (payload: { name: string; description: string; primary_color: string; secondary_color: string }) =>
      api.patch('tenants/me/settings', {
        name:     payload.name,
        settings: { description: payload.description },
        theme:    { primary: payload.primary_color, secondary: payload.secondary_color },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tenant'] }),
  })

  const [logoFile, setLogoFile]       = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoError, setLogoError]     = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, watch, reset, formState: { errors, isDirty } } =
    useForm<FormData>({
      resolver: zodResolver(schema) as Resolver<FormData>,
      defaultValues: { primary_color: '#00C896', secondary_color: '#006B50', description: '' },
    })

  useEffect(() => {
    if (!tenant) return
    reset({
      name:            tenant.name ?? '',
      description:     tenant.settings?.description ?? '',
      primary_color:   tenant.theme?.primary   ?? '#00C896',
      secondary_color: tenant.theme?.secondary ?? '#006B50',
    })
    if (tenant.logo_url && !logoPreview) setLogoPreview(tenant.logo_url)
  }, [tenant, reset]) // eslint-disable-line react-hooks/exhaustive-deps

  const primaryColor   = watch('primary_color')
  const secondaryColor = watch('secondary_color')

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setLogoError('Fichier trop lourd (max 2 Mo)'); return }
    setLogoError(null)
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  async function onSubmit(data: FormData) {
    setServerError(null)

    if (logoFile) {
      const fd = new FormData()
      fd.append('logo', logoFile)
      const res = await uploadLogoAction(fd)
      if (!res.success) { setServerError(res.error); return }
      setLogoFile(null)
    }

    try {
      await mutateAsync(data)
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : 'Erreur serveur')
    }
  }

  if (isLoading) {
    return (
      <div>
        <Topbar />
        <div className="p-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-[14px] bg-foreground/5 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <Topbar />
      <div className="p-6 max-w-2xl space-y-6">

        <div>
          <h1 className="text-xl font-bold">Paramètres</h1>
          <p className="text-sm text-foreground/50 mt-0.5">
            Identité et apparence de votre espace {tenant?.subdomain && (
              <span className="font-mono text-foreground/70">{tenant.subdomain}</span>
            )}
          </p>
        </div>

        {serverError && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-[10px] bg-red-50 text-red-600 text-sm">
            <AlertCircle size={15} />
            {serverError}
          </div>
        )}

        {isSuccess && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-[10px] bg-green-50 text-green-700 text-sm font-medium">
            <Check size={15} />
            Paramètres enregistrés.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Identité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe size={15} />
                Identité
              </CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <Field label="Nom de l'espace" error={errors.name?.message}>
                <input
                  {...register('name')}
                  placeholder="Ex : Clinique du Plateau"
                  className={inputCls}
                />
              </Field>

              <div>
                <label className="text-[11px] font-semibold text-foreground/50 uppercase tracking-wide">
                  Sous-domaine
                </label>
                <div className="mt-1.5 flex items-center gap-2 px-4 py-3 rounded-[10px] bg-foreground/3 border border-border text-sm text-foreground/50 font-mono">
                  {tenant?.subdomain ?? '—'}
                  <span className="text-foreground/30">.carein.cloud</span>
                  <span className="ml-auto text-[10px] bg-foreground/5 px-2 py-0.5 rounded-full font-sans text-foreground/40">
                    Non modifiable
                  </span>
                </div>
              </div>

              <Field label="Description" error={errors.description?.message}>
                <textarea
                  {...register('description')}
                  rows={3}
                  placeholder="Décrivez votre organisation en quelques mots…"
                  className={`${inputCls} resize-none`}
                />
              </Field>
            </div>
          </Card>

          {/* Couleurs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette size={15} />
                Couleurs
              </CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Couleur primaire" error={errors.primary_color?.message}>
                  <ColorPicker {...register('primary_color')} value={primaryColor} />
                </Field>
                <Field label="Couleur secondaire" error={errors.secondary_color?.message}>
                  <ColorPicker {...register('secondary_color')} value={secondaryColor} />
                </Field>
              </div>

              {/* Aperçu */}
              <div className="rounded-[10px] p-4 border border-border bg-foreground/2">
                <p className="text-[10px] uppercase tracking-wide text-foreground/30 font-semibold mb-3">Aperçu</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0"
                    style={{ background: primaryColor }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M3 12h3l3-7 3 14 3-10 2 3h4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{watch('name') || 'Mon Projet'}</p>
                    <p className="text-[11px]" style={{ color: primaryColor }}>Actif</p>
                  </div>
                  <div
                    className="ml-auto px-3 py-1 rounded-full text-[11px] font-bold text-white"
                    style={{ background: primaryColor }}
                  >
                    Action
                  </div>
                </div>
                <div
                  className="mt-3 h-1 rounded-full"
                  style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
                />
              </div>
            </div>
          </Card>

          {/* Logo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon size={15} />
                Logo
              </CardTitle>
            </CardHeader>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-[12px] p-6 flex items-center gap-5 hover:border-primary/30 transition-colors cursor-pointer"
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo"
                  className="w-16 h-16 object-contain rounded-[8px] shrink-0"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-[10px] flex items-center justify-center shrink-0"
                  style={{ background: `${primaryColor}18` }}
                >
                  <ImageIcon size={24} style={{ color: primaryColor }} />
                </div>
              )}
              <div className="text-left">
                <p className="text-sm font-semibold" style={{ color: primaryColor }}>
                  {logoPreview ? 'Changer le logo' : 'Ajouter un logo'}
                </p>
                <p className="text-xs text-foreground/40 mt-0.5">JPG, PNG ou WebP · max 2 Mo</p>
              </div>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              className="hidden"
              onChange={handleLogoChange}
            />
            {logoError && <p className="text-xs text-red-500 mt-2">{logoError}</p>}
          </Card>

          {/* Save */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending || (!isDirty && !logoFile)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-[10px] text-sm font-bold text-white transition-opacity disabled:opacity-40"
              style={{ background: primaryColor }}
            >
              {isPending ? <Spinner /> : <Check size={15} />}
              Enregistrer
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

// ── Atoms ─────────────────────────────────────────────────────────────────────

const inputCls = 'w-full px-4 py-3 text-sm rounded-[10px] outline-none bg-[#F3FAF7] border border-[#D6EDE5] focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/15 placeholder:text-foreground/30'

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
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
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] bg-[#F3FAF7] border border-[#D6EDE5]">
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
