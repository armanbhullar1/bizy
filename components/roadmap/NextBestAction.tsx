'use client'

import { useRef } from 'react'
import { Target, ChevronRight } from 'lucide-react'
import type { RoadmapStep } from '@/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NextBestActionProps {
  steps: RoadmapStep[]
  progress: Record<string, boolean>
  onScrollToStep: (stepId: string) => void
}

function getCompletedIds(progress: Record<string, boolean>, steps: RoadmapStep[]): string[] {
  return steps.filter((s) => progress[s.id] ?? s.isComplete).map((s) => s.id)
}

function isStepLocked(step: RoadmapStep, completedIds: string[]): boolean {
  const deps = step.dependencies ?? step.dependsOn ?? []
  if (deps.length === 0) return false
  return deps.some((depId) => !completedIds.includes(depId))
}

export function NextBestAction({
  steps,
  progress,
  onScrollToStep,
}: NextBestActionProps) {
  const completedIds = getCompletedIds(progress, steps)
  const nextStep = steps.find((s) => {
    if (progress[s.id] ?? s.isComplete) return false
    return !isStepLocked(s, completedIds)
  })

  if (!nextStep || steps.length === 0) return null

  return (
    <div className="rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-accent/20">
            <Target className="h-5 w-5 text-brand-accent" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">
              Next recommended step
            </p>
            <h3 className="font-heading text-lg font-semibold text-brand-primary mt-0.5">
              {nextStep.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{nextStep.description}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
              <span>Estimated time: {nextStep.estimatedTime}</span>
              {nextStep.priority && (
                <span className="capitalize">Priority: {nextStep.priority}</span>
              )}
            </div>
          </div>
        </div>
        <Button
          onClick={() => onScrollToStep(nextStep.id)}
          className="gap-2 shrink-0"
        >
          Start step
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
