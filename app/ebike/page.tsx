import CategoryPage from '@/components/CategoryPage'
import type { Metadata } from 'next'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Outlet Ebike kerékpárok | SaleBikes',
  description: 'Prémium outlet és használt ebike kerékpárok 3 hónap garanciával. Bosch, Shimano, Yamaha motorok – bolti ár töredékéért.',
}

export default function EbikePage() {
  return <CategoryPage category="ebike" label="Ebike" />
}
