'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAuth } from '@/features/auth/session'
import { apiPost, apiDelete, rethrowIfRedirect } from '@/lib/api-client'
import type { Invitation } from './types'

const createSchema = z.object({
  email:       z.string().email('Email invalide'),
  role:        z.enum(['owner', 'manager', 'agent', 'doctor']),
  tenant_code: z.string().min(3).max(6).toUpperCase().optional().or(z.literal('')),
})

export type CreateInvitationFormData = z.infer<typeof createSchema>

export type CreateInvitationResult =
  | { success: true; link: string }
  | { success: false; error: string }

export async function createInvitationAction(data: CreateInvitationFormData): Promise<CreateInvitationResult> {
  const parsed = createSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Données invalides' }
  }

  const payload: Record<string, string> = {
    email: parsed.data.email,
    role:  parsed.data.role,
  }
  if (parsed.data.tenant_code) payload.tenant_code = parsed.data.tenant_code

  try {
    const { token } = await requireAuth()
    const res = await apiPost<{ data: Invitation }>('/carein/invitations', payload, token)
    revalidatePath('/invitations')
    return { success: true, link: res.data.link }
  } catch (err) {
    rethrowIfRedirect(err)
    return { success: false, error: (err as Error).message ?? 'Erreur serveur' }
  }
}

export async function revokeInvitationAction(uuid: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { token } = await requireAuth()
    await apiDelete(`/carein/invitations/${uuid}`, token)
    revalidatePath('/invitations')
    return { success: true }
  } catch (err) {
    rethrowIfRedirect(err)
    return { success: false, error: (err as Error).message }
  }
}
