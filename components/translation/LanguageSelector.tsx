'use client'

import { useTranslation, SUPPORTED_LANGUAGES, type LanguageCode } from '@/context/TranslationContext'

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'compact'
  theme?: 'light' | 'dark'
  className?: string
}

export function LanguageSelector({ variant = 'dropdown', theme = 'light', className = '' }: LanguageSelectorProps) {
  const { currentLanguage, setLanguage } = useTranslation()
  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0]
  const isDark = theme === 'dark'

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as LanguageCode
    console.log('Language changed to:', newLang)
    setLanguage(newLang)
  }

  // Compact variant for nav bars
  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <div className={`
          flex items-center gap-1.5 px-2.5 py-2 rounded-md text-sm pointer-events-none
          ${isDark 
            ? 'bg-white/10 border border-white/20' 
            : 'bg-white border border-gray-200'}
        `}>
          <span className="text-base">{currentLang.flag}</span>
          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>
            {currentLang.code.toUpperCase()}
          </span>
          <svg
            className={`w-3 h-3 ${isDark ? 'text-white/60' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <select
          value={currentLanguage}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Select language"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>
    )
  }

  // Full dropdown variant
  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-white border border-gray-200 min-w-[180px] pointer-events-none">
        <span className="text-xl">{currentLang.flag}</span>
        <div className="flex-1 text-left">
          <div className="font-medium text-gray-800">{currentLang.name}</div>
          <div className="text-xs text-gray-500">{currentLang.nativeName}</div>
        </div>
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <select
        value={currentLanguage}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Select language"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name} ({lang.nativeName})
          </option>
        ))}
      </select>
    </div>
  )
}

export { SUPPORTED_LANGUAGES } from '@/context/TranslationContext'
