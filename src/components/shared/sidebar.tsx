'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Settings, BarChart3,
  ChevronLeft, LogOut, Zap,
  BookDashed
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store'
import { toggleSidebar } from '@/store/ui.slice'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { PermissionGuard } from '@/components/shared/permission-guard'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/config/constants'
import type { NavItem } from '@/types/api'

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    permissions: ['analytics:view'],
  },
  {
    label: 'Users',
    href: ROUTES.USERS,
    icon: Users,
    permissions: ['user:read'],
  },
  {
    label: 'Settings',
    href: ROUTES.SETTINGS,
    icon: Settings,
  },
]

export function Sidebar() {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(state => state.ui.sidebarOpen)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => dispatch(toggleSidebar())}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card',
          'transition-all duration-300 ease-in-out',
          'md:relative md:z-auto',
          isOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full md:translate-x-0'
        )}
        aria-label="Sidebar navigation"
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-3 border-b border-border px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <BookDashed className="h-4 w-4 text-primary-foreground" />
          </div>
          {isOpen && (
            <span className="font-semibold text-sm tracking-tight truncate">
              SaaS Dash 
            </span>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            className={cn('ml-auto', !isOpen && 'hidden md:flex')}
            onClick={() => dispatch(toggleSidebar())}
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <ChevronLeft
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                !isOpen && 'rotate-180'
              )}
            />
          </Button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto" aria-label="Main navigation">
          {navItems.map(item => {
            const content = (
              <NavLink
                key={item.href}
                item={item}
                isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                isCollapsed={!isOpen}
              />
            )

            if (item.permissions) {
              return (
                <PermissionGuard key={item.href} permission={item.permissions as any}>
                  {content}
                </PermissionGuard>
              )
            }

            return content
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-border p-2">
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2',
              !isOpen && 'justify-center'
            )}
          >
            {/* Avatar */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            )}
            {isOpen && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={logout}
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

interface NavLinkProps {
  item: NavItem
  isActive: boolean
  isCollapsed: boolean
}

function NavLink({ item, isActive, isCollapsed }: NavLinkProps) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
        'hover:bg-accent hover:text-accent-foreground',
        isActive
          ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
          : 'text-muted-foreground',
        isCollapsed && 'justify-center px-2'
      )}
      aria-current={isActive ? 'page' : undefined}
      title={isCollapsed ? item.label : undefined}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      {!isCollapsed && <span className="truncate">{item.label}</span>}
      {!isCollapsed && item.badge !== undefined && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/20 px-1 text-xs">
          {item.badge}
        </span>
      )}
    </Link>
  )
}
