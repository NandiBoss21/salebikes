import type { Metadata, Viewport } from 'next'
import './globals.css'
import CookieBanner from '@/components/CookieBanner'
import ChatBot from '@/components/ChatBot'
import { Analytics } from '@vercel/analytics/next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'Outlet és használt kerékpárok | Bringabarát – Kápolnásnyék',
  description: 'Prémium outlet és használt kerékpárok garanciával. Cube, Scott, Bulls, Giant, KTM – bolti ár töredékéért. Kápolnásnyék, személyes megtekintés rugalmasan.',
  keywords: 'outlet kerékpár, használt kerékpár, Cube, Scott, Bulls, Giant, KTM, kerékpár garancia, Kápolnásnyék, ebike, mountain bike, trekking, bringabarát, kápolnásnyék kerékpár, velence kerékpár',
  openGraph: {
    title: 'Bringabarát – Prémium kerékpárok garanciával',
    description: 'Cube, Scott, Bulls, Giant – átvilágítva, garanciával, tisztességes áron.',
    type: 'website',
    locale: 'hu_HU',
    url: 'https://testbikevelence.hu',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://testbikevelence.hu',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hu">
      <body>
        {children}
        <CookieBanner />
        <ChatBot />
        <Analytics />
      </body>
    </html>
  )
}
