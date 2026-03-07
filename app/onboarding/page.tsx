'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress'
import { StepOne } from '@/components/onboarding/StepOne'
import { StepTwo } from '@/components/onboarding/StepTwo'
import { StepThree } from '@/components/onboarding/StepThree'
import { useBusinessProfile } from '@/hooks/useBusinessProfile'
import type { BusinessProfile, BusinessType, CanadianProvince, BudgetRange } from '@/types'

type StepOneData = {
  businessName: string
  businessType: string
  businessDescription: string
}

type StepTwoData = {
  province: string
  city: string
  targetCustomers: string
}

type StepThreeData = {
  stage: string
  budget: string
  goals: string[]
  background?: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isLoading } = useUser()
  const { setBusinessProfile, businessProfile, loading: profileLoading } = useBusinessProfile()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<BusinessProfile>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // If user already has a profile, redirect to dashboard
  useEffect(() => {
    if (!profileLoading && businessProfile) {
      router.push('/dashboard')
    }
  }, [businessProfile, profileLoading, router])

  const handleStepOne = (data: StepOneData) => {
    setFormData((prev) => ({
      ...prev,
      businessName: data.businessName,
      businessType: data.businessType as BusinessType,
      businessDescription: data.businessDescription,
    }))
    setCurrentStep(2)
  }

  const handleStepTwo = (data: StepTwoData) => {
    setFormData((prev) => ({
      ...prev,
      province: data.province as CanadianProvince,
      city: data.city,
      targetCustomers: data.targetCustomers,
    }))
    setCurrentStep(3)
  }

  const handleStepThree = async (data: StepThreeData) => {
    setIsSubmitting(true)
    
    const completeProfile: BusinessProfile = {
      uid: user?.sub ?? '',
      email: user?.email as string | undefined,
      businessName: formData.businessName ?? '',
      businessType: formData.businessType as BusinessType,
      businessDescription: formData.businessDescription ?? '',
      province: formData.province as CanadianProvince,
      city: formData.city ?? '',
      targetCustomers: formData.targetCustomers ?? '',
      stage: data.stage as 'idea' | 'planning' | 'ready',
      budget: data.budget as BudgetRange,
      goals: data.goals,
      background: data.background,
      createdAt: new Date().toISOString(),
    }

    // Save to localStorage (persists across sessions)
    setBusinessProfile(completeProfile)
    
    // Redirect to dashboard
    router.push('/dashboard')
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation */}
      <div className="sticky top-0 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <a 
            href="/"
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
          <span className="text-xl font-heading font-bold text-brand-primary">Bizy</span>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-brand-primary mb-2">
            {currentStep === 1 && 'Tell us about your business'}
            {currentStep === 2 && 'Where are you located?'}
            {currentStep === 3 && 'Final details'}
          </h1>
          <p className="text-gray-500">
            {currentStep === 1 && 'This helps us personalize your experience'}
            {currentStep === 2 && "We'll show you relevant regulations and grants"}
            {currentStep === 3 && 'Almost done! Just a few more questions'}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <OnboardingProgress currentStep={currentStep} totalSteps={3} />
        </div>

        {/* Form Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          {currentStep === 1 && <StepOne onNext={handleStepOne} />}
          {currentStep === 2 && <StepTwo onNext={handleStepTwo} onBack={handleBack} />}
          {currentStep === 3 && (
            <StepThree onBack={handleBack} onSubmit={handleStepThree} />
          )}
        </div>

        {/* User info */}
        {user && (
          <p className="text-center text-sm text-gray-400 mt-6">
            Signed in as {user.email}
          </p>
        )}
      </div>
    </div>
  )
}
