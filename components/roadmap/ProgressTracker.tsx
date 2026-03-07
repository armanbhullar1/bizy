'use client'

import { cn } from '@/lib/utils'

interface ProgressTrackerProps {
  completed: number
  total: number
}

export function ProgressTracker({ completed, total }: ProgressTrackerProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  const remaining = Math.max(0, total - completed)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-medium text-brand-primary">Progress</span>
        <div className="flex flex-wrap items-center gap-4 text-gray-600">
          <span>{completed} / {total} steps complete</span>
          <span>{remaining} remaining</span>
          <span className="font-semibold text-brand-primary">
            Launch readiness: {percentage}%
          </span>
        </div>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 transition-colors">
        <div
          className="h-full rounded-full bg-brand-accent transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
