'use client'

import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store'
import { removeToast } from '@/store/ui.slice'
import { cn } from '@/lib/utils'

const TOAST_DURATION = 5000

export function Toaster() {
  const dispatch = useAppDispatch()
  const toasts = useAppSelector(state => state.ui.toasts)

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm"
    >
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onDismiss={() => dispatch(removeToast(toast.id))}
        />
      ))}
    </div>
  )
}

interface ToastItemProps {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
  onDismiss: () => void
}

function ToastItem({ title, description, variant = 'default', onDismiss }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, TOAST_DURATION)
    return () => clearTimeout(timer)
  }, [onDismiss])

  const icons = {
    default: <Info className="h-4 w-4 text-foreground" />,
    destructive: <AlertCircle className="h-4 w-4 text-destructive" />,
    success: <CheckCircle className="h-4 w-4 text-success" />,
  }

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-lg border bg-background p-4 shadow-lg',
        'animate-fade-in',
        variant === 'destructive' && 'border-destructive/50',
        variant === 'success' && 'border-success/50'
      )}
    >
      {icons[variant]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="ml-auto shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
