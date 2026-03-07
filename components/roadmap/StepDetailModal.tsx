'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Loader2, X, Sparkles } from 'lucide-react'
import type { RoadmapStep } from '@/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface StepDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  step: RoadmapStep | null
  businessType: string
  province: string
}

export function StepDetailModal({
  open,
  onOpenChange,
  step,
  businessType,
  province,
}: StepDetailModalProps) {
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  async function handleAskAI() {
    if (!step) return
    setAiLoading(true)
    setAiResponse(null)
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user' as const,
              content: `Explain how to complete this step for a ${businessType} business in ${province}.\n\nStep:\n${step.title}\n${step.description}`,
            },
          ],
          systemPrompt:
            'You are a Canadian startup advisor. Give clear, actionable steps in plain language.',
          model: 'gemini-2.5-flash',
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to get AI response')
      }
      const data = await res.json()
      setAiResponse(data.response ?? '')
    } catch (err) {
      setAiResponse(err instanceof Error ? err.message : 'Failed to load AI advice.')
    } finally {
      setAiLoading(false)
    }
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      setAiResponse(null)
    }
    onOpenChange(next)
  }

  if (!step) return null

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
            'rounded-xl border border-gray-200 bg-white shadow-xl',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
          )}
        >
          <div className="max-h-[85vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between gap-4">
              <Dialog.Title className="font-heading text-xl font-semibold text-brand-primary">
                {step.title}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>
            <p className="mt-2 text-sm text-gray-600">{step.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
              <span>⏱ {step.estimatedTime}</span>
              {step.priority && (
                <span className="capitalize">Priority: {step.priority}</span>
              )}
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAskAI}
                disabled={aiLoading}
                className="gap-2"
              >
                {aiLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Ask AI about this step
              </Button>
              {aiResponse !== null && (
                <div className="mt-4 rounded-lg border border-brand-primary/20 bg-brand-primary/5 p-4">
                  <p className="text-xs font-medium text-brand-primary mb-1">AI advice</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{aiResponse}</p>
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
