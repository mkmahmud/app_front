'use client'

import { Permission, Role } from '@/config/constants'
import { usePermission } from '@/hooks'
 
interface PermissionGuardProps {
  children: React.ReactNode
  permission?: Permission | Permission[]
  role?: Role | Role[]
  fallback?: React.ReactNode
  requireAll?: boolean // if true, all permissions required; else any
}

/**
 * Renders children only if the current user has the required permissions/roles.
 *
 * @example
 * <PermissionGuard permission="user:delete">
 *   <DeleteButton />
 * </PermissionGuard>
 *
 * <PermissionGuard role={['admin', 'superadmin']} fallback={<p>No access</p>}>
 *   <AdminPanel />
 * </PermissionGuard>
 */
export function PermissionGuard({
  children,
  permission,
  role,
  fallback = null,
  requireAll = true,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasRole } = usePermission()

  // Check role first
  if (role) {
    if (!hasRole(role)) return <>{fallback}</>
  }

  // Check permissions
  if (permission) {
    const permissions = Array.isArray(permission) ? permission : [permission]

    if (requireAll) {
      if (!hasPermission(permissions)) return <>{fallback}</>
    } else {
      if (!hasAnyPermission(permissions)) return <>{fallback}</>
    }
  }

  return <>{children}</>
}
