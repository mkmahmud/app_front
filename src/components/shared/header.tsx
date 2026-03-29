'use client'

import { Menu, Moon, Sun, Bell } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAppDispatch } from '@/store'
import { toggleSidebar } from '@/store/ui.slice'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Header() {
  const dispatch = useAppDispatch()
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-card px-4 md:px-6">
      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => dispatch(toggleSidebar())}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Skip to content */}
      <Link
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow-md text-white"
      >
        Skip to content
      </Link>

      <div className="flex flex-1 items-center justify-end gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
    </header>
  )
}
