'use client'

import Link from 'next/link'
import Image from 'next/image'
import { LanguageSelector } from '@/components/translation'
import { useTranslation } from '@/context/TranslationContext'

interface LandingNavProps {
  isLoggedIn: boolean
}

export function LandingNav({ isLoggedIn }: LandingNavProps) {
  const { t } = useTranslation()

  return (
    <div className="absolute top-0 inset-x-0 z-50 py-6">
      <nav className="flex items-center justify-between lg:grid lg:grid-cols-3 px-6 lg:px-10 max-w-screen-2xl mx-auto">
        {/* Left: Links */}
        <div className="hidden lg:flex items-center gap-8 justify-start">
          <Link href="#features" className="text-[15px] font-medium text-white/80 hover:text-white transition-colors tracking-wide">
            {t('nav.features')}
          </Link>
          <Link href="#how-it-works" className="text-[15px] font-medium text-white/80 hover:text-white transition-colors tracking-wide">
            {t('nav.howItWorks')}
          </Link>
          <Link href="#use-cases" className="text-[15px] font-medium text-white/80 hover:text-white transition-colors tracking-wide">
            {t('nav.useCases')}
          </Link>
          <Link href="#pricing" className="text-[15px] font-medium text-white/80 hover:text-white transition-colors tracking-wide">
            {t('nav.pricing')}
          </Link>
        </div>

        {/* Center: Logo */}
        <div className="flex items-center justify-start lg:justify-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 relative">
               <Image src="/bizy-logo.png" alt="Bizy Logo" fill className="object-cover" />
            </div>
            <span className="text-2xl font-heading font-bold tracking-tight text-white group-hover:text-white/90 transition-colors">
              Bizy
            </span>
          </Link>
        </div>

        {/* Right: Auth */}
        <div className="flex items-center gap-6 justify-end">
          <div className="hidden lg:block">
            <LanguageSelector variant="compact" theme="dark" />
          </div>
          {isLoggedIn ? (
            <>
              <Link href="/api/auth/logout" className="hidden sm:block text-[15px] font-medium text-white/80 hover:text-white transition-colors">
                {t('nav.logout')}
              </Link>
              <Link href="/dashboard" className="px-6 py-2.5 rounded-full bg-white text-brand-primary hover:bg-gray-100 transition-colors font-medium text-[15px]">
                {t('nav.dashboard')}
              </Link>
            </>
          ) : (
            <>
              <Link href="/api/auth/login?returnTo=/onboarding" className="hidden sm:block text-[15px] font-medium text-white/80 hover:text-white transition-colors">
                {t('nav.login')}
              </Link>
              <Link href="/api/auth/login?returnTo=/onboarding" className="px-6 py-2.5 rounded-full bg-white text-brand-primary hover:bg-gray-100 transition-colors font-medium text-[15px]">
                {t('nav.signup')}
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  )
}
