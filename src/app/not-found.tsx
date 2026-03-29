import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/config/constants'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center p-6">
      <div className="space-y-2">
        <p className="text-8xl font-bold tracking-tighter text-muted-foreground/30">404</p>
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Button asChild>
        <Link href={ROUTES.DASHBOARD}>Go to Dashboard</Link>
      </Button>
    </div>
  )
}
