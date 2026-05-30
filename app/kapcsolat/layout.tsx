import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kapcsolat & Szállítás | Bringabarát Testbike',
  description: 'Vedd fel velünk a kapcsolatot! Személyes megtekintés előzetes egyeztetéssel. Telefon: +36 30 889 7559. Kápolnásnyék, Tó utca 6.',
  alternates: { canonical: 'https://testbikevelence.hu/kapcsolat' },
}

export default function KapcsolatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
