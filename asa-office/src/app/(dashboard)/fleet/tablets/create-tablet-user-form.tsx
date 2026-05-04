'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { Input, Button, Card } from '@carein/ui-kit'
import { useCreateTabletUser } from '@/features/fleet/hooks'

const schema = z.object({
  name:      z.string().min(2, 'Requis'),
  matricule: z.string().min(1, 'Requis').max(50),
  pin:       z.string().length(6, 'Le PIN doit faire exactement 6 chiffres').regex(/^\d+$/, 'Chiffres uniquement'),
  pin_confirm: z.string().length(6),
}).refine(d => d.pin === d.pin_confirm, {
  message: 'Les PINs ne correspondent pas',
  path: ['pin_confirm'],
})

type FormData = z.infer<typeof schema>

export function CreateTabletUserForm({ onClose }: { onClose: () => void }) {
  const { mutate, isPending, error } = useCreateTabletUser()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  function onSubmit(data: FormData) {
    mutate(
      { name: data.name, matricule: data.matricule, pin: data.pin },
      { onSuccess: onClose },
    )
  }

  return (
    <Card className="border-primary/30 bg-primary/2">
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-sm">Nouvel utilisateur tablette</p>
        <button onClick={onClose} className="p-1 rounded text-foreground/40 hover:text-foreground transition-colors">
          <X size={15} />
        </button>
      </div>

      {error && (
        <div className="mb-3 px-3 py-2 rounded-[6px] bg-danger/8 text-danger text-xs">{error.message}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Nom complet *"
            placeholder="Jean Dupont"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Matricule *"
            placeholder="AGT-001"
            error={errors.matricule?.message}
            {...register('matricule')}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="PIN (6 chiffres) *"
            type="password"
            placeholder="••••••"
            maxLength={6}
            error={errors.pin?.message}
            {...register('pin')}
          />
          <Input
            label="Confirmer le PIN *"
            type="password"
            placeholder="••••••"
            maxLength={6}
            error={errors.pin_confirm?.message}
            {...register('pin_confirm')}
          />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>Annuler</Button>
          <Button type="submit" size="sm" loading={isPending}>Créer l'utilisateur</Button>
        </div>
      </form>
    </Card>
  )
}
