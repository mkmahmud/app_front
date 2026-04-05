import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'

import { Analytics } from '@/components/shared/analytics'
import BottomNav from '@/components/shared/BottomNav'
import { ErrorBoundary } from '@/components/shared/error-boundary'
import LeftSidebar from '@/components/shared/LeftSidebar'
import Navbar from '@/components/shared/Navbar'
import { NetworkStatus } from '@/components/shared/network-status'
import { QueryProvider } from '@/components/shared/query-provider'
import { ReduxProvider } from '@/components/shared/redux-provider'
import { ThemeProvider } from '@/components/shared/theme-provider'
import { Toaster } from '@/components/ui/toaster'

import './globals.css'
import RightSidebar from '@/components/shared/RightSidebar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'SaaS App',
    template: '%s | SaaS App',
  },
  description: 'Production-ready SaaS application built with Next.js',
  keywords: ['saas', 'nextjs', 'react', 'typescript'],
  authors: [{ name: 'SaaS App Team' }],
  creator: 'SaaS App',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'SaaS App',
    description: 'Production-ready SaaS application built with Next.js',
    siteName: 'SaaS App',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaaS App',
    description: 'Production-ready SaaS application built with Next.js',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ReduxProvider>
              <QueryProvider>
                <Suspense fallback={null}>
                  <Navbar />
                  <div className="container mx-auto px-4 pt-[70px]">
                    <div className="relative flex gap-0">
                      {/* Left Sidebar */}
                      <div className="hidden w-[25%] pr-0 lg:block xl:w-[25%] ">
                        <LeftSidebar />
                      </div>

                      {/* Middle Feed */}
                      <div className="mt-2 h-[calc(100vh-75px)] w-full overflow-auto px-0 md:px-4 lg:w-[50%] lg:px-6 xl:w-[50%] [&::-webkit-scrollbar]:hidden">
                        <div className="pb-[10px] pt-[10px]">{children}</div>
                      </div>

                      {/* Right Sidebar */}
                      <div className="hidden w-[25%] pl-0 lg:block xl:w-[25%]">
                        <RightSidebar />
                      </div>
                    </div>
                  </div>
                  <BottomNav />
                </Suspense>

                <Toaster />
                <NetworkStatus />

                <Suspense fallback={null}>
                  <Analytics />
                </Suspense>
              </QueryProvider>
            </ReduxProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
