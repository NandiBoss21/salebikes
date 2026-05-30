import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Összes kerékpár | Bringabarát Testbike',
  description: 'Outlet és használt kerékpárok egy helyen – Cube, Scott, Bulls, Giant, KTM és más prémium márkák. Szűrj kategória, ár és típus szerint. Kápolnásnyék.',
  alternates: { canonical: 'https://testbikevelence.hu/osszes-kerekpar' },
}

export default function OsszesKerekparLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
