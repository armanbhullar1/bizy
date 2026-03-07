/**
 * Storage utility for persisting user data.
 * Uses localStorage for now, can be swapped to Firebase/Supabase later.
 */

import type { BusinessProfile } from '@/types'
import type { RoadmapStep } from '@/types'

const STORAGE_KEYS = {
  BUSINESS_PROFILE: 'bizy_business_profile',
  USER_PREFERENCES: 'bizy_user_preferences',
  ROADMAP: 'bizy_roadmap',
} as const

// ─── Business Profile ────────────────────────────────────────────────────────

export function saveBusinessProfile(profile: BusinessProfile): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.BUSINESS_PROFILE, JSON.stringify(profile))
}

export function loadBusinessProfile(): BusinessProfile | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(STORAGE_KEYS.BUSINESS_PROFILE)
  if (!data) return null
  try {
    return JSON.parse(data) as BusinessProfile
  } catch {
    return null
  }
}

export function clearBusinessProfile(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEYS.BUSINESS_PROFILE)
}

// ─── Check if onboarding is complete ─────────────────────────────────────────

export function isOnboardingComplete(): boolean {
  const profile = loadBusinessProfile()
  return profile !== null && !!profile.businessName && !!profile.businessType
}

// ─── Roadmap cache ──────────────────────────────────────────────────────────

export function saveRoadmap(steps: RoadmapStep[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify({ steps }))
}

export function loadRoadmap(): { steps: RoadmapStep[] } | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(STORAGE_KEYS.ROADMAP)
  if (!data) return null
  try {
    const parsed = JSON.parse(data) as { steps: RoadmapStep[] }
    return Array.isArray(parsed?.steps) ? parsed : null
  } catch {
    return null
  }
}
