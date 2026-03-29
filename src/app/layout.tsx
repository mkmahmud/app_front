import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/shared/theme-provider'
import { QueryProvider } from '@/components/shared/query-provider'
import { ReduxProvider } from '@/components/shared/redux-provider'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/shared/error-boundary'
import { NetworkStatus } from '@/components/shared/network-status'
import { Analytics } from '@/components/shared/analytics'
import './globals.css'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ReduxProvider>
              <QueryProvider>
                {children}
                <Toaster />
                <NetworkStatus />
                <Analytics />
              </QueryProvider>
            </ReduxProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
