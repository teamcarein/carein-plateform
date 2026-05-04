'use server'

import { z } from 'zod'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const API       = process.env.NEXT_PUBLIC_API_URL ?? 'https://suite.carein.cloud/api/v1'
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

// ── Étape 1 : soumettre email + mot de passe ────────────────────────────────

const loginSchema = z.object({
  email:    z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

export type LoginInput = z.infer<typeof loginSchema>

export type LoginResult =
  | { success: true; userId: number }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

export async function loginAction(data: LoginInput): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(data)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Données invalides',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  if (DEMO_MODE) {
    return { success: true, userId: 1 }
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body:    JSON.stringify({ email: parsed.data.email, password: parsed.data.password }),
    })

    const body = await res.json()

    if (!res.ok) {
      return { success: false, error: body.message ?? 'Identifiants invalides.' }
    }

    return { success: true, userId: body.user_id as number }
  } catch {
    return { success: false, error: 'Impossible de joindre le serveur.' }
  }
}

// ── Étape 2 : vérifier le code OTP ─────────────────────────────────────────

const otpSchema = z.object({
  userId: z.number().int().positive(),
  code:   z.string().length(6, 'Le code doit contenir 6 chiffres'),
})

export type OtpInput = z.infer<typeof otpSchema>

export type OtpResult =
  | { success: true }
  | { success: false; error: string }

export async function verifyOtpAction(data: OtpInput): Promise<OtpResult> {
  const parsed = otpSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: 'Code invalide.' }
  }

  if (DEMO_MODE) {
    const cookieStore = await cookies()
    cookieStore.set('auth_token', 'demo-token', {
      httpOnly: true,
      secure:   false,
      sameSite: 'lax',
      path:     '/',
      maxAge:   60 * 60 * 24 * 7,
    })
  } else {
    try {
      const res = await fetch(`${API}/auth/otp/verify`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify({ user_id: parsed.data.userId, code: parsed.data.code }),
      })

      const body = await res.json()

      if (!res.ok) {
        return { success: false, error: body.message ?? 'Code OTP invalide ou expiré.' }
      }

      const cookieStore = await cookies()
      cookieStore.set('auth_token', body.access_token as string, {
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path:     '/',
        maxAge:   body.expires_in as number,
      })
    } catch {
      return { success: false, error: 'Impossible de joindre le serveur.' }
    }
  }

  redirect('/dashboard')
}

// ── Déconnexion ─────────────────────────────────────────────────────────────

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (token) {
    await fetch(`${API}/auth/logout`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    }).catch(() => {})
  }

  cookieStore.delete('auth_token')
  redirect('/login')
}
