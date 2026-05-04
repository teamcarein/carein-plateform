import { redirect } from 'next/navigation'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://suite.carein.cloud/api/v1'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

/** Re-throw Next.js redirect/notFound throws so server-action catch blocks don't swallow them. */
export function rethrowIfRedirect(err: unknown): void {
  if ((err as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) throw err
  if ((err as { digest?: string }).digest?.startsWith('NEXT_NOT_FOUND'))  throw err
}

function headers(token: string) {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

async function parseResponse<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 401) redirect('/login')
    throw new ApiError(res.status, (body as { message?: string }).message ?? 'Erreur serveur')
  }
  return body as T
}

export async function apiGet<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: headers(token),
    cache: 'no-store',
  })
  return parseResponse<T>(res)
}

export async function apiPost<T>(path: string, body: unknown, token: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(body),
  })
  return parseResponse<T>(res)
}

export async function apiPatch<T>(path: string, body: unknown, token: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify(body),
  })
  return parseResponse<T>(res)
}

export async function apiDelete(path: string, token: string): Promise<void> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'DELETE',
    headers: headers(token),
  })
  if (!res.ok) {
    if (res.status === 401) redirect('/login')
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, (body as { message?: string }).message ?? 'Erreur serveur')
  }
}
