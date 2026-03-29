import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dashboardService, userService } from '@/features/dashboard/services/dashboard.service'
import type { PaginationParams } from '@/types/api'
import { APP_CONFIG } from '@/config/constants'

// Query keys - centralized for cache management
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  activity: (limit?: number) => [...dashboardKeys.all, 'activity', limit] as const,
  data: () => [...dashboardKeys.all, 'data'] as const,
}

export const userKeys = {
  all: ['users'] as const,
  list: (params?: PaginationParams) => [...userKeys.all, 'list', params] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
}

// ─── Dashboard Hooks ──────────────────────────────────────────────────────────

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: dashboardService.getStats,
    staleTime: APP_CONFIG.query.staleTime,
    gcTime: APP_CONFIG.query.gcTime,
    retry: APP_CONFIG.query.retry,
    refetchOnWindowFocus: true,
  })
}

export function useRecentActivity(limit = 10) {
  return useQuery({
    queryKey: dashboardKeys.activity(limit),
    queryFn: () => dashboardService.getRecentActivity(limit),
    staleTime: 60_000, // 1 minute - activity changes more often
  })
}

export function useDashboardData() {
  return useQuery({
    queryKey: dashboardKeys.data(),
    queryFn: dashboardService.getDashboardData,
    staleTime: APP_CONFIG.query.staleTime,
  })
}

// ─── User Hooks ───────────────────────────────────────────────────────────────

export function useUsers(params?: PaginationParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getUsers(params),
    staleTime: APP_CONFIG.query.staleTime,
    placeholderData: prev => prev, // Keep previous data while loading new page
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<import('@/types/api').User> }) =>
      userService.updateUser(id, data),
    onSuccess: (updatedUser) => {
      // Invalidate and update cache
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser)
      queryClient.invalidateQueries({ queryKey: userKeys.list() })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) })
      queryClient.invalidateQueries({ queryKey: userKeys.list() })
    },
  })
}
