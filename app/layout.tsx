import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { AppProvider } from '@/context/AppContext'
import { TranslationProvider } from '@/context/TranslationContext'
import '@/app/globals.css'

const fontHeading = Syne({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const fontBody = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bizy - Your first Canadian co-founder',
  description: 'Launch your business in Canada with confidence',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fontHeading.variable} ${fontBody.variable}`}>
      <body className="font-body antialiased">
        <UserProvider>
          <TranslationProvider>
            <AppProvider>{children}</AppProvider>
          </TranslationProvider>
        </UserProvider>
      </body>
    </html>
  )
}
