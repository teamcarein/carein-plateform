import { cookies } from 'next/headers'
import { AuthUser } from '@/types'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://suite.carein.cloud/api/v1'

export async function getSession(): Promise<{ token: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) return null
  return { token }
}

export async function requireAuth(): Promise<{ token: string }> {
  const session = await getSession()
  if (!session) {
    const { redirect } = await import('next/navigation')
    redirect('/login')
    // redirect() throws NEXT_REDIRECT — unreachable but satisfies TS
    throw new Error('unreachable')
  }
  return session
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getSession()
  if (!session) return null

  try {
    const res = await fetch(`${API}/me`, {
      headers: {
        Authorization: `Bearer ${session.token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json() as Promise<AuthUser>
  } catch {
    return null
  }
}
