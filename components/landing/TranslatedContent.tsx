'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileCheck, Map, Store, Zap } from 'lucide-react'
import { useTranslation } from '@/components/translation'

interface TranslatedLandingContentProps {
  isLoggedIn: boolean
}

export function TranslatedHero({ isLoggedIn }: TranslatedLandingContentProps) {
  const { t } = useTranslation()
  
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
      <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6">
        {t('Your first Canadian')}
        <br />
        <span className="text-[var(--brand-highlight)]">{t('co-founder')}</span>
      </h1>
      <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10">
        {t('Launch your business in Canada with confidence. We guide you through viability, compliance, and launch—every step of the way.')}
      </p>
      <Link
        href={isLoggedIn ? "/onboarding" : "/api/auth/login?returnTo=/onboarding"}
        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--brand-accent)] hover:opacity-90 transition-opacity font-semibold text-lg"
      >
        {isLoggedIn ? t("Continue setup") : t("Start your journey")}
        <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  )
}

export function TranslatedSteps() {
  const { t } = useTranslation()
  
  const steps = [
    {
      step: '01',
      icon: Zap,
      title: t('Viability Scan'),
      desc: t('Validate your business idea with AI-powered market analysis.'),
    },
    {
      step: '02',
      icon: Map,
      title: t('Launch Roadmap'),
      desc: t('Get a personalized checklist to launch in Canada.'),
    },
    {
      step: '03',
      icon: FileCheck,
      title: t('Compliance Hub'),
      desc: t('CRA, licenses, HR—navigate regulations with ease.'),
    },
    {
      step: '04',
      icon: Store,
      title: t('Storefront Builder'),
      desc: t('Create your online presence and start selling.'),
    },
  ]

  return (
    <section className="relative py-24 bg-[var(--brand-secondary)]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4">
          {t('From idea to launch in four steps')}
        </h2>
        <p className="text-gray-400 text-center max-w-xl mx-auto mb-16">
          {t('A clear path designed for Canadian entrepreneurs')}
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map(({ step, icon: Icon, title, desc }) => (
            <div
              key={step}
              className="relative p-6 rounded-2xl bg-[var(--brand-primary)]/60 border border-white/10 hover:border-[var(--brand-accent)]/50 transition-colors"
            >
              <span className="text-sm font-mono text-[var(--brand-highlight)]">
                {step}
              </span>
              <div className="mt-4 p-3 w-fit rounded-xl bg-[var(--brand-accent)]/20">
                <Icon className="w-6 h-6 text-[var(--brand-accent)]" />
              </div>
              <h3 className="text-xl font-heading font-semibold mt-4 mb-2">
                {title}
              </h3>
              <p className="text-gray-400 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
