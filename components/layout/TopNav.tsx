'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LanguageSelector } from '@/components/translation'

interface TopNavProps {
  onMenuClick?: () => void
  className?: string
}

export function TopNav({ onMenuClick, className }: TopNavProps) {
  const { user, isLoading } = useUser()

  return (
    <header
      className={cn(
        'flex h-14 items-center justify-between border-b border-white/10 bg-brand-primary px-4 md:px-6',
        className
      )}
    >
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-10 w-10 items-center justify-center text-white md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex flex-1 items-center justify-end gap-4">
        <LanguageSelector variant="compact" />
        {isLoading ? (
          <div className="h-8 w-8 animate-pulse rounded-full bg-white/20" />
        ) : user ? (
          <>
            <div className="hidden items-center gap-3 sm:flex">
              <span className="text-sm text-white/90">{user.name}</span>
              {user.picture && (
                <Image
                  src={user.picture}
                  alt={user.name ?? 'User avatar'}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
            </div>
            <Link
              href="/api/auth/logout"
              className="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20"
            >
              Logout
            </Link>
          </>
        ) : (
          <Link
            href="/api/auth/login"
            className="rounded-lg bg-brand-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  )
}
