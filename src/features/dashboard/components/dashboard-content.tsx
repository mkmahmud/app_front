'use client'

import { Users, DollarSign, Activity, TrendingUp, RefreshCw } from 'lucide-react'
import { StatCard } from './stat-card'
import { useDashboardStats, useRecentActivity } from '../hooks/useDashboard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/index'
import { formatCurrency, formatNumber, timeAgo } from '@/lib/utils'

export function DashboardContent() {
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    refetch: refetchStats,
  } = useDashboardStats()

  const {
    data: activity,
    isLoading: activityLoading,
  } = useRecentActivity(8)

  if (statsError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <p className="text-muted-foreground">Failed to load dashboard data.</p>
        <Button variant="outline" onClick={() => refetchStats()} size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats ? formatNumber(stats.totalUsers) : '—'}
          change={12}
          icon={Users}
          isLoading={statsLoading}
        />
        <StatCard
          title="Active Users"
          value={stats ? formatNumber(stats.activeUsers) : '—'}
          change={8.2}
          icon={Activity}
          isLoading={statsLoading}
        />
        <StatCard
          title="Revenue"
          value={stats ? formatCurrency(stats.revenue) : '—'}
          change={23.1}
          icon={DollarSign}
          isLoading={statsLoading}
        />
        <StatCard
          title="Growth"
          value={stats ? `${stats.growth}%` : '—'}
          change={-2.4}
          icon={TrendingUp}
          isLoading={statsLoading}
        />
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="font-semibold text-sm">Recent Activity</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Latest actions across your platform</p>
          </div>
        </div>
        <div className="divide-y divide-border">
          {activityLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-3 w-16" />
                </div>
              ))
            : activity?.length === 0
            ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </div>
              )
            : activity?.map(item => (
                <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {item.user.name[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{item.user.name}</span>{' '}
                      <span className="text-muted-foreground">{item.action}</span>
                      {item.target && (
                        <span className="font-medium"> {item.target}</span>
                      )}
                    </p>
                  </div>
                  <time
                    dateTime={item.timestamp}
                    className="text-xs text-muted-foreground shrink-0"
                  >
                    {timeAgo(item.timestamp)}
                  </time>
                </div>
              ))}
        </div>
      </div>
    </div>
  )
}
