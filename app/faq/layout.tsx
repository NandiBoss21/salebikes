import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GYIK – Gyakori kérdések | Bringabarát Testbike',
  description: 'Tudnivalók kerékpár vásárlásról, garanciáról, szállításról és személyes megtekintésről. Bringabarát Testbike, Kápolnásnyék.',
  alternates: { canonical: 'https://testbikevelence.hu/faq' },
}

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
