import CategoryPage from '@/components/CategoryPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kerékpár alkatrészek | Bringabarát',
  description: 'Prémium kerékpár alkatrészek és kiegészítők. Shimano, Bosch, SRAM – kedvező áron.',
}

export default function AlkatreszekPage() {
  return <CategoryPage category="alkatreszek" label="Alkatrészek" suffix="" />
}
