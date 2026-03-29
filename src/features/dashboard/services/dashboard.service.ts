import { api } from '@/lib/api'
import type { DashboardStats, ActivityItem, PaginationParams, PaginationMeta } from '@/types/api'

export interface DashboardData {
  stats: DashboardStats
  recentActivity: ActivityItem[]
}

export interface UserListResponse {
  users: import('@/types/api').User[]
  meta: PaginationMeta
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/dashboard/stats')
    return response.data
  },

  getRecentActivity: async (limit = 10): Promise<ActivityItem[]> => {
    const response = await api.get<ActivityItem[]>(`/dashboard/activity?limit=${limit}`)
    return response.data
  },

  getDashboardData: async (): Promise<DashboardData> => {
    const response = await api.get<DashboardData>('/dashboard')
    return response.data
  },
}

export const userService = {
  getUsers: async (params?: PaginationParams): Promise<UserListResponse> => {
    const response = await api.get<UserListResponse>('/users', { params })
    return response.data
  },

  getUserById: async (id: string) => {
    const response = await api.get<import('@/types/api').User>(`/users/${id}`)
    return response.data
  },

  updateUser: async (id: string, data: Partial<import('@/types/api').User>) => {
    const response = await api.patch<import('@/types/api').User>(`/users/${id}`, data)
    return response.data
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`)
  },
}
