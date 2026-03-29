import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { REFRESH_TOKEN_KEY, AUTH_TOKEN_KEY, APP_CONFIG } from '@/config/constants'

export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  // @ts-ignore
  const refreshToken = cookieStore.get(REFRESH_TOKEN_KEY)?.value

  if (!refreshToken) {
    return NextResponse.json(
      { error: 'No refresh token provided' },
      { status: 401 }
    )
  }

  try {
    // Forward refresh request to actual backend
    const response = await fetch(`${process.env.API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      // Clear cookies on failed refresh
      // @ts-ignore
      cookieStore.delete(AUTH_TOKEN_KEY)
      // @ts-ignore
      cookieStore.delete(REFRESH_TOKEN_KEY)
      return NextResponse.json({ error: 'Token refresh failed' }, { status: 401 })
    }

    const data = await response.json()
    const nextResponse = NextResponse.json(data)

    // Set HTTP-only cookie server side
    nextResponse.cookies.set(AUTH_TOKEN_KEY, data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: APP_CONFIG.auth.cookieMaxAge,
      path: '/',
    })

    return nextResponse
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
