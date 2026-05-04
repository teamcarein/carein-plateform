import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login', '/invite']

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'carein.cloud'

function extractSubdomain(host: string): string | null {
  const hostname = host.split(':')[0]
  if (hostname === 'localhost' || hostname === BASE_DOMAIN) return null
  if (hostname.endsWith(`.${BASE_DOMAIN}`)) {
    return hostname.slice(0, -(BASE_DOMAIN.length + 1))
  }
  return null
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  const impersonationToken = searchParams.get('impersonation_token')
  if (impersonationToken) {
    const cleanUrl = new URL(request.url)
    cleanUrl.searchParams.delete('impersonation_token')
    const res = NextResponse.redirect(cleanUrl)
    res.cookies.set('auth_token', impersonationToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path:     '/',
      maxAge:   60 * 60 * 2, // 2h — correspond à l'expiry du token backend
    })
    return res
  }

  const token = request.cookies.get('auth_token')?.value

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const subdomain = extractSubdomain(request.headers.get('host') ?? '')
  const reqHeaders = new Headers(request.headers)
  if (subdomain) reqHeaders.set('x-tenant-subdomain', subdomain)

  return NextResponse.next({ request: { headers: reqHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}
