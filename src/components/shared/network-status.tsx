'use client'

import { useEffect, useState } from 'react'
import { WifiOff, Wifi } from 'lucide-react'
import { useNetworkStatus } from '@/hooks'
import { cn } from '@/lib/utils'

export function NetworkStatus() {
  const { isOnline } = useNetworkStatus()
  const [showOnline, setShowOnline] = useState(false)
  const [wasOffline, setWasOffline] = useState(false)

  // 1. ADD THIS: Track if we are running on the client
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // 2. Set mounted to true once the browser takes over
    setIsMounted(true)

    if (!isOnline) {
      setWasOffline(true)
    } else if (wasOffline && isOnline) {
      setShowOnline(true)
      const timer = setTimeout(() => {
        setShowOnline(false)
        setWasOffline(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, wasOffline])

  // 3. IMPORTANT: If not mounted, return null to match the server's initial render
  if (!isMounted) return null

  // Existing logic for hiding when online and stable
  if (isOnline && !showOnline) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed bottom-4 left-1/2 z-50 -translate-x-1/2',
        'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-lg',
        'transition-all duration-300 animate-fade-in',
        isOnline
          ? 'bg-success text-success-foreground'
          : 'bg-destructive text-destructive-foreground'
      )}
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4" />
          You&apos;re back online
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          You&apos;re offline — changes may not be saved
        </>
      )}
    </div>
  )
}