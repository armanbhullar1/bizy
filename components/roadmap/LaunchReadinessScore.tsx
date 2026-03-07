'use client'

import { cn } from '@/lib/utils'

interface LaunchReadinessScoreProps {
  completed: number
  total: number
  size?: 'sm' | 'md' | 'lg'
}

export function LaunchReadinessScore({
  completed,
  total,
  size = 'md',
}: LaunchReadinessScoreProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  const getScoreColor = () => {
    if (percentage >= 75) return { text: 'text-green-600', stroke: 'stroke-green-600' }
    if (percentage >= 40) return { text: 'text-amber-600', stroke: 'stroke-amber-600' }
    return { text: 'text-gray-600', stroke: 'stroke-gray-500' }
  }

  const colors = getScoreColor()
  const sizeClasses = {
    sm: 'h-14 w-14 text-lg',
    md: 'h-20 w-20 text-2xl',
    lg: 'h-28 w-28 text-3xl',
  }

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-full',
        sizeClasses[size]
      )}
    >
      <svg
        className="-rotate-90"
        viewBox="0 0 36 36"
        width="100%"
        height="100%"
      >
        <path
          className="stroke-gray-200"
          strokeWidth="3"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className={cn('transition-all duration-500 ease-out', colors.stroke)}
          strokeWidth="3"
          strokeDasharray={`${percentage}, 100`}
          strokeLinecap="round"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <span className={cn('absolute font-heading font-bold', colors.text)}>
        {percentage}%
      </span>
    </div>
  )
}
