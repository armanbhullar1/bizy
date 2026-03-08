'use client'

import { Cpu, Sparkles, BarChart2, Shield, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/context/TranslationContext'

export function AIFeatures() {
  const { t } = useTranslation()

  const features = [
    { icon: <Cpu />, titleKey: 'aiFeatures.contextAware.title', descKey: 'aiFeatures.contextAware.desc' },
    { icon: <BarChart2 />, titleKey: 'aiFeatures.realTimeData.title', descKey: 'aiFeatures.realTimeData.desc' },
    { icon: <Shield />, titleKey: 'aiFeatures.automatedCompliance.title', descKey: 'aiFeatures.automatedCompliance.desc' }
  ]

  return (
    <section className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              {t('aiFeatures.badge')}
            </div>
            
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6 leading-tight">
              {t('aiFeatures.headline1')} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-brand-accent">
                {t('aiFeatures.headline2')}
              </span>
            </h2>
            
            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
              {t('aiFeatures.description')}
            </p>

            <div className="space-y-6">
              {features.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-brand-accent">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">{t(item.titleKey)}</h4>
                    <p className="text-gray-400">{t(item.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Chat Visualization */}
          <div className="flex-[0.8] w-full max-w-md relative">
            <div className="absolute inset-0 bg-brand-accent/20 blur-[100px] rounded-full" />
            <div className="bg-brand-primary border border-white/10 rounded-2xl p-6 shadow-2xl relative z-10">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-brand-accent flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold">{t('aiFeatures.chat.bizyAI')}</div>
                  <div className="text-xs text-green-400">{t('aiFeatures.chat.online')}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-2xl rounded-tl-sm p-4 text-sm text-gray-300 w-[85%] border border-white/5">
                  {t('aiFeatures.chat.message1')}
                </div>
                <div className="bg-brand-accent rounded-2xl rounded-tr-sm p-4 text-sm text-white w-[85%] ml-auto shadow-md">
                  {t('aiFeatures.chat.message2')}
                </div>
                <div className="bg-white/5 rounded-2xl rounded-tl-sm p-4 text-sm text-gray-300 w-[85%] border border-white/5">
                  {t('aiFeatures.chat.message3')}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="bg-white/5 rounded-full px-4 py-3 text-sm text-gray-500 border border-white/10 flex justify-between items-center">
                  <span>{t('aiFeatures.chat.placeholder')}</span>
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
