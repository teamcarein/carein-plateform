import { api } from '@/lib/api-client'
import { User, UserRole, PaginatedResponse } from '@/types'

export type UserFilters = {
  role?: UserRole
  facility_id?: string
  is_active?: boolean
  search?: string
  page?: number
  per_page?: number
}

export function getUsers(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
  return api.get('admin/users', filters)
}

export function getUser(id: string): Promise<User> {
  return api.get(`admin/users/${id}`)
}
