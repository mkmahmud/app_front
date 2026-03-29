import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { User, AuthTokens } from '@/types/api'
import type { RootState } from '@/store'

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true, // Start as loading to handle hydration
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
    },
    setTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.tokens = action.payload
    },
    clearAuth: state => {
      state.user = null
      state.tokens = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
  },
})

export const {
  setUser,
  setTokens,
  clearAuth,
  setAuthLoading,
  setAuthError,
  updateUser,
} = authSlice.actions

// Selectors
export const selectUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated
export const selectAuthLoading = (state: RootState) => state.auth.isLoading
export const selectUserRole = (state: RootState) => state.auth.user?.role
export const selectUserPermissions = (state: RootState) =>
  state.auth.user?.permissions ?? []

export default authSlice.reducer
