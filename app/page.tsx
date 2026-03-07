import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { getSession } from '@/lib/auth0'
import { LandingNav } from '@/components/layout/LandingNav'
import { TranslatedHero, TranslatedSteps } from '@/components/landing/TranslatedContent'

export default async function LandingPage() {
  const session = await getSession()
  const isLoggedIn = !!session?.user
  
  return (
    <div className="min-h-screen bg-[var(--brand-primary)] text-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-secondary)] via-[var(--brand-primary)] to-[var(--brand-primary)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--brand-accent)_0%,_transparent_50%)] opacity-20" />
        <LandingNav isLoggedIn={isLoggedIn} />
        <TranslatedHero isLoggedIn={isLoggedIn} />
      </header>

      {/* 4-Step Flow */}
      <TranslatedSteps />

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--brand-accent)]/20 text-[var(--brand-accent)] text-sm font-medium mb-6">
            <CheckCircle2 className="w-4 h-4" />
            Free to get started
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Ready to build something great?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join entrepreneurs who are launching with Bizy.
          </p>
          <Link
            href={isLoggedIn ? "/onboarding" : "/api/auth/login?returnTo=/onboarding"}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-[var(--brand-accent)] hover:opacity-90 transition-opacity font-semibold text-lg"
          >
            {isLoggedIn ? "Go to App" : "Create your account"}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <span className="text-gray-500 text-sm">© Bizy. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
