'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { FEATURE_FLAGS } from '@/config/constants'

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!FEATURE_FLAGS.ANALYTICS) return

    const url = pathname + searchParams.toString()

    // PostHog page view
    if (typeof window !== 'undefined' && (window as any).posthog) {
      ;(window as any).posthog.capture('$pageview', { $current_url: url })
    } 

    // Google Analytics (gtag)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: url,
      })
    }
  }, [pathname, searchParams])

  return null
}
