'use client'

import { useState } from 'react'
import { MessageCircle, Loader2, Sparkles } from 'lucide-react'
import type { RoadmapStep } from '@/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface RoadmapAdvisorProps {
  steps: RoadmapStep[]
  completedStepIds: string[]
}

export function RoadmapAdvisor({ steps, completedStepIds }: RoadmapAdvisorProps) {
  const [loading, setLoading] = useState(false)
  const [advice, setAdvice] = useState<string | null>(null)

  async function handleAsk() {
    setLoading(true)
    setAdvice(null)
    try {
      const stepsSummary = steps.map((s) => `${s.title}: ${s.description}`).join('\n')
      const completed = steps
        .filter((s) => completedStepIds.includes(s.id))
        .map((s) => s.title)
        .join(', ')

      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user' as const,
              content: `Based on this roadmap and completed steps, what should the founder focus on next?

Roadmap steps:
${stepsSummary}

Completed: ${completed || 'None yet'}

What should the founder focus on next? Give concise, actionable guidance (2-4 bullet points).`,
            },
          ],
          systemPrompt:
            'You are a Canadian startup advisor. Give clear, concise next-step advice.',
          model: 'gemini-2.5-flash',
        }),
      })
      if (!res.ok) throw new Error('Failed to get advice')
      const data = await res.json()
      setAdvice(data.response ?? '')
    } catch (err) {
      setAdvice(err instanceof Error ? err.message : 'Could not load advice.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 font-heading text-lg font-semibold text-brand-primary">
        <MessageCircle className="h-5 w-5" />
        AI Launch Advisor
      </div>
      <p className="mt-1 text-sm text-gray-600">
        Get personalized guidance on what to do next.
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={handleAsk}
        disabled={loading || steps.length === 0}
        className="mt-4 gap-2"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        What should I do next?
      </Button>
      {advice !== null && (
        <div className="mt-4 rounded-lg border border-brand-primary/20 bg-brand-primary/5 p-4">
          <p className="text-sm font-medium text-brand-primary mb-1">Advisor</p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{advice}</p>
        </div>
      )}
    </div>
  )
}
