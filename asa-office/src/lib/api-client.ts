// All requests go through /api/[...proxy] (Next.js route handler) which
// reads the httpOnly auth_token cookie server-side and attaches the Bearer header.
// Client code never touches the cookie directly.

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

type Params = Record<string, string | number | boolean | undefined | null>

async function request<T>(path: string, init: RequestInit & { params?: Params } = {}): Promise<T> {
  const { params, ...fetchInit } = init

  let url = `/api/${path.replace(/^\/+/, '')}`
  if (params) {
    const qs = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.set(k, String(v))
    })
    const s = qs.toString()
    if (s) url += `?${s}`
  }

  const res = await fetch(url, { cache: 'no-store', ...fetchInit })

  if (res.status === 401 && typeof window !== 'undefined') {
    window.location.href = '/api/auth/logout'
    throw new ApiError(401, 'Session expirée')
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Erreur inconnue' }))
    throw new ApiError(res.status, err.message ?? 'Erreur inconnue')
  }

  if (res.status === 204) return undefined as T

  const json = await res.json()

  // Normalize any Laravel paginated shape into { data: T[], meta: { current_page, last_page, per_page, total } }.
  // Handles: flat paginator, API Resource collection (meta object), meta:null, meta:{} missing fields.
  if (
    json !== null &&
    typeof json === 'object' &&
    !Array.isArray(json) &&
    Array.isArray((json as Record<string, unknown>).data)
  ) {
    const j      = json as Record<string, unknown>
    const m      = (j.meta ?? {}) as Record<string, unknown>
    const items  = j.data as unknown[]

    if (typeof m.current_page !== 'number') {
      return {
        ...j,
        meta: {
          current_page: Number(j.current_page ?? m.current_page ?? 1),
          last_page:    Number(j.last_page    ?? m.last_page    ?? 1),
          per_page:     Number(j.per_page     ?? m.per_page     ?? items.length),
          total:        Number(j.total        ?? m.total        ?? items.length),
        },
      } as T
    }
  }

  return json as T
}

export const api = {
  get<T>(path: string, params?: Params) {
    return request<T>(path, { method: 'GET', params })
  },
  post<T>(path: string, body?: unknown) {
    return request<T>(path, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    body !== undefined ? JSON.stringify(body) : undefined,
    })
  },
  patch<T>(path: string, body?: unknown) {
    return request<T>(path, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    body !== undefined ? JSON.stringify(body) : undefined,
    })
  },
  delete<T>(path: string) {
    return request<T>(path, { method: 'DELETE' })
  },
}
