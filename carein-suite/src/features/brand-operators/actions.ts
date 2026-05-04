'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { requireAuth } from '@/features/auth/session'
import { apiPatch, apiPost, rethrowIfRedirect } from '@/lib/api-client'
import type { BrandOperator, UpdateTenantInput } from './types'

const createSchema = z.object({
  code:      z.string().min(3).max(6).regex(/^[A-Z0-9]{3,6}$/, 'Code : 3-6 caractères majuscules ou chiffres'),
  name:      z.string().min(2, 'Nom requis'),
  type:      z.enum(['ngo', 'public', 'private', 'government']),
  country:   z.string().length(2, 'Code pays ISO 2 lettres'),
  language:  z.string().min(2).max(5),
  currency:  z.string().length(3, 'Code devise ISO 3 lettres'),
  timezone:  z.string().min(3, 'Timezone requise'),
})

export type CreateBOInput  = z.infer<typeof createSchema>
export type CreateBOResult =
  | { success: true; bo: BrandOperator }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

export async function createBrandOperatorAction(data: CreateBOInput): Promise<CreateBOResult> {
  const parsed = createSchema.safeParse(data)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Données invalides',
      fieldErrors: parsed.error.issues.reduce<Record<string, string[]>>((acc, issue) => {
        const key = issue.path[0]?.toString() ?? '_'
        ;(acc[key] ??= []).push(issue.message)
        return acc
      }, {}),
    }
  }

  try {
    const { token } = await requireAuth()
    const res = await apiPost<{ data: BrandOperator }>('/admin/tenants', parsed.data, token)
    revalidatePath('/brand-operators')
    return { success: true, bo: res.data }
  } catch (err) {
    rethrowIfRedirect(err)
    return { success: false, error: (err as Error).message ?? 'Erreur serveur' }
  }
}

// PATCH /admin/tenants/{uuid} — édition des champs de base
export async function updateBrandOperatorAction(
  uuid: string,
  data: UpdateTenantInput,
): Promise<{ success: true; bo: BrandOperator } | { success: false; error: string }> {
  try {
    const { token } = await requireAuth()
    const res = await apiPatch<{ data: BrandOperator }>(`/admin/tenants/${uuid}`, data, token)
    revalidatePath('/brand-operators')
    revalidatePath(`/brand-operators/${uuid}`)
    return { success: true, bo: res.data }
  } catch (err) {
    rethrowIfRedirect(err)
    return { success: false, error: (err as Error).message }
  }
}

// POST /admin/tenants/{uuid}/suspend — active → suspended
export async function suspendBrandOperatorAction(
  uuid: string,
  reason?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { token } = await requireAuth()
    await apiPost(`/admin/tenants/${uuid}/suspend`, reason ? { reason } : {}, token)
    revalidatePath('/brand-operators')
    revalidatePath(`/brand-operators/${uuid}`)
    return { success: true }
  } catch (err) {
    rethrowIfRedirect(err)
    return { success: false, error: (err as Error).message }
  }
}

// POST /admin/tenants/{uuid}/reactivate — suspended → active
export async function reactivateBrandOperatorAction(uuid: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { token } = await requireAuth()
    await apiPost(`/admin/tenants/${uuid}/reactivate`, {}, token)
    revalidatePath('/brand-operators')
    revalidatePath(`/brand-operators/${uuid}`)
    return { success: true }
  } catch (err) {
    rethrowIfRedirect(err)
    return { success: false, error: (err as Error).message }
  }
}

// POST /admin/tenants/{uuid}/activate — pending → active
export async function activateBrandOperatorAction(uuid: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { token } = await requireAuth()
    await apiPost(`/admin/tenants/${uuid}/activate`, {}, token)
    revalidatePath('/brand-operators')
    revalidatePath(`/brand-operators/${uuid}`)
    return { success: true }
  } catch (err) {
    rethrowIfRedirect(err)
    return { success: false, error: (err as Error).message }
  }
}

// POST /admin/tenants/{uuid}/archive — suspended → archived
export async function archiveBrandOperatorAction(uuid: string): Promise<void> {
  const { token } = await requireAuth()
  await apiPost(`/admin/tenants/${uuid}/archive`, {}, token)
  revalidatePath('/brand-operators')
  redirect('/brand-operators')
}
