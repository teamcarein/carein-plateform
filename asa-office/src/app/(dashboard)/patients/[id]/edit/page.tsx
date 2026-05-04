'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ArrowLeft } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { Card, Input, Button } from '@carein/ui-kit'
import { usePatient, useUpdatePatient } from '@/features/patients/hooks'
import { UpdatePatientInput } from '@/features/patients/api'

const selectCls = 'px-3 py-2 text-sm rounded-[var(--radius-btn,6px)] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 w-full'

export default function EditPatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router  = useRouter()
  const { data: patient, isLoading, isError } = usePatient(id)
  const mutation = useUpdatePatient(id)

  const { register, handleSubmit } = useForm<UpdatePatientInput>({
    values: patient ? {
      last_name:  patient.last_name,
      first_name: patient.first_name ?? '',
      birth_date: patient.birth_date ?? '',
      gender:     patient.gender,
      phone:      patient.phone ?? '',
      height_cm:  patient.height_cm,
      weight_kg:  patient.weight_kg,
    } : undefined,
  })

  function onSubmit(data: UpdatePatientInput) {
    // Strip empty strings to avoid overwriting with blanks
    const clean = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== '' && v !== undefined)
    ) as UpdatePatientInput
    mutation.mutate(clean, { onSuccess: () => router.push(`/patients/${id}`) })
  }

  if (isLoading) {
    return (
      <div>
        <Topbar />
        <div className="p-6 space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-10 rounded-[8px] bg-foreground/5 animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (isError || !patient) {
    return (
      <div>
        <Topbar />
        <div className="p-6 text-center text-foreground/50 py-20">Patient introuvable.</div>
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

        <h1 className="text-lg font-semibold mb-1">
          Modifier — {patient.first_name} {patient.last_name}
        </h1>
        <p className="text-sm text-foreground/40 mb-5 font-mono">{patient.patient_code}</p>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
            {mutation.error && (
              <div className="px-4 py-3 rounded-[var(--radius-btn,6px)] bg-danger/10 text-danger text-sm">
                {mutation.error.message}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input label="Prénom" placeholder="Amara" {...register('first_name')} />
              <Input label="Nom *"  placeholder="Koné"  {...register('last_name')} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Date de naissance" type="date" {...register('birth_date')} />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Sexe</label>
                <select className={selectCls} {...register('gender')}>
                  <option value="">—</option>
                  <option value="male">Masculin</option>
                  <option value="female">Féminin</option>
                </select>
              </div>
            </div>

            <Input label="Téléphone" placeholder="+225 07 00 00 00 00" {...register('phone')} />

            <div className="grid grid-cols-2 gap-4">
              <Input label="Taille (cm)" type="number" min={50} max={250}
                {...register('height_cm', { valueAsNumber: true })} />
              <Input label="Poids (kg)" type="number" min={1} max={500} step={0.1}
                {...register('weight_kg', { valueAsNumber: true })} />
            </div>

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
