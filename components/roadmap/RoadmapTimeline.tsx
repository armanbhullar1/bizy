'use client'

import type { RoadmapStep } from '@/types'
import type { Grant } from '@/types'
import { RoadmapStepCard } from './RoadmapStep'
import { GrantCard } from '@/components/grants/GrantCard'
import { cn } from '@/lib/utils'

const CATEGORY_LABELS: Record<string, string> = {
  legal: 'Legal Setup',
  financial: 'Financial Setup',
  product: 'Product Development',
  licensing: 'Licensing',
  hr: 'HR',
  operations: 'Operations',
  marketing: 'Marketing',
}

const CATEGORY_LINE_COLORS: Record<string, string> = {
  legal: 'bg-blue-500',
  financial: 'bg-green-500',
  product: 'bg-purple-500',
  licensing: 'bg-amber-500',
  hr: 'bg-orange-500',
  operations: 'bg-cyan-500',
  marketing: 'bg-pink-500',
}

interface RoadmapTimelineProps {
  steps: RoadmapStep[]
  progress: Record<string, boolean>
  onToggleStep: (stepId: string, isComplete: boolean) => void
  onAskAI: (step: RoadmapStep) => void
  grants?: Grant[] | null
}

export function isFundingStep(step: RoadmapStep): boolean {
  const t = `${step.title} ${step.description}`.toLowerCase()
  return /funding|grant|loan|financ|subsid|tax credit|capital/.test(t)
}

function groupStepsByCategory(steps: RoadmapStep[]): Record<string, RoadmapStep[]> {
  const groups: Record<string, RoadmapStep[]> = {}
  const order = ['legal', 'financial', 'licensing', 'product', 'operations', 'marketing', 'hr']
  for (const cat of order) {
    groups[cat] = steps.filter((s) => s.category === cat)
  }
  for (const step of steps) {
    if (!order.includes(step.category)) {
      if (!groups['operations']) groups['operations'] = []
      groups['operations'].push(step)
    }
  }
  return groups
}

function getCompletedStepIds(progress: Record<string, boolean>, steps: RoadmapStep[]): string[] {
  return steps.filter((s) => progress[s.id] ?? s.isComplete).map((s) => s.id)
}

function isStepLocked(step: RoadmapStep, completedIds: string[]): boolean {
  const deps = step.dependencies ?? step.dependsOn ?? []
  if (deps.length === 0) return false
  return deps.some((depId) => !completedIds.includes(depId))
}

export function RoadmapTimeline({
  steps,
  progress,
  onToggleStep,
  onAskAI,
  grants = null,
}: RoadmapTimelineProps) {
  const completedIds = getCompletedStepIds(progress, steps)
  const byCategory = groupStepsByCategory(steps)
  const categoriesWithSteps = Object.entries(byCategory).filter(
    ([_, s]) => s.length > 0
  )

  return (
    <div className="relative">
      {/* Desktop: vertical line; mobile: hidden */}
      <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gray-200 hidden sm:block" />
      <div className="relative space-y-8">
        {categoriesWithSteps.map(([category, categorySteps]) => (
          <div key={category}>
            <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-wide text-brand-primary">
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  CATEGORY_LINE_COLORS[category] ?? 'bg-gray-400'
                )}
              />
              {CATEGORY_LABELS[category] ?? category}
            </h3>
            <div className="space-y-4">
              {categorySteps.map((step) => {
                const complete = progress[step.id] ?? step.isComplete
                const locked = isStepLocked(step, completedIds)
                const active = !complete && !locked
                const nodeColor = complete
                  ? 'bg-green-500 border-green-500'
                  : locked
                    ? 'bg-gray-400 border-gray-400'
                    : CATEGORY_LINE_COLORS[step.category] ?? 'bg-gray-400'
                const topGrant = isFundingStep(step) && grants?.length ? grants[0] : null

                return (
                  <div
                    key={step.id}
                    className="relative flex gap-4"
                    data-step-id={step.id}
                  >
                    <div
                      className={cn(
                        'absolute left-[11px] top-6 h-4 w-4 shrink-0 rounded-full border-2 border-white shadow transition-all duration-300 hidden sm:block',
                        nodeColor
                      )}
                    />
                    <div className="ml-0 sm:ml-10 flex-1 pb-2">
                      <RoadmapStepCard
                        step={step}
                        isComplete={complete}
                        isLocked={locked}
                        onToggle={onToggleStep}
                        onAskAI={onAskAI}
                      />
                      {isFundingStep(step) && grants && grants.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {topGrant && (
                            <div>
                              <p className="text-xs font-medium text-brand-primary mb-2">
                                Top grant for this step
                              </p>
                              <GrantCard grant={topGrant} />
                            </div>
                          )}
                          {grants.length > 1 && (
                            <div className="grid gap-3 sm:grid-cols-2">
                              {grants.slice(1, 3).map((g) => (
                                <GrantCard key={g.id} grant={g} />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
