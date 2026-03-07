'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap, Map, Shield, Store, User } from 'lucide-react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useBusinessProfile } from '@/hooks/useBusinessProfile'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useUser()
  const { businessProfile, loading, needsOnboarding } = useBusinessProfile()

  // Redirect to onboarding if no profile
  useEffect(() => {
    if (!loading && needsOnboarding) {
      router.push('/onboarding')
    }
  }, [loading, needsOnboarding, router])

  const cards = [
    {
      title: 'Viability',
      description: 'Validate your business idea',
      href: '/dashboard/viability',
      icon: Zap,
      color: 'text-brand-accent',
    },
    {
      title: 'Roadmap',
      description: 'Your launch checklist',
      href: '/dashboard/roadmap',
      icon: Map,
      color: 'text-brand-highlight',
    },
    {
      title: 'Compliance',
      description: 'CRA, licenses, HR',
      href: '/dashboard/compliance',
      icon: Shield,
      color: 'text-success',
    },
    {
      title: 'Storefront',
      description: 'Build your online presence',
      href: '/dashboard/storefront',
      icon: Store,
      color: 'text-brand-accent',
    },
  ]

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.name || 'User'}
              className="w-12 h-12 rounded-full border-2 border-brand-accent"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-heading font-bold text-brand-primary">
              Welcome back{businessProfile?.businessName ? `, ${businessProfile.businessName}` : ''}
            </h1>
            {user?.email && (
              <p className="text-gray-500 text-sm">{user.email}</p>
            )}
          </div>
        </div>
        
        {/* Business Profile Summary */}
        {businessProfile && (
          <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-gray-500">Business Type:</span>{' '}
                <span className="font-medium text-brand-primary capitalize">
                  {businessProfile.businessType}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Location:</span>{' '}
                <span className="font-medium text-brand-primary">
                  {businessProfile.city}, {businessProfile.province}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Stage:</span>{' '}
                <span className="font-medium text-brand-primary capitalize">
                  {businessProfile.stage}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feature Cards */}
      <h2 className="text-xl font-heading font-semibold text-brand-primary mb-4">
        What would you like to do?
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ title, description, href, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="p-6 rounded-xl border border-gray-200 bg-white hover:border-brand-accent/50 hover:shadow-md transition-all"
          >
            <div className={`p-2 w-fit rounded-lg bg-gray-100 ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-heading font-semibold text-brand-primary mt-4 mb-2">
              {title}
            </h2>
            <p className="text-gray-500 text-sm">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
