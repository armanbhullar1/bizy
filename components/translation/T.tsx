'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { useTranslation } from '@/context/TranslationContext'

interface TProps {
  children: string
  as?: keyof JSX.IntrinsicElements
  className?: string
}

/**
 * Translation component that automatically translates text content.
 * Uses Google Translate API with caching for efficiency.
 * 
 * Usage:
 * <T>Hello, welcome to Bizy!</T>
 * <T as="h1" className="text-xl">Page Title</T>
 */
export function T({ children, as: Component = 'span', className }: TProps) {
  const { currentLanguage, translate, t } = useTranslation()
  const [translatedText, setTranslatedText] = useState(children)

  useEffect(() => {
    // If English, use original
    if (currentLanguage === 'en') {
      setTranslatedText(children)
      return
    }

    // Check if already cached (synchronous)
    const cached = t(children)
    if (cached !== children) {
      setTranslatedText(cached)
      return
    }

    // Fetch translation
    let isMounted = true
    translate(children).then((result) => {
      if (isMounted) {
        setTranslatedText(result)
      }
    })

    return () => {
      isMounted = false
    }
  }, [children, currentLanguage, translate, t])

  return <Component className={className}>{translatedText}</Component>
}

/**
 * Hook for translating text in components.
 * Returns a function that handles async translation with loading state.
 * 
 * Usage:
 * const { text, isLoading } = useText('Hello World')
 */
export function useText(originalText: string) {
  const { currentLanguage, translate, t } = useTranslation()
  const [text, setText] = useState(originalText)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (currentLanguage === 'en') {
      setText(originalText)
      return
    }

    // Check cache first
    const cached = t(originalText)
    if (cached !== originalText) {
      setText(cached)
      return
    }

    // Fetch translation
    setIsLoading(true)
    let isMounted = true

    translate(originalText)
      .then((result) => {
        if (isMounted) {
          setText(result)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [originalText, currentLanguage, translate, t])

  return { text, isLoading }
}

/**
 * Hook for translating multiple texts at once (batch).
 * More efficient than multiple individual translations.
 * 
 * Usage:
 * const { texts, isLoading } = useTexts(['Hello', 'World', 'Goodbye'])
 */
export function useTexts(originalTexts: string[]) {
  const { currentLanguage, translateBatch, t } = useTranslation()
  const [texts, setTexts] = useState(originalTexts)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (currentLanguage === 'en') {
      setTexts(originalTexts)
      return
    }

    // Check if all are cached
    const cachedTexts = originalTexts.map((text) => t(text))
    const allCached = cachedTexts.every((cached, i) => cached !== originalTexts[i])
    
    if (allCached) {
      setTexts(cachedTexts)
      return
    }

    // Fetch translations
    setIsLoading(true)
    let isMounted = true

    translateBatch(originalTexts)
      .then((result) => {
        if (isMounted) {
          setTexts(result)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [originalTexts.join('|'), currentLanguage, translateBatch, t])

  return { texts, isLoading }
}
