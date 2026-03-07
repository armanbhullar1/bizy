'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export function HeroSection({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-brand-primary">
      {/* Background Image & Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero-bg.png" 
          alt="Banff Mountains cinematic background" 
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-transparent to-brand-primary opacity-90" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        {/* Top Pill Tag */}
        <div className="animate-fade-in-up opacity-0 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium mb-8 backdrop-blur-sm" style={{ animationDelay: '0ms' }}>
          <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
          Your AI Co-Founder for Canada
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in-up opacity-0 text-5xl md:text-6xl lg:text-7xl font-sans font-extrabold tracking-tighter text-white mb-8 leading-tight" style={{ animationDelay: '100ms' }}>
          Your AI Co‑Founder<br />
          <span className="text-gray-400 font-medium">for Launching a<br/>Business in Canada.</span>
        </h1>

        {/* Subtext */}
        <p className="animate-fade-in-up opacity-0 text-lg md:text-xl text-gray-300 max-w-2xl text-center mb-12 leading-relaxed" style={{ animationDelay: '200ms' }}>
          Bizy helps you validate your idea, navigate regulations, and launch your company — all in one intelligent platform.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4 w-full" style={{ animationDelay: '300ms' }}>
          <Link
            href={isLoggedIn ? "/dashboard" : "/api/auth/login?returnTo=/dashboard"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-brand-primary font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Start Building Your Business
          </Link>
          <button
            onClick={() => document.getElementById('product-demo')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 text-white border border-white/20 font-semibold text-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            See How It Works
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
