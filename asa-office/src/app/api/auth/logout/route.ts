import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const API = (process.env.NEXT_PUBLIC_API_URL ?? 'https://suite.carein.cloud/api/v1').replace(/\/$/, '')

export async function GET() {
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
