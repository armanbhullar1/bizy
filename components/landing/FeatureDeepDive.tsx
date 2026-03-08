'use client'

import { CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from '@/context/TranslationContext'

export function FeatureDeepDive() {
  const { t } = useTranslation()

  const features = [
    {
      titleKey: 'featureSpotlight.viability.title',
      subtitleKey: 'featureSpotlight.viability.subtitle',
      descriptionKey: 'featureSpotlight.viability.description',
      bulletKeys: [
        'featureSpotlight.viability.bullet1',
        'featureSpotlight.viability.bullet2',
        'featureSpotlight.viability.bullet3'
      ],
      imageKey: 'featureSpotlight.viability.image',
      reversed: false
    },
    {
      titleKey: 'featureSpotlight.roadmap.title',
      subtitleKey: 'featureSpotlight.roadmap.subtitle',
      descriptionKey: 'featureSpotlight.roadmap.description',
      bulletKeys: [
        'featureSpotlight.roadmap.bullet1',
        'featureSpotlight.roadmap.bullet2',
        'featureSpotlight.roadmap.bullet3'
      ],
      imageKey: 'featureSpotlight.roadmap.image',
      reversed: true
    }
  ]

  return (
    <section className="py-24 bg-brand-secondary border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="space-y-32">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`flex flex-col md:flex-row items-center gap-12 lg:gap-24 ${feature.reversed ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Text Side */}
              <div className="flex-1 space-y-6">
                <div className="inline-block px-3 py-1 rounded-full bg-brand-accent/20 border border-brand-accent/30 text-brand-accent text-sm font-semibold mb-2">
                  {t('featureSpotlight.badge')}
                </div>
                <h2 className="text-4xl lg:text-5xl font-heading font-bold text-white leading-tight">
                  {t(feature.titleKey)}
                </h2>
                <h3 className="text-2xl text-white/80 font-medium">
                  {t(feature.subtitleKey)}
                </h3>
                <p className="text-xl text-gray-400 leading-relaxed pb-4">
                  {t(feature.descriptionKey)}
                </p>
                <ul className="space-y-4">
                  {feature.bulletKeys.map((bulletKey, i) => (
                    <li key={i} className="flex items-start text-gray-300">
                      <CheckCircle2 className="w-6 h-6 text-brand-accent shrink-0 mr-3" />
                      <span className="text-lg">{t(bulletKey)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Image Side - UI Mockup Mock */}
              <div className="flex-1 w-full">
                <div className="aspect-square md:aspect-[4/3] rounded-2xl bg-gradient-to-tr from-brand-primary to-black border border-white/10 p-2 shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--brand-accent)_0%,_transparent_60%)] opacity-10 group-hover:opacity-20 transition-opacity" />

                  {/* Mock browser window */}
                  <div className="w-full h-full bg-brand-primary rounded-xl border border-white/5 overflow-hidden flex flex-col">
                    <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <div className="flex-1 relative overflow-hidden bg-black/50">
                      <Image
                        src={`/assets/${feature.imageKey.includes('viability') ? 'viability' : 'launch-roadmap'}.png`}
                        alt=""
                        fill
                        className="object-cover object-left-top"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
