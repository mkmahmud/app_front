import type { User, PaginationParams } from '@/types/api'

export interface UserFilters extends PaginationParams {
  role?: string
  isActive?: boolean
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  role?: User['role']
  isActive?: boolean
}

export interface CreateUserPayload {
  name: string
  email: string
  role: User['role']
  password: string
}
