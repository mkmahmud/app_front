import { renderHook, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { useAuth } from '@/features/auth/hooks/useAuth'
import authReducer from '@/features/auth/slice/auth.slice'
import uiReducer from '@/store/ui.slice'
import * as authService from '@/features/auth/services/auth.service'
import { Permission } from '@/config/constants'

// Mock auth service
jest.mock('@/features/auth/services/auth.service', () => ({
  authService: {
    login: jest.fn(),
    logout: jest.fn(),
    getMe: jest.fn(),
    register: jest.fn(),
  },
}))

const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user' as const,
  permissions: ['dashboard:view'] as Permission[],
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  isEmailVerified: true,
  isActive: true,
}

const mockTokens = {
  token: 'mock-token',
  refreshToken: 'mock-refresh-token',
  expiresAt: Date.now() + 3600000,
}

function createWrapper() {
  const store = configureStore({
    reducer: { auth: authReducer, ui: uiReducer },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )
}

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns initial unauthenticated state', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('sets user state on successful login', async () => {
    const mockLogin = jest.spyOn(authService.authService, 'login').mockResolvedValue({
      user: mockUser,
      tokens: mockTokens,
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'password123' })
    })

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('returns error on failed login', async () => {
    jest.spyOn(authService.authService, 'login').mockRejectedValue(
      new Error('Invalid credentials')
    )

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    let loginResult: { success: boolean; error?: string }

    await act(async () => {
      loginResult = await result.current.login({
        email: 'bad@example.com',
        password: 'wrong',
      })
    })

    expect(loginResult!.success).toBe(false)
    expect(loginResult!.error).toBe('Invalid credentials')
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('clears state on logout', async () => {
    jest.spyOn(authService.authService, 'login').mockResolvedValue({
      user: mockUser,
      tokens: mockTokens,
    })
    jest.spyOn(authService.authService, 'logout').mockResolvedValue()

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'pass123' })
    })

    expect(result.current.isAuthenticated).toBe(true)

    await act(async () => {
      await result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('correctly checks permissions', async () => {
    jest.spyOn(authService.authService, 'login').mockResolvedValue({
      user: mockUser,
      tokens: mockTokens,
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'pass123' })
    })

    expect(result.current.hasPermission('dashboard:view')).toBe(true)
    expect(result.current.hasPermission('user:delete')).toBe(false)
  })
})
