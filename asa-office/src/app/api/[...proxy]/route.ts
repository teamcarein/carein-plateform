import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const BACKEND = (process.env.NEXT_PUBLIC_API_URL ?? 'https://suite.carein.cloud/api/v1').replace(/\/$/, '')

type Params = { params: Promise<{ proxy: string[] }> }

async function handler(req: NextRequest, { params }: Params): Promise<NextResponse> {
  const { proxy } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  const path   = proxy.join('/')
  const search = req.nextUrl.search
  const url    = `${BACKEND}/${path}${search}`

  const headers: Record<string, string> = { Accept: 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  let body: string | undefined
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const text = await req.text()
    if (text) {
      body = text
      headers['Content-Type'] = 'application/json'
    }
  }

  try {
    const res         = await fetch(url, { method: req.method, headers, body, cache: 'no-store' })
    const contentType = res.headers.get('Content-Type') ?? ''

    if (!contentType.includes('application/json')) {
      const blob = await res.blob()
      return new NextResponse(blob, {
        status: res.status,
        headers: {
          'Content-Type':        contentType || 'application/octet-stream',
          'Content-Disposition': res.headers.get('Content-Disposition') ?? '',
        },
      })
    }

    const data = await res.json().catch(() => null)
    return NextResponse.json(data ?? {}, { status: res.status })
  } catch {
    return NextResponse.json({ message: 'Serveur inaccessible' }, { status: 503 })
  }
}

export const GET    = handler
export const POST   = handler
export const PUT    = handler
export const PATCH  = handler
export const DELETE = handler
