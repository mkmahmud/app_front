// ─── API Types ────────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
  meta?: PaginationMeta
}

export interface ApiError {
  code: string
  message: string
  statusCode: number
  details?: unknown
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// ─── User Types ───────────────────────────────────────────────────────────────
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: import('@/config/constants').Role
  permissions: import('@/config/constants').Permission[]
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  isEmailVerified: boolean
  isActive: boolean
  preferences?: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  notifications: {
    email: boolean
    push: boolean
    inApp: boolean
  }
}

// ─── Auth Types ───────────────────────────────────────────────────────────────
export interface AuthTokens {
  token: string
  refreshToken: string
  expiresAt: number
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  token: string
  password: string
  confirmPassword: string
}

// ─── Component Types ──────────────────────────────────────────────────────────
export interface SelectOption<T = string> {
  label: string
  value: T
  disabled?: boolean
  description?: string
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface NavItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
  children?: NavItem[]
  roles?: import('@/config/constants').Role[]
  permissions?: import('@/config/constants').Permission[]
}

// ─── Table Types ──────────────────────────────────────────────────────────────
export interface TableColumn<T> {
  key: keyof T | string
  header: string
  cell?: (row: T) => React.ReactNode
  sortable?: boolean
  className?: string
}

// ─── Form Types ───────────────────────────────────────────────────────────────
export type FormStatus = 'idle' | 'loading' | 'success' | 'error'

// ─── Dashboard Types ──────────────────────────────────────────────────────────
export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  revenue: number
  growth: number
}

export interface ActivityItem {
  id: string
  user: Pick<User, 'id' | 'name' | 'avatar'>
  action: string
  target?: string
  timestamp: string
}
