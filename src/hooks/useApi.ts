'use client'

import { useState, useCallback, useRef } from 'react'
import { ApiClientError, createCancelToken, isCancelError } from '@/lib/api'
import { logger } from '@/lib/logger'

interface UseApiState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

interface UseApiOptions {
  onSuccess?: (data: unknown) => void
  onError?: (error: string) => void
}

/**
 * Generic hook for one-off API calls (mutations, imperative fetches).
 * For data fetching with caching, prefer React Query hooks.
 *
 * @example
 * const { execute, isLoading, data, error } = useApi(authService.login)
 * const result = await execute({ email, password })
 */
export function useApi<TArgs extends unknown[], TResult>(
  apiFn: (...args: TArgs) => Promise<TResult>,
  options: UseApiOptions = {}
) {
  const [state, setState] = useState<UseApiState<TResult>>({
    data: null,
    isLoading: false,
    error: null,
  })

  const cancelTokenRef = useRef(createCancelToken())

  const execute = useCallback(
    async (...args: TArgs): Promise<TResult | null> => {
      // Cancel previous request if still running
      cancelTokenRef.current.cancel('New request initiated')
      cancelTokenRef.current = createCancelToken()

      setState(prev => ({ ...prev, isLoading: true, error: null }))

      try {
        const data = await apiFn(...args)
        setState({ data, isLoading: false, error: null })
        options.onSuccess?.(data)
        return data
      } catch (err) {
        if (isCancelError(err)) return null

        const message =
          err instanceof ApiClientError
            ? err.message
            : err instanceof Error
            ? err.message
            : 'An unexpected error occurred'

        logger.error('useApi error', { message, fn: apiFn.name })
        setState(prev => ({ ...prev, isLoading: false, error: message }))
        options.onError?.(message)
        return null
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiFn]
  )

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}
