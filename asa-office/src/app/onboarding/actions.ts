'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://suite.carein.cloud/api/v1'

async function getToken(): Promise<string | undefined> {
  return (await cookies()).get('auth_token')?.value
}

export type BrandResult = { success: false; error: string } | never

export async function saveBrandAction(data: {
  name:            string
  subdomain:       string
  description:     string
  primary_color:   string
  secondary_color: string
}): Promise<BrandResult> {
  const token = await getToken()
  if (!token) redirect('/login')

  const res = await fetch(`${API}/tenants/me/settings`, {
    method:  'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept:         'application/json',
      Authorization:  `Bearer ${token}`,
    },
    body: JSON.stringify({
      name:      data.name,
      subdomain: data.subdomain,
      settings:  { description: data.description },
      theme:     { primary: data.primary_color, secondary: data.secondary_color },
    }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string }
    return { success: false, error: body.message ?? 'Erreur serveur' }
  }

  redirect('/dashboard')
}

export async function uploadLogoAction(
  formData: FormData,
): Promise<{ success: true; logo_url: string } | { success: false; error: string }> {
  const token = await getToken()
  if (!token) redirect('/login')

  const res = await fetch(`${API}/tenants/me/logo`, {
    method:  'POST',
    headers: {
      Accept:        'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string }
    return { success: false, error: body.message ?? 'Erreur upload logo' }
  }

  const body = await res.json() as { data?: { logo_url?: string } }
  return { success: true, logo_url: body.data?.logo_url ?? '' }
}
