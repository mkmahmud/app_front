import { api } from '@/lib/api'
import type {
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  User,
  AuthTokens,
} from '@/types/api'

export interface LoginResponse {
  user: User
  tokens: AuthTokens
}

export interface RefreshResponse {
  token: string
  expiresAt: number
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials)
    return response.data
  },

  register: async (data: RegisterData): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/register', data)
    return response.data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<void> => {
    await api.post('/auth/forgot-password', data)
  },

  resetPassword: async (data: ResetPasswordData): Promise<void> => {
    await api.post('/auth/reset-password', data)
  },

  refreshToken: async (refreshToken: string): Promise<RefreshResponse> => {
    const response = await api.post<RefreshResponse>('/auth/refresh', {
      refreshToken,
    })
    return response.data
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me')
    return response.data
  },

  verifyEmail: async (token: string): Promise<void> => {
    await api.post('/auth/verify-email', { token })
  },
}
