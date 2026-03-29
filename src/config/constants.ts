// Application configuration
export const APP_CONFIG = {
  name: 'SaaS App',
  version: '0.1.0',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1/v1',
    timeout: 30_000, // 30 seconds
    retries: 3,
    retryDelay: 1000,
  },
  auth: {
    tokenExpiry: 60 * 60 * 1000, // 1 hour
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
    cookieMaxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  },
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
  },
  query: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
  },
} as const

// Auth token cookie key
export const AUTH_TOKEN_KEY = 'auth_token'
export const REFRESH_TOKEN_KEY = 'refresh_token'

// Roles
export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  USER: 'user',
  VIEWER: 'viewer',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

// Permissions
export const PERMISSIONS = {
  // User management
  USER_READ: 'user:read',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  // Dashboard
  DASHBOARD_VIEW: 'dashboard:view',
  ANALYTICS_VIEW: 'analytics:view',
  // Settings
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_UPDATE: 'settings:update',
  BILLING_VIEW: 'billing:view',
  BILLING_UPDATE: 'billing:update',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

// Role-permission mapping
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  superadmin: Object.values(PERMISSIONS) as Permission[],
  admin: [
    'user:read', 'user:create', 'user:update',
    'dashboard:view', 'analytics:view',
    'settings:view', 'settings:update',
    'billing:view', 'billing:update',
  ],
  user: [
    'dashboard:view',
    'settings:view',
  ],
  viewer: [
    'dashboard:view',
  ],
}

// Feature flags
export const FEATURE_FLAGS = {
  ANALYTICS: process.env.NEXT_PUBLIC_FEATURE_ANALYTICS === 'true',
  BILLING: process.env.NEXT_PUBLIC_FEATURE_BILLING === 'true',
  DARK_MODE: true,
  I18N: process.env.NEXT_PUBLIC_FEATURE_I18N === 'true',
  WEBSOCKET: process.env.NEXT_PUBLIC_FEATURE_WEBSOCKET === 'true',
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  USERS: '/users',
  PROFILE: '/profile',
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/unauthorized',
} as const
