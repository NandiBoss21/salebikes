import CategoryPage from '@/components/CategoryPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kerékpáros ruházat | Bringabarát',
  description: 'Prémium kerékpáros ruházat és felszerelések. Bukósisak, dzsörzé, nadrág – kedvező áron.',
}

export default function RuhazatPage() {
  return <CategoryPage category="ruhazat" label="Ruházat" />
}
