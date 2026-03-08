'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Rocket } from 'lucide-react'

export function ModernFooter() {
  const footerLinks = {
    Platform: [
      { name: 'Features', href: '#' },
      { name: 'Outcomes', href: '#' },
      { name: 'How it works', href: '#' },
      { name: 'Use Cases', href: '#' },
    ],
    Company: [
      { name: 'Terms', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Trust Center', href: '#' },
    ],
    Socials: [
      { name: 'LinkedIn', href: '#' },
      { name: 'X.com', href: '#' },
    ]
  }

  return (
    <footer className="bg-[#0a0a0a] pt-24 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between mb-32 gap-12">
          
          <div className="flex-1 max-w-sm">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center overflow-hidden relative">
                <Image src="/bizy-logo.png" alt="Bizy Logo" fill className="object-cover" />
              </div>
              <span className="text-2xl font-heading font-medium tracking-tight text-white">Bizy</span>
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              Your AI co-founder for launching businesses in Canada.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
              All Systems Operational
            </div>
            
            <div className="flex gap-3 mt-6">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400">SOC2</div>
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400">CRA</div>
            </div>
          </div>

          <div className="flex gap-16 md:gap-24 flex-wrap">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-gray-500 text-xs font-medium mb-6">{category}</h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-white hover:text-gray-300 font-medium transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </div>
      
      {/* Huge Faint Text */}
      <div className="relative mt-24 mb-16 flex justify-center pointer-events-none select-none overflow-hidden">
        <h1 
          className="text-[24vw] md:text-[20vw] lg:text-[22vw] font-heading font-medium tracking-tighter leading-none text-center whitespace-nowrap text-white/5"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
          }}
        >
          Bizy
        </h1>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <p className="text-[#666] text-xs font-medium">
          ©{new Date().getFullYear()} All Rights reserved to Bizy. Built in Canada.
        </p>
      </div>
    </footer>
  )
}
