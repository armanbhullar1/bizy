'use client'

import { Compass, Lightbulb, ShieldCheck, Store, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/context/TranslationContext'
import type { TranslationKey } from '@/lib/i18n'

export function FeatureOverview() {
  const { t } = useTranslation()

  const features: Array<{
    titleKey: TranslationKey
    descriptionKey: TranslationKey
    icon: React.ReactNode
    color: string
  }> = [
    {
      titleKey: 'features.viability.title',
      descriptionKey: 'features.viability.description',
      icon: <Lightbulb className="w-8 h-8 text-brand-accent" />,
      color: "bg-brand-accent/10 border-brand-accent/20"
    },
    {
      titleKey: 'features.roadmap.title',
      descriptionKey: 'features.roadmap.description',
      icon: <Compass className="w-8 h-8 text-brand-accent" />,
      color: "bg-brand-accent/10 border-brand-accent/20"
    },
    {
      titleKey: 'features.compliance.title',
      descriptionKey: 'features.compliance.description',
      icon: <ShieldCheck className="w-8 h-8 text-brand-accent" />,
      color: "bg-brand-accent/10 border-brand-accent/20"
    },
    {
      titleKey: 'features.storefront.title',
      descriptionKey: 'features.storefront.description',
      icon: <Store className="w-8 h-8 text-brand-accent" />,
      color: "bg-brand-accent/10 border-brand-accent/20"
    }
  ]

  return (
    <section id="product-demo" className="py-24 bg-brand-primary relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            {t('features.headline')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-brand-accent">{t('features.headlineHighlight')}</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('features.subheadline')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <div 
              key={i}
              className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 overflow-hidden"
            >
              {/* Hover gradient glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className={`inline-flex items-center justify-center p-3 rounded-xl mb-6 ${feature.color}`}>
                {feature.icon}
              </div>
              
              <h3 className="text-2xl font-heading font-bold text-white mb-3">
                {t(feature.titleKey)}
              </h3>
              
              <p className="text-gray-400 leading-relaxed">
                {t(feature.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
