'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://suite.carein.cloud/api/v1'

export type AcceptResult =
  | { success: false; error: string }
  | never

export async function acceptInvitationAction(
  token: string,
  data: { name: string; password: string; password_confirmation: string },
): Promise<AcceptResult> {
  const res = await fetch(`${API}/public/invitations/${token}/accept`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body:    JSON.stringify(data),
  })

  const body = await res.json() as { access_token?: string; message?: string }

  if (!res.ok) {
    return { success: false, error: body.message ?? 'Erreur serveur' }
  }

  const cookieStore = await cookies()
  cookieStore.set('auth_token', body.access_token!, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path:     '/',
    maxAge:   60 * 60 * 24 * 7,
  })

  redirect('/onboarding')
}
