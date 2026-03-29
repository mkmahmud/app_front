'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { APP_CONFIG } from '@/config/constants'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: APP_CONFIG.query.staleTime,
            gcTime: APP_CONFIG.query.gcTime,
            retry: (failureCount, error) => {
              // Don't retry on 4xx errors (except 408, 429)
              const status = (error as { statusCode?: number })?.statusCode
              if (status && status >= 400 && status < 500 && status !== 408 && status !== 429) {
                return false
              }
              return failureCount < APP_CONFIG.query.retry
            },
            retryDelay: attemptIndex =>
              Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff, max 30s
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
