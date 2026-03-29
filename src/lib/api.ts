import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelToken,
  isAxiosError,
} from 'axios'
import { getCookie, setCookie, deleteCookie } from 'cookies-next'
import { APP_CONFIG, AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/config/constants'
import { ApiError, ApiResponse } from '@/types/api'
import { logger } from '@/lib/logger'

// ─── API Error ────────────────────────────────────────────────────────────────

export class ApiClientError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number,
    public readonly details?: unknown
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

function normalizeError(error: unknown): ApiClientError {
  if (isAxiosError(error)) {
    const status = error.response?.status ?? 0
    const data = error.response?.data as ApiError | undefined

    return new ApiClientError(
      data?.code ?? 'UNKNOWN_ERROR',
      data?.message ?? error.message ?? 'An unexpected error occurred',
      status,
      data?.details
    )
  }

  if (error instanceof ApiClientError) return error

  const message = error instanceof Error ? error.message : 'Unknown error'
  return new ApiClientError('CLIENT_ERROR', message, 0)
}

// ─── Token Management ─────────────────────────────────────────────────────────

let isRefreshing = false
let refreshQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

function processRefreshQueue(token: string | null, error: unknown = null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token)
    else reject(error)
  })
  refreshQueue = []
}

// ─── Axios Instance ───────────────────────────────────────────────────────────

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: APP_CONFIG.api.baseUrl,
    timeout: APP_CONFIG.api.timeout,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    withCredentials: true, // Send HTTP-only cookies
  })

  // ── Request Interceptor ──────────────────────────────────────────────────────
  client.interceptors.request.use(
    config => {
      // Attach token from cookie (server side doesn't need this — middleware handles it)
      if (typeof window !== 'undefined') {
        const token = getCookie(AUTH_TOKEN_KEY)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }

      // Add request ID for tracing
      config.headers['X-Request-ID'] = crypto.randomUUID()

      logger.debug('API Request', {
        method: config.method?.toUpperCase(),
        url: config.url,
        params: config.params,
      })

      return config
    },
    error => {
      logger.error('API Request Error', error)
      return Promise.reject(normalizeError(error))
    }
  )

  // ── Response Interceptor ─────────────────────────────────────────────────────
  client.interceptors.response.use(
    response => {
      logger.debug('API Response', {
        status: response.status,
        url: response.config.url,
      })
      return response
    },
    async error => {
      const originalRequest = error.config

      // Handle 401: Token refresh flow
      if (
        isAxiosError(error) &&
        error.response?.status === 401 &&
        !originalRequest._retry
      ) {
        if (isRefreshing) {
          // Queue requests while refreshing
          return new Promise((resolve, reject) => {
            refreshQueue.push({ resolve, reject })
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              return client(originalRequest)
            })
            .catch(err => Promise.reject(normalizeError(err)))
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const refreshToken = getCookie(REFRESH_TOKEN_KEY)
          if (!refreshToken) {
            throw new Error('No refresh token')
          }

          const { data } = await client.post<{ token: string }>('/auth/refresh', {
            refreshToken,
          })

          const newToken = data.token
          setCookie(AUTH_TOKEN_KEY, newToken, {
            maxAge: APP_CONFIG.auth.cookieMaxAge,
            httpOnly: false, // Client-readable for attachment
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
          })

          originalRequest.headers.Authorization = `Bearer ${newToken}`
          processRefreshQueue(newToken)
          return client(originalRequest)
        } catch (refreshError) {
          processRefreshQueue(null, refreshError)
          // Clear auth and redirect to login
          deleteCookie(AUTH_TOKEN_KEY)
          deleteCookie(REFRESH_TOKEN_KEY)
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login?reason=session_expired'
          }
          return Promise.reject(normalizeError(refreshError))
        } finally {
          isRefreshing = false
        }
      }

      logger.error('API Error', {
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data,
      })

      return Promise.reject(normalizeError(error))
    }
  )

  return client
}

export const apiClient = createApiClient()

// ─── Typed API helpers ────────────────────────────────────────────────────────

export const api = {
  get: <T>(
    url: string,
    config?: AxiosRequestConfig & { cancelToken?: CancelToken }
  ): Promise<ApiResponse<T>> =>
    apiClient.get<ApiResponse<T>>(url, config).then(r => r.data),

  post: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    apiClient.post<ApiResponse<T>>(url, data, config).then(r => r.data),

  put: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    apiClient.put<ApiResponse<T>>(url, data, config).then(r => r.data),

  patch: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    apiClient.patch<ApiResponse<T>>(url, data, config).then(r => r.data),

  delete: <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    apiClient.delete<ApiResponse<T>>(url, config).then(r => r.data),
}

// ─── Request cancellation ─────────────────────────────────────────────────────
export const createCancelToken = () => axios.CancelToken.source()
export const isCancelError = axios.isCancel
