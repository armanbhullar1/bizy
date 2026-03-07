'use client'

import Link from 'next/link'
import { LanguageSelector, useTranslation } from '@/components/translation'

interface LandingNavProps {
  isLoggedIn: boolean
}

export function LandingNav({ isLoggedIn }: LandingNavProps) {
  const { t } = useTranslation()
  
  return (
    <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
      <span className="text-2xl font-heading font-bold tracking-tight">
        Bizy
      </span>
      <div className="flex items-center gap-4">
        <LanguageSelector variant="compact" theme="dark" />
        {isLoggedIn ? (
          <Link
            href="/api/auth/logout"
            className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors font-medium"
          >
            {t('Logout')}
          </Link>
        ) : null}
        <Link
          href={isLoggedIn ? "/dashboard" : "/api/auth/login?returnTo=/onboarding"}
          className="px-5 py-2.5 rounded-lg bg-[var(--brand-accent)] hover:opacity-90 transition-opacity font-medium"
        >
          {isLoggedIn ? t("Go to Dashboard") : t("Get Started")}
        </Link>
      </div>
    </nav>
  )
}
