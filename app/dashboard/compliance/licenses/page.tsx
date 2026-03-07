'use client'

import { useState, useMemo } from 'react'
import { ExternalLink, CheckCircle2, Clock, DollarSign, Building2, Globe } from 'lucide-react'
import { LICENSES } from '@/lib/data/licenses'
import { PROVINCES, getProvinceName } from '@/lib/utils/province'
import { useBusinessProfile } from '@/hooks/useBusinessProfile'
import { Button } from '@/components/ui/button'
import type { CanadianProvince, License } from '@/types'

export default function LicensesPage() {
  const { businessProfile } = useBusinessProfile()
  const [selectedProvince, setSelectedProvince] = useState<CanadianProvince | 'federal' | 'all'>(
    businessProfile?.province || 'all'
  )
  const [completedLicenses, setCompletedLicenses] = useState<Set<string>>(new Set())

  // Filter licenses based on province and business type
  const filteredLicenses = useMemo(() => {
    return LICENSES.filter((license) => {
      // Province filter
      const matchesProvince =
        selectedProvince === 'all' ||
        license.province === selectedProvince ||
        license.province === 'federal'

      // Business type filter (if user has a profile)
      const matchesType = businessProfile
        ? license.businessTypes.includes(businessProfile.businessType)
        : true

      return matchesProvince && matchesType
    })
  }, [selectedProvince, businessProfile])

  // Group by province
  const groupedLicenses = useMemo(() => {
    const groups: Record<string, License[]> = { federal: [], provincial: [] }
    filteredLicenses.forEach((license) => {
      if (license.province === 'federal') {
        groups.federal.push(license)
      } else {
        groups.provincial.push(license)
      }
    })
    return groups
  }, [filteredLicenses])

  const handleToggleComplete = (licenseId: string) => {
    setCompletedLicenses((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(licenseId)) {
        newSet.delete(licenseId)
      } else {
        newSet.add(licenseId)
      }
      return newSet
    })
  }

  const completedCount = filteredLicenses.filter((l) => completedLicenses.has(l.id)).length

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-brand-primary mb-2">
          License Navigator
        </h1>
        <p className="text-gray-500">
          Required licenses and permits for your{' '}
          {businessProfile?.businessType ? (
            <span className="font-medium capitalize">{businessProfile.businessType}</span>
          ) : (
            'business'
          )}{' '}
          in Canada.
        </p>
      </div>

      {/* Province Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setSelectedProvince('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedProvince === 'all'
                ? 'bg-white text-brand-primary shadow-sm'
                : 'text-gray-600 hover:text-brand-primary'
            }`}
          >
            All Provinces
          </button>
          <button
            onClick={() => setSelectedProvince('federal')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
              selectedProvince === 'federal'
                ? 'bg-white text-brand-primary shadow-sm'
                : 'text-gray-600 hover:text-brand-primary'
            }`}
          >
            <Globe className="w-4 h-4" />
            Federal
          </button>
          {PROVINCES.map(({ code, name }) => (
            <button
              key={code}
              onClick={() => setSelectedProvince(code)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedProvince === code
                  ? 'bg-white text-brand-primary shadow-sm'
                  : 'text-gray-600 hover:text-brand-primary'
              } ${businessProfile?.province === code ? 'ring-2 ring-brand-accent ring-offset-1' : ''}`}
            >
              {code}
            </button>
          ))}
        </div>
        {businessProfile?.province && (
          <p className="mt-2 text-sm text-gray-500">
            Your registered province:{' '}
            <span className="font-medium text-brand-primary">
              {getProvinceName(businessProfile.province)}
            </span>
          </p>
        )}
      </div>

      {/* Progress Summary */}
      <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-accent/10">
              <Building2 className="w-5 h-5 text-brand-accent" />
            </div>
            <div>
              <p className="font-medium text-brand-primary">
                {completedCount} of {filteredLicenses.length} licenses obtained
              </p>
              <p className="text-sm text-gray-500">Track your licensing progress</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-brand-accent">
              {Math.round((completedCount / filteredLicenses.length) * 100) || 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Federal Licenses */}
      {groupedLicenses.federal.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-heading font-semibold text-brand-primary mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-accent" />
            Federal Requirements
          </h2>
          <div className="grid gap-4">
            {groupedLicenses.federal.map((license) => (
              <LicenseCard
                key={license.id}
                license={license}
                isComplete={completedLicenses.has(license.id)}
                onToggleComplete={() => handleToggleComplete(license.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Provincial Licenses */}
      {groupedLicenses.provincial.length > 0 && (
        <section>
          <h2 className="text-xl font-heading font-semibold text-brand-primary mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-highlight" />
            Provincial & Municipal Requirements
          </h2>
          <div className="grid gap-4">
            {groupedLicenses.provincial.map((license) => (
              <LicenseCard
                key={license.id}
                license={license}
                isComplete={completedLicenses.has(license.id)}
                onToggleComplete={() => handleToggleComplete(license.id)}
              />
            ))}
          </div>
        </section>
      )}

      {filteredLicenses.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No licenses found for the selected filters.</p>
          <p className="text-sm mt-1">Try selecting a different province or business type.</p>
        </div>
      )}
    </div>
  )
}

// License Card Component
function LicenseCard({
  license,
  isComplete,
  onToggleComplete,
}: {
  license: License
  isComplete: boolean
  onToggleComplete: () => void
}) {
  return (
    <div
      className={`rounded-lg border bg-white p-5 shadow-sm transition-all ${
        isComplete ? 'border-green-300 bg-green-50/50' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-heading font-semibold text-brand-primary">{license.name}</h3>
            {license.province !== 'federal' && (
              <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                {license.province}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-2">{license.issuingAuthority}</p>
          <p className="text-sm text-gray-600 mb-3">{license.description}</p>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <DollarSign className="w-4 h-4 text-brand-accent" />
              <span>{license.estimatedCost}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-4 h-4 text-brand-highlight" />
              <span>{license.estimatedTime}</span>
            </div>
            {license.renewalPeriod && (
              <div className="text-gray-500">Renewal: {license.renewalPeriod}</div>
            )}
          </div>
        </div>

        <button
          onClick={onToggleComplete}
          className={`p-2 rounded-full transition-colors shrink-0 ${
            isComplete
              ? 'bg-green-100 text-green-600'
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
          title={isComplete ? 'Mark as incomplete' : 'Mark as complete'}
        >
          <CheckCircle2 className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <a
          href={license.applicationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-brand-accent hover:text-brand-accent/80"
        >
          <ExternalLink className="w-4 h-4" />
          Apply Now
        </a>
      </div>
    </div>
  )
}
