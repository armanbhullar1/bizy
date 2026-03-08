'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useTranslation } from '@/context/TranslationContext'

export function CTASection({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { t } = useTranslation()

  return (
    <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12">
          
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl lg:text-5xl font-heading font-medium text-white tracking-tight leading-tight max-w-xl">
              Ready to see Bizy in <br className="hidden md:block" />
              Action?
            </h2>
          </div>

          <div className="flex-1 max-w-md flex flex-col items-start pt-2">
            <p className="text-lg text-gray-200 mb-8 leading-relaxed font-medium">
              Designed for founders who need intelligent guidance, consistency, and measurable impact across their launch journey.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href={isLoggedIn ? "/dashboard" : "/api/auth/login?returnTo=/dashboard"}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-black font-semibold text-base hover:bg-gray-200 transition-colors"
              >
                Start Demo
              </Link>
              <Link
                href="/api/auth/login?returnTo=/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-transparent text-white border border-white/20 font-semibold text-base hover:bg-white/5 transition-colors"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
