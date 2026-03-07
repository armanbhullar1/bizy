'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Lock,
  Wrench,
} from 'lucide-react'
import type { RoadmapStep as RoadmapStepType } from '@/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const CATEGORY_COLORS: Record<string, string> = {
  legal: 'border-l-blue-500 bg-blue-50/30',
  financial: 'border-l-green-500 bg-green-50/30',
  product: 'border-l-purple-500 bg-purple-50/30',
  licensing: 'border-l-amber-500 bg-amber-50/30',
  hr: 'border-l-orange-500 bg-orange-50/30',
  operations: 'border-l-cyan-500 bg-cyan-50/30',
  marketing: 'border-l-pink-500 bg-pink-50/30',
}

const PRIORITY_BADGE: Record<string, string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-gray-100 text-gray-700',
}

const DIFFICULTY_BADGE: Record<string, string> = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-amber-100 text-amber-800',
  hard: 'bg-red-100 text-red-800',
}

interface RoadmapStepCardProps {
  step: RoadmapStepType
  isComplete: boolean
  isLocked: boolean
  onToggle: (stepId: string, isComplete: boolean) => void
  onAskAI: (step: RoadmapStepType) => void
}

export function RoadmapStepCard({
  step,
  isComplete,
  isLocked,
  onToggle,
  onAskAI,
}: RoadmapStepCardProps) {
  const [expanded, setExpanded] = useState(false)

  const canInteract = !isLocked

  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 ease-out',
        isComplete && 'border-green-200 bg-green-50/40',
        isLocked && 'opacity-75 grayscale-[0.3]',
        canInteract && 'hover:shadow-md'
      )}
    >
      <div
        className={cn(
          'border-l-4 pl-4 pr-4 pt-4 pb-3 transition-colors',
          isComplete && 'border-l-green-500',
          !isComplete && isLocked && 'border-l-gray-400',
          !isComplete && !isLocked && (CATEGORY_COLORS[step.category] ?? 'border-l-gray-400')
        )}
      >
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => canInteract && setExpanded(!expanded)}
            disabled={!canInteract}
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded text-gray-500 transition-transform duration-200 hover:text-brand-primary disabled:opacity-50"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => canInteract && onToggle(step.id, !isComplete)}
            disabled={!canInteract}
            className={cn(
              'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300',
              isComplete && 'border-green-500 bg-green-500 text-white',
              !isComplete && isLocked && 'border-gray-300 bg-gray-100 cursor-not-allowed',
              !isComplete && !isLocked && 'border-gray-300 hover:border-brand-accent hover:scale-110'
            )}
            aria-label={isComplete ? 'Mark incomplete' : 'Mark complete'}
          >
            {isComplete ? <Check className="h-4 w-4" /> : null}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {isLocked && (
                <span
                  className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                  title="Complete previous steps first"
                >
                  <Lock className="h-3 w-3" />
                  Locked
                </span>
              )}
              <h4 className="font-heading font-semibold text-brand-primary">
                {step.title}
              </h4>
              {step.priority && (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                    PRIORITY_BADGE[step.priority]
                  )}
                >
                  {step.priority}
                </span>
              )}
              {step.difficulty && (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                    DIFFICULTY_BADGE[step.difficulty]
                  )}
                >
                  {step.difficulty}
                </span>
              )}
            </div>

            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0 text-xs text-gray-500">
              <span>⏱ {step.estimatedTime}</span>
              {step.estimatedCost && <span>💰 {step.estimatedCost}</span>}
            </div>

            {expanded && (
              <div className="mt-4 space-y-3 border-t border-gray-100 pt-4 text-sm text-gray-600 animate-in fade-in-0 slide-in-from-top-1 duration-200">
                <p>{step.description}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="font-medium text-gray-500">Difficulty: {step.difficulty ?? 'Medium'}</span>
                  <span>Time: {step.estimatedTime}</span>
                  <span>Priority: {step.priority ?? 'Medium'}</span>
                </div>
                {step.recommendedTools && step.recommendedTools.length > 0 && (
                  <div>
                    <p className="mb-1 flex items-center gap-1 font-medium text-brand-primary">
                      <Wrench className="h-4 w-4" />
                      Recommended tools
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {step.recommendedTools.map((tool, i) => (
                        <li
                          key={i}
                          className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700"
                        >
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {step.actionUrl && (
                  <Link
                    href={step.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-brand-accent hover:underline"
                  >
                    View resource
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAskAI(step)}
                  disabled={!canInteract}
                  className="gap-2 mt-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Ask AI about this step
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
