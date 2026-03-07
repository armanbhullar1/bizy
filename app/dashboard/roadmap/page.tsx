'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useBusinessProfile } from '@/hooks/useBusinessProfile'
import { useRoadmap } from '@/hooks/useRoadmap'
import { useAppContext } from '@/context/AppContext'
import { RoadmapTimeline } from '@/components/roadmap/RoadmapTimeline'
import { ProgressTracker } from '@/components/roadmap/ProgressTracker'
import { LaunchReadinessScore } from '@/components/roadmap/LaunchReadinessScore'
import { NextBestAction } from '@/components/roadmap/NextBestAction'
import { RoadmapAdvisor } from '@/components/roadmap/RoadmapAdvisor'
import { StepDetailModal } from '@/components/roadmap/StepDetailModal'
import { GrantCard } from '@/components/grants/GrantCard'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  Rocket,
  FileText,
  ListChecks,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import type { RoadmapStep, Grant } from '@/types'

export default function RoadmapPage() {
  const { businessProfile, loading: profileLoading } = useBusinessProfile()
  const { state, toggleRoadmapStep } = useAppContext()
  const { roadmap, loading, error, generateRoadmap } = useRoadmap()
  const timelineRef = useRef<HTMLDivElement>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalStep, setModalStep] = useState<RoadmapStep | null>(null)

  const [strategyLoading, setStrategyLoading] = useState(false)
  const [strategyText, setStrategyText] = useState<string | null>(null)

  const [grants, setGrants] = useState<Grant[] | null>(null)

  async function fetchGrants(): Promise<Grant[] | null> {
    if (!businessProfile) return null
    try {
      const res = await fetch('/api/grants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessType: businessProfile.businessType,
          province: businessProfile.province,
        }),
      })
      if (!res.ok) return null
      const data = await res.json()
      return data.grants ?? []
    } catch {
      return null
    }
  }

  const steps = roadmap?.steps ?? []
  const progress = state.roadmapProgress ?? {}
  const completedCount = steps.filter((s) => progress[s.id] ?? s.isComplete).length
  const completedStepIds = steps.filter((s) => progress[s.id] ?? s.isComplete).map((s) => s.id)

  async function handleGenerateRoadmap() {
    if (!businessProfile) return
    try {
      await generateRoadmap(businessProfile, state.viabilityResult)
      setGrants(await fetchGrants())
    } catch {
      // error set in hook
    }
  }

  function handleAskAI(step: RoadmapStep) {
    setModalStep(step)
    setModalOpen(true)
  }

  function handleToggleStep(stepId: string, isComplete: boolean) {
    toggleRoadmapStep(stepId, isComplete)
  }

  function handleScrollToStep(stepId: string) {
    const el = document.querySelector(`[data-step-id="${stepId}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  async function handleGenerateLaunchStrategy() {
    if (!businessProfile) return
    setStrategyLoading(true)
    setStrategyText(null)
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user' as const,
              content: `Generate a startup launch strategy for this business: ${businessProfile.businessName} (${businessProfile.businessType}) in ${businessProfile.province}. Include: marketing strategy, customer acquisition, pricing strategy, and growth milestones. Format as a clear report with sections.`,
            },
          ],
          systemPrompt:
            'You are a Canadian startup advisor. Write a structured, actionable launch strategy report.',
          model: 'gemini-2.5-flash',
        }),
      })
      if (!res.ok) throw new Error('Failed to generate strategy')
      const data = await res.json()
      setStrategyText(data.response ?? '')
    } catch (err) {
      setStrategyText(err instanceof Error ? err.message : 'Failed to load strategy.')
    } finally {
      setStrategyLoading(false)
    }
  }

  function handleExportChecklist() {
    if (steps.length === 0) return
    const text = steps
      .map((s, i) => `${i + 1}. [ ] ${s.title}\n   ${s.description}`)
      .join('\n\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'launch-roadmap-checklist.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleExportPDF() {
    window.print()
  }

  if (profileLoading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-heading font-bold text-brand-primary mb-6">
          Launch Roadmap
        </h1>
        <p className="text-gray-500">Loading your profile...</p>
      </div>
    )
  }

  if (!businessProfile) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-heading font-bold text-brand-primary mb-6">
          Launch Roadmap
        </h1>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <p className="font-medium text-amber-800 mb-2">Profile required</p>
          <p className="text-sm text-amber-700 mb-4">
            Complete onboarding to generate your launch roadmap.
          </p>
          <Button asChild>
            <Link href="/onboarding">Complete onboarding</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-heading font-bold text-brand-primary mb-6">
        Launch Roadmap
      </h1>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Button
          onClick={handleGenerateRoadmap}
          disabled={loading || !businessProfile}
          size="lg"
          className="gap-2"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Rocket className="h-5 w-5" />
          )}
          Generate Roadmap
        </Button>
        <Button
          variant="outline"
          onClick={handleGenerateLaunchStrategy}
          disabled={strategyLoading || !businessProfile}
          className="gap-2"
        >
          {strategyLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Generate Launch Strategy
        </Button>
        {steps.length > 0 && (
          <>
            <Button variant="outline" size="sm" onClick={handleExportChecklist} className="gap-2">
              <ListChecks className="h-4 w-4" />
              Export as checklist
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF} className="gap-2">
              <FileText className="h-4 w-4" />
              Export as PDF
            </Button>
          </>
        )}
      </div>

      {strategyText !== null && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="font-heading text-lg font-semibold text-brand-primary mb-3">
            Launch Strategy
          </h3>
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
            {strategyText}
          </div>
        </div>
      )}

      {steps.length > 0 && (
        <>
          <div className="mb-6">
            <NextBestAction
              steps={steps}
              progress={progress}
              onScrollToStep={handleScrollToStep}
            />
          </div>

          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <ProgressTracker completed={completedCount} total={steps.length} />
            </div>
            <div className="shrink-0">
              <LaunchReadinessScore
                completed={completedCount}
                total={steps.length}
                size="md"
              />
            </div>
          </div>

          <div className="mb-8">
            <RoadmapAdvisor steps={steps} completedStepIds={completedStepIds} />
          </div>

          <div ref={timelineRef} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-xl font-semibold text-brand-primary mb-6">
              Interactive Timeline
            </h2>
            <RoadmapTimeline
              steps={steps}
              progress={progress}
              onToggleStep={handleToggleStep}
              onAskAI={handleAskAI}
              grants={grants}
            />

            {grants && grants.length > 0 && (
              <div className="mt-10 border-t border-gray-100 pt-8">
                <h3 className="font-heading text-lg font-semibold text-brand-primary mb-4">
                  Funding & grants (relevant to your profile)
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {grants.slice(0, 4).map((grant) => (
                    <GrantCard key={grant.id} grant={grant} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {!loading && steps.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 text-center shadow-sm">
          <Rocket className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="font-heading text-xl font-semibold text-brand-primary mb-2">
            Your launch roadmap
          </h3>
          <p className="max-w-md text-sm text-gray-600 mb-6">
            Get a step-by-step AI-generated roadmap tailored to your business and location.
            We’ll use your viability scan insights when available.
          </p>
          <Button onClick={handleGenerateRoadmap} size="lg" className="gap-2">
            <Rocket className="h-5 w-5" />
            Generate Roadmap
          </Button>
        </div>
      )}

      <StepDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        step={modalStep}
        businessType={businessProfile?.businessType ?? ''}
        province={businessProfile?.province ?? ''}
      />
    </div>
  )
}
