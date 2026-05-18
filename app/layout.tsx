import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'Outlet és használt kerékpárok félár alatt | SaleBikes – Bringabarát',
  description: 'Prémium outlet és használt kerékpárok 3 hónap garanciával. Cube, Scott, Bulls, Giant, KTM – bolti ár töredékéért. Kápolnásnyék, személyes megtekintés rugalmasan.',
  keywords: 'outlet kerékpár, használt kerékpár, Cube, Scott, Bulls, Giant, KTM, kerékpár garancia, Kápolnásnyék, ebike, mountain bike, trekking',
  openGraph: {
    title: 'SaleBikes – Prémium outlet kerékpárok félár alatt',
    description: 'Cube, Scott, Bulls, Giant – 3 hónap garanciával, bolti ár töredékéért.',
    type: 'website',
    locale: 'hu_HU',
    url: 'https://salebikes.hu',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://salebikes.hu',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hu">
      <body>{children}</body>
    </html>
  )
}
