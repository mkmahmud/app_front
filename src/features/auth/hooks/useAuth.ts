'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { setCookie, deleteCookie } from 'cookies-next'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  setUser,
  setTokens,
  clearAuth,
  setAuthLoading,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectUserRole,
  selectUserPermissions,
} from '@/features/auth/slice/auth.slice'
import { authService } from '@/features/auth/services/auth.service'
import {
  AUTH_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  ROLE_PERMISSIONS,
  APP_CONFIG,
  Permission,
} from '@/config/constants'
import type { LoginCredentials, RegisterData, } from '@/types/api'

import { logger } from '@/lib/logger'

export function useAuth() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const user = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const isLoading = useAppSelector(selectAuthLoading)
  const role = useAppSelector(selectUserRole)
  const permissions = useAppSelector(selectUserPermissions)

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      dispatch(setAuthLoading(true))
      try {
        const { user, tokens } = await authService.login(credentials)

        // Store tokens in cookies
        setCookie(AUTH_TOKEN_KEY, tokens.token, {
          maxAge: APP_CONFIG.auth.cookieMaxAge,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        })
        setCookie(REFRESH_TOKEN_KEY, tokens.refreshToken, {
          maxAge: APP_CONFIG.auth.cookieMaxAge,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        })

        dispatch(setUser(user))
        dispatch(setTokens(tokens))

        logger.info('User logged in', { userId: user.id })
        return { success: true }
      } catch (err) {
        logger.error('Login failed', err)
        const message =
          err instanceof Error ? err.message : 'Login failed'
        return { success: false, error: message }
      }
    },
    [dispatch]
  )

  const register = useCallback(
    async (data: RegisterData) => {
      dispatch(setAuthLoading(true))
      try {
        const { user, tokens } = await authService.register(data)

        setCookie(AUTH_TOKEN_KEY, tokens.token, {
          maxAge: APP_CONFIG.auth.cookieMaxAge,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        })

        dispatch(setUser(user))
        dispatch(setTokens(tokens))

        return { success: true }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed'
        return { success: false, error: message }
      }
    },
    [dispatch]
  )

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // Continue with local cleanup even if API fails
    } finally {
      deleteCookie(AUTH_TOKEN_KEY)
      deleteCookie(REFRESH_TOKEN_KEY)
      dispatch(clearAuth())
      router.push('/auth/login')
    }
  }, [dispatch, router])

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      return permissions.includes(permission)
    },
    [permissions]
  )

  const hasRole = useCallback(
    (requiredRole: string | string[]): boolean => {
      if (!role) return false
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
      return roles.includes(role)
    },
    [role]
  )

  const initAuth = useCallback(async () => {
    dispatch(setAuthLoading(true))
    try {
      const user = await authService.getMe()
      dispatch(setUser(user))
    } catch {
      dispatch(clearAuth())
    }
  }, [dispatch])

  return {
    user,
    isAuthenticated,
    isLoading,
    role,
    permissions,
    login,
    register,
    logout,
    hasPermission,
    hasRole,
    initAuth,
  }
}
