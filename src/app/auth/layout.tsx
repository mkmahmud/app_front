import type { Metadata } from 'next'
import { Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: {
    default: 'Authentication',
    template: '%s | SaaS App',
  },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">


      {/* Content */}
      <main className="flex flex-1 items-center justify-center p-6">
        {children}
      </main>

    </div>
  )
}
