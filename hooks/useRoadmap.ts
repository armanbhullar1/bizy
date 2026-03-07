import { useState, useEffect } from 'react'
import type { BusinessProfile, RoadmapStep, ViabilityResult } from '@/types'
import { loadRoadmap, saveRoadmap } from '@/lib/storage'

export interface RoadmapState {
  steps: RoadmapStep[]
}

export function useRoadmap() {
  const [roadmap, setRoadmap] = useState<RoadmapState | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cached = loadRoadmap()
    if (cached?.steps?.length) {
      setRoadmap({ steps: cached.steps })
    }
  }, [])

  async function generateRoadmap(
    profile: BusinessProfile,
    viabilityResult?: ViabilityResult | null
  ) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, viabilityResult }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || res.statusText || 'Failed to generate roadmap')
      }
      const data = await res.json()
      const state: RoadmapState = { steps: data.steps ?? [] }
      setRoadmap(state)
      saveRoadmap(state.steps)
      return state
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate roadmap'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { roadmap, loading, error, generateRoadmap }
}
