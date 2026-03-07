'use client'

import { useState } from 'react'
import { FileText, AlertCircle, CheckCircle2, ExternalLink, Info } from 'lucide-react'
import { CRA_FORMS } from '@/lib/data/cra-forms'
import { useBusinessProfile } from '@/hooks/useBusinessProfile'
import { CRADocCard } from '@/components/compliance/CRADocCard'
import { Button } from '@/components/ui/button'
import type { CRAForm } from '@/types'

export default function CRAPage() {
  const { businessProfile } = useBusinessProfile()
  const [selectedForm, setSelectedForm] = useState<CRAForm | null>(null)
  const [completedForms, setCompletedForms] = useState<Set<string>>(new Set())

  // Filter forms based on business type
  const relevantForms = businessProfile
    ? CRA_FORMS.filter((form) => form.categories.includes(businessProfile.businessType))
    : CRA_FORMS

  const handleMarkComplete = (formId: string) => {
    setCompletedForms((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(formId)) {
        newSet.delete(formId)
      } else {
        newSet.add(formId)
      }
      return newSet
    })
  }

  const completedCount = relevantForms.filter((f) => completedForms.has(f.id)).length

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-brand-primary mb-2">
          CRA Document Hub
        </h1>
        <p className="text-gray-500">
          Required tax forms and registrations for your{' '}
          {businessProfile?.businessType ? (
            <span className="font-medium capitalize">{businessProfile.businessType}</span>
          ) : (
            'business'
          )}{' '}
          in Canada.
        </p>
      </div>

      {/* Progress Summary */}
      <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-accent/10">
              <FileText className="w-5 h-5 text-brand-accent" />
            </div>
            <div>
              <p className="font-medium text-brand-primary">
                {completedCount} of {relevantForms.length} forms completed
              </p>
              <p className="text-sm text-gray-500">Track your CRA compliance progress</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-brand-accent">
              {Math.round((completedCount / relevantForms.length) * 100) || 0}%
            </div>
          </div>
        </div>
        <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-accent rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / relevantForms.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Quick Info */}
      <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Key CRA Deadlines</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li>GST/HST returns: Monthly, quarterly, or annually (based on revenue)</li>
            <li>T4 slips to employees: By end of February</li>
            <li>Corporate tax (T2): Within 6 months of fiscal year-end</li>
            <li>Payroll remittances: 15th of following month</li>
          </ul>
        </div>
      </div>

      {/* Form Categories */}
      <div className="space-y-6">
        {/* Registration Forms */}
        <section>
          <h2 className="text-xl font-heading font-semibold text-brand-primary mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-accent" />
            Registration & Setup
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {relevantForms
              .filter((f) => ['rc1', 'rc1a'].includes(f.id))
              .map((form) => (
                <div key={form.id} className="relative">
                  <CRADocCard form={form} onExplain={() => setSelectedForm(form)} />
                  <button
                    onClick={() => handleMarkComplete(form.id)}
                    className={`absolute top-4 right-4 p-1 rounded-full transition-colors ${
                      completedForms.has(form.id)
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
          </div>
        </section>

        {/* Payroll Forms */}
        <section>
          <h2 className="text-xl font-heading font-semibold text-brand-primary mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-highlight" />
            Payroll & Employees
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {relevantForms
              .filter((f) => ['pd7a', 't4'].includes(f.id))
              .map((form) => (
                <div key={form.id} className="relative">
                  <CRADocCard form={form} onExplain={() => setSelectedForm(form)} />
                  <button
                    onClick={() => handleMarkComplete(form.id)}
                    className={`absolute top-4 right-4 p-1 rounded-full transition-colors ${
                      completedForms.has(form.id)
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
          </div>
        </section>

        {/* Tax Returns */}
        <section>
          <h2 className="text-xl font-heading font-semibold text-brand-primary mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            Tax Returns
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {relevantForms
              .filter((f) => ['t2', 't2125', 'gst34', 't661'].includes(f.id))
              .map((form) => (
                <div key={form.id} className="relative">
                  <CRADocCard form={form} onExplain={() => setSelectedForm(form)} />
                  <button
                    onClick={() => handleMarkComplete(form.id)}
                    className={`absolute top-4 right-4 p-1 rounded-full transition-colors ${
                      completedForms.has(form.id)
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
          </div>
        </section>
      </div>

      {/* Form Detail Modal */}
      {selectedForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="inline-block rounded bg-brand-primary px-2 py-0.5 font-mono text-xs font-medium text-white mb-2">
                  {selectedForm.code}
                </span>
                <h3 className="text-xl font-heading font-bold text-brand-primary">
                  {selectedForm.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedForm(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600 mb-4">{selectedForm.description}</p>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 mb-4">
              <p className="text-sm text-amber-800">
                <span className="font-medium">When needed:</span> {selectedForm.whenNeeded}
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href={selectedForm.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Open CRA Form
                </Button>
              </a>
              <Button variant="outline" onClick={() => setSelectedForm(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
