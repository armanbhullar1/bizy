import { NextRequest, NextResponse } from 'next/server'

/**
 * Google Cloud Translation API endpoint.
 * Handles both single text and batch translations.
 * 
 * Requires GOOGLE_TRANSLATE_API_KEY in environment variables.
 * Get your API key from: https://console.cloud.google.com/apis/credentials
 * Enable "Cloud Translation API" in your Google Cloud project.
 */

const GOOGLE_TRANSLATE_API = 'https://translation.googleapis.com/language/translate/v2'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { text, texts, targetLanguage } = body

    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY

    // If no API key, return original text (graceful degradation)
    if (!apiKey) {
      console.warn('GOOGLE_TRANSLATE_API_KEY not configured. Returning original text.')
      if (texts) {
        return NextResponse.json({ translations: texts })
      }
      return NextResponse.json({ translatedText: text })
    }

    // Validate inputs
    if (!targetLanguage) {
      return NextResponse.json(
        { error: 'targetLanguage is required' },
        { status: 400 }
      )
    }

    if (!text && !texts) {
      return NextResponse.json(
        { error: 'text or texts is required' },
        { status: 400 }
      )
    }

    // Handle batch translation
    if (texts && Array.isArray(texts)) {
      const translations = await translateBatch(texts, targetLanguage, apiKey)
      return NextResponse.json({ translations })
    }

    // Handle single text translation
    const translatedText = await translateSingle(text, targetLanguage, apiKey)
    return NextResponse.json({ translatedText })
  } catch (error) {
    console.error('Translation API error:', error)
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    )
  }
}

async function translateSingle(
  text: string,
  targetLanguage: string,
  apiKey: string
): Promise<string> {
  const response = await fetch(`${GOOGLE_TRANSLATE_API}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: text,
      target: targetLanguage,
      source: 'en',
      format: 'text',
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('Google Translate API error:', errorData)
    throw new Error('Translation API request failed')
  }

  const data = await response.json()
  return data.data?.translations?.[0]?.translatedText || text
}

async function translateBatch(
  texts: string[],
  targetLanguage: string,
  apiKey: string
): Promise<string[]> {
  // Google Translate API accepts multiple q parameters for batch
  const response = await fetch(`${GOOGLE_TRANSLATE_API}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: texts,
      target: targetLanguage,
      source: 'en',
      format: 'text',
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('Google Translate API error:', errorData)
    throw new Error('Translation API request failed')
  }

  const data = await response.json()
  const translations = data.data?.translations || []
  
  return texts.map((text, i) => translations[i]?.translatedText || text)
}

// Also support GET for simple translations (useful for testing)
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const text = searchParams.get('text')
  const target = searchParams.get('target') || 'fr'

  if (!text) {
    return NextResponse.json({ error: 'text parameter required' }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ translatedText: text, warning: 'API key not configured' })
  }

  try {
    const translatedText = await translateSingle(text, target, apiKey)
    return NextResponse.json({ translatedText, source: 'en', target })
  } catch (error) {
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 })
  }
}
