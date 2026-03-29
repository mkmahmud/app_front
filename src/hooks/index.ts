'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppSelector } from '@/store'
import { selectUserPermissions, selectUserRole } from '@/features/auth/slice/auth.slice'

// ─── useDebounce ──────────────────────────────────────────────────────────────
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// ─── usePagination ────────────────────────────────────────────────────────────
interface UsePaginationOptions {
  initialPage?: number
  initialPageSize?: number
  total?: number
}

export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  total = 0,
}: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const totalPages = Math.ceil(total / pageSize)
  const hasNextPage = page < totalPages
  const hasPreviousPage = page > 1

  const goToPage = useCallback(
    (newPage: number) => {
      setPage(Math.max(1, Math.min(newPage, totalPages)))
    },
    [totalPages]
  )

  const nextPage = useCallback(() => {
    if (hasNextPage) setPage(p => p + 1)
  }, [hasNextPage])

  const prevPage = useCallback(() => {
    if (hasPreviousPage) setPage(p => p - 1)
  }, [hasPreviousPage])

  const changePageSize = useCallback((size: number) => {
    setPageSize(size)
    setPage(1) // Reset to first page when changing size
  }, [])

  const reset = useCallback(() => {
    setPage(initialPage)
    setPageSize(initialPageSize)
  }, [initialPage, initialPageSize])

  return {
    page,
    pageSize,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    reset,
    // Params ready for API
    params: { page, pageSize },
  }
}

// ─── usePermission ────────────────────────────────────────────────────────────
export function usePermission() {
  const permissions = useAppSelector(selectUserPermissions)
  const role = useAppSelector(selectUserRole)

  const hasPermission = useCallback(
    (permission: Permission | Permission[]): boolean => {
      const required = Array.isArray(permission) ? permission : [permission]
      return required.every(p => permissions.includes(p))
    },
    [permissions]
  )

  const hasAnyPermission = useCallback(
    (permissionList: Permission[]): boolean => {
      return permissionList.some(p => permissions.includes(p))
    },
    [permissions]
  )

  const hasRole = useCallback(
    (requiredRole: Role | Role[]): boolean => {
      if (!role) return false
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
      return roles.includes(role as Role)
    },
    [role]
  )

  return { hasPermission, hasAnyPermission, hasRole, role, permissions }
}

// ─── useNetworkStatus ─────────────────────────────────────────────────────────
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline, isOffline: !isOnline }
}

// ─── useLocalStorage ──────────────────────────────────────────────────────────
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const newValue = value instanceof Function ? value(storedValue) : value
        setStoredValue(newValue)
        window.localStorage.setItem(key, JSON.stringify(newValue))
      } catch {
        // Silently fail
      }
    },
    [key, storedValue]
  )

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch {
      // Silently fail
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue] as const
}

// ─── useClickOutside ──────────────────────────────────────────────────────────
export function useClickOutside<T extends HTMLElement>(
  callback: () => void
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [callback])

  return ref
}

// ─── useIntersectionObserver ──────────────────────────────────────────────────
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const ref = useRef<HTMLElement>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(element)
    return () => observer.disconnect()
  }, [options])

  return { ref, isIntersecting }
}

// ─── useMediaQuery ────────────────────────────────────────────────────────────
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (event: MediaQueryListEvent) => setMatches(event.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

export const useIsMobile = () => useMediaQuery('(max-width: 768px)')
export const useIsTablet = () => useMediaQuery('(max-width: 1024px)')

// ─── useFeatureFlag ───────────────────────────────────────────────────────────
import { FEATURE_FLAGS, Permission, Role } from '@/config/constants'

export function useFeatureFlag(flag: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[flag]
}
