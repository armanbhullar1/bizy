'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useTranslation } from '@/context/TranslationContext'

export function CTASection({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { t } = useTranslation()

  return (
    <section className="py-32 bg-brand-primary relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--brand-accent)_0%,_transparent_70%)] opacity-20" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/20 border border-brand-accent/30 text-brand-accent text-sm font-semibold mb-8">
          <Sparkles className="w-4 h-4" />
          {t('cta.tagline')}
        </div>

        <h2 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-8 tracking-tight leading-tight">
          {t('cta.headline1')} <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
            {t('cta.headline2')}
          </span>
        </h2>

        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
          {t('cta.subheadline')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href={isLoggedIn ? "/dashboard" : "/api/auth/login?returnTo=/dashboard"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-brand-accent text-white font-bold text-lg hover:bg-brand-accent/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(233,69,96,0.4)]"
          >
            {isLoggedIn ? t('cta.button.dashboard') : t('cta.button.start')}
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/api/auth/login?returnTo=/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-white/5 text-white border border-white/10 font-bold text-lg hover:bg-white/10 transition-colors"
          >
            {t('cta.button.tryFree')}
          </Link>
        </div>
      </div>
    </section>
  )
}
