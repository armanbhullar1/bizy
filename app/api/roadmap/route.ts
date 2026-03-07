import { NextRequest, NextResponse } from 'next/server'
import { promptGeminiJSON } from '@/lib/gemini'
import type {
  BusinessProfile,
  RoadmapStep,
  RoadmapCategory,
  RoadmapStepPriority,
  RoadmapStepDifficulty,
  ViabilityResult,
} from '@/types'

const GEMINI_ROADMAP_MODEL = 'gemini-2.5-flash'

interface GeminiStep {
  title: string
  description: string
  category: 'legal' | 'financial' | 'product' | 'marketing' | 'operations'
  estimatedTime: string
  priority: 'high' | 'medium' | 'low'
  difficulty: 'easy' | 'medium' | 'hard'
  dependencies: string[]
  recommendedTools: string[]
}

interface GeminiRoadmapResponse {
  steps: GeminiStep[]
}

interface RoadmapRequestBody {
  profile: BusinessProfile
  viabilityResult?: ViabilityResult | null
}

function mapCategory(c: GeminiStep['category']): RoadmapCategory {
  const map: Record<GeminiStep['category'], RoadmapCategory> = {
    legal: 'legal',
    financial: 'financial',
    product: 'product',
    marketing: 'marketing',
    operations: 'operations',
  }
  return map[c] ?? 'operations'
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RoadmapRequestBody
    const { profile, viabilityResult } = body

    if (!profile?.businessType || !profile?.province || !profile?.city) {
      return NextResponse.json(
        { error: 'profile with businessType, province, and city is required' },
        { status: 400 }
      )
    }

    const systemPrompt = `You are a startup advisor helping founders launch businesses in Canada.
Generate a detailed launch roadmap. Return ONLY valid JSON with a "steps" array.
Each step must have: title, description, category ("legal"|"financial"|"product"|"marketing"|"operations"), estimatedTime (e.g. "1-2 weeks"), priority ("high"|"medium"|"low"), difficulty ("easy"|"medium"|"hard"), dependencies (array of step titles that must be done first - use empty array for first steps), recommendedTools (array of 0-3 tool or resource names, e.g. "Stripe", "QuickBooks").
Generate 8-12 logical steps in execution order. Dependencies should reference the title of a previous step.`

    let prompt = `You are a startup advisor helping founders launch businesses in Canada. Generate a detailed launch roadmap.

Business:
${profile.businessName}
${profile.businessType}
${profile.province}
Budget: ${profile.budget}
Target customers: ${profile.targetCustomers}
Description: ${profile.businessDescription}

Return JSON:
{
  "steps": [
    {
      "title": "string",
      "description": "string",
      "category": "legal"|"financial"|"product"|"marketing"|"operations",
      "estimatedTime": "string",
      "priority": "high"|"medium"|"low",
      "difficulty": "easy"|"medium"|"hard",
      "dependencies": ["previous step title or empty"],
      "recommendedTools": ["string"]
    }
  ]
}

Generate 8-12 logical steps.`

    if (viabilityResult?.topRisks?.length || viabilityResult?.topOpportunities?.length) {
      prompt += `\n\nConsider these viability insights:
Top Risks: ${viabilityResult.topRisks?.map((r) => r.title).join('; ') ?? 'None'}
Top Opportunities: ${(viabilityResult.topOpportunities ?? []).join('; ') || 'None'}
Include steps that mitigate key risks and leverage opportunities.`
    }

    const aiResponse = await promptGeminiJSON<GeminiRoadmapResponse>(
      prompt,
      systemPrompt,
      GEMINI_ROADMAP_MODEL
    )

    const rawSteps = aiResponse.steps ?? []
    const steps: RoadmapStep[] = rawSteps.map((s, i) => {
      const id = `step-${i + 1}`
      const depIds: string[] = []
      for (const d of s.dependencies ?? []) {
        const trimmed = String(d).trim()
        const byIndex = /^step-(\d+)$/i.exec(trimmed) ?? /^(\d+)$/.exec(trimmed)
        if (byIndex) {
          const idx = parseInt(byIndex[1], 10)
          if (idx >= 1 && idx < rawSteps.length) depIds.push(`step-${idx}`)
        } else {
          const idx = rawSteps.findIndex((x) => x.title === trimmed || x.title?.toLowerCase().includes(trimmed.toLowerCase()))
          if (idx >= 0 && idx < i) depIds.push(`step-${idx + 1}`)
        }
      }
      return {
        id,
        title: s.title,
        description: s.description,
        estimatedTime: s.estimatedTime,
        estimatedCost: '',
        actionUrl: '',
        category: mapCategory(s.category),
        isComplete: false,
        isRequired: s.priority === 'high',
        dependsOn: depIds,
        dependencies: depIds,
        priority: s.priority as RoadmapStepPriority,
        recommendedTools: s.recommendedTools ?? [],
        difficulty: (s.difficulty ?? 'medium') as RoadmapStepDifficulty,
      }
    })

    return NextResponse.json({ steps })
  } catch (error) {
    console.error('Roadmap API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate roadmap' },
      { status: 500 }
    )
  }
}
