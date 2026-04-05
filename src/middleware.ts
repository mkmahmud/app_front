import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { AUTH_TOKEN_KEY } from '@/config/constants'

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/settings', '/users', '/profile', '/feed']

// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/forgot-password']

// Routes accessible only by specific roles
const ROLE_ROUTES: Record<string, string[]> = {
  '/users': ['admin', 'superadmin'],
  '/settings/billing': ['admin', 'superadmin'],
}

function getTokenFromRequest(request: NextRequest): string | null {
  // Try HTTP-only cookie first (most secure)
  const cookieToken = request.cookies.get(AUTH_TOKEN_KEY)?.value
  if (cookieToken) return cookieToken

  // Fallback to Authorization header (for API routes)
  const authHeader = request.headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  return null
}

function decodeTokenPayload(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

function isTokenExpired(payload: Record<string, unknown>): boolean {
  const exp = payload.exp as number | undefined
  if (!exp) return true
  return Date.now() >= exp * 1000
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = getTokenFromRequest(request)

  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route))

  // Validate token
  let isAuthenticated = false
  let userRole: string | null = null

  if (token) {
    const payload = decodeTokenPayload(token)
    if (payload && !isTokenExpired(payload)) {
      isAuthenticated = true
      userRole = payload.role as string
    }
  }

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Role-based access control
  if (isAuthenticated && userRole) {
    for (const [route, allowedRoles] of Object.entries(ROLE_ROUTES)) {
      if (pathname.startsWith(route) && !allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }
  }

  // Security headers
  const response = NextResponse.next()
  response.headers.set('X-Pathname', pathname)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
