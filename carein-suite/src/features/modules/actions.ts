'use server'

import { requireAuth } from '@/features/auth/session'
import { apiPatch, rethrowIfRedirect } from '@/lib/api-client'
import { revalidatePath } from 'next/cache'

export async function updateTenantModulesAction(
  code: string,
  modules: string[],
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const { token } = await requireAuth()
    await apiPatch(`/carein/tenants/${code}/settings`, { modules }, token)
    revalidatePath('/modules')
    return { success: true }
  } catch (err) {
    rethrowIfRedirect(err)
    return { success: false, error: (err as Error).message }
  }
}
