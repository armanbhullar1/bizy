'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import { getStaticTranslation } from '@/lib/data/translations'

// Supported languages with their native names and flags
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇹🇼' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'tl', name: 'Tagalog', nativeName: 'Tagalog', flag: '🇵🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
] as const

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code']

interface TranslationCache {
  [key: string]: string // key format: "text::targetLang"
}

interface TranslationContextValue {
  currentLanguage: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  translate: (text: string) => Promise<string>
  translateBatch: (texts: string[]) => Promise<string[]>
  isTranslating: boolean
  t: (text: string) => string // Synchronous, returns cached or original
  getCachedTranslation: (text: string) => string | null
}

const TranslationContext = createContext<TranslationContextValue | undefined>(undefined)

const STORAGE_KEY = 'bizy_language'
const CACHE_STORAGE_KEY = 'bizy_translation_cache'

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en')
  const [cache, setCache] = useState<TranslationCache>({})
  const [isTranslating, setIsTranslating] = useState(false)

  // Load saved language and cache on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const savedLang = localStorage.getItem(STORAGE_KEY) as LanguageCode
    if (savedLang && SUPPORTED_LANGUAGES.some((l) => l.code === savedLang)) {
      setCurrentLanguage(savedLang)
    }

    const savedCache = localStorage.getItem(CACHE_STORAGE_KEY)
    if (savedCache) {
      try {
        setCache(JSON.parse(savedCache))
      } catch {
        // Invalid cache, ignore
      }
    }
  }, [])

  // Save language preference
  const setLanguage = useCallback((lang: LanguageCode) => {
    setCurrentLanguage(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang)
    }
  }, [])

  // Save cache periodically
  useEffect(() => {
    if (typeof window === 'undefined') return
    const cacheString = JSON.stringify(cache)
    // Only save if cache has changed and isn't too large (< 5MB)
    if (cacheString.length < 5 * 1024 * 1024) {
      localStorage.setItem(CACHE_STORAGE_KEY, cacheString)
    }
  }, [cache])

  // Get cache key
  const getCacheKey = useCallback(
    (text: string, lang: LanguageCode = currentLanguage) => `${text}::${lang}`,
    [currentLanguage]
  )

  // Get cached translation
  const getCachedTranslation = useCallback(
    (text: string): string | null => {
      if (currentLanguage === 'en') return text
      const key = getCacheKey(text)
      // Check cache first, then static translations
      return cache[key] || getStaticTranslation(text, currentLanguage) || null
    },
    [cache, currentLanguage, getCacheKey]
  )

  // Synchronous translation (returns cached, static, or original)
  const t = useCallback(
    (text: string): string => {
      if (currentLanguage === 'en') return text
      // Try cache first, then static translations, then return original
      const cached = getCachedTranslation(text)
      if (cached) return cached
      const staticTrans = getStaticTranslation(text, currentLanguage)
      if (staticTrans) return staticTrans
      return text
    },
    [currentLanguage, getCachedTranslation]
  )

  // Async translation with API call
  const translate = useCallback(
    async (text: string): Promise<string> => {
      if (currentLanguage === 'en') return text
      if (!text.trim()) return text

      // Check cache first
      const cached = getCachedTranslation(text)
      if (cached) return cached

      setIsTranslating(true)
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            targetLanguage: currentLanguage,
          }),
        })

        if (!response.ok) {
          console.error('Translation failed')
          return text
        }

        const data = await response.json()
        const translated = data.translatedText || text

        // Cache the result
        setCache((prev) => ({
          ...prev,
          [getCacheKey(text)]: translated,
        }))

        return translated
      } catch (error) {
        console.error('Translation error:', error)
        return text
      } finally {
        setIsTranslating(false)
      }
    },
    [currentLanguage, getCachedTranslation, getCacheKey]
  )

  // Batch translation for efficiency
  const translateBatch = useCallback(
    async (texts: string[]): Promise<string[]> => {
      if (currentLanguage === 'en') return texts

      // Filter out already cached texts
      const uncachedTexts: string[] = []
      const results: (string | null)[] = texts.map((text) => {
        const cached = getCachedTranslation(text)
        if (cached) return cached
        uncachedTexts.push(text)
        return null
      })

      if (uncachedTexts.length === 0) {
        return results as string[]
      }

      setIsTranslating(true)
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            texts: uncachedTexts,
            targetLanguage: currentLanguage,
          }),
        })

        if (!response.ok) {
          return texts
        }

        const data = await response.json()
        const translations: string[] = data.translations || uncachedTexts

        // Cache all translations
        const newCache: TranslationCache = {}
        uncachedTexts.forEach((text, i) => {
          newCache[getCacheKey(text)] = translations[i]
        })
        setCache((prev) => ({ ...prev, ...newCache }))

        // Fill in the results
        let uncachedIndex = 0
        return results.map((result, i) => {
          if (result !== null) return result
          return translations[uncachedIndex++] || texts[i]
        })
      } catch (error) {
        console.error('Batch translation error:', error)
        return texts
      } finally {
        setIsTranslating(false)
      }
    },
    [currentLanguage, getCachedTranslation, getCacheKey]
  )

  return (
    <TranslationContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        translate,
        translateBatch,
        isTranslating,
        t,
        getCachedTranslation,
      }}
    >
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}

// Helper to get language info
export function getLanguageInfo(code: LanguageCode) {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code)
}
