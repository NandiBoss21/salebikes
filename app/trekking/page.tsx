import CategoryPage from '@/components/CategoryPage'
import type { Metadata } from 'next'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Outlet Trekking kerékpárok | SaleBikes',
  description: 'Prémium outlet és használt trekking kerékpárok 3 hónap garanciával. Cube, Giant, KTM – bolti ár töredékéért.',
}

export default function TrekkingPage() {
  return <CategoryPage category="trekking" label="Trekking" />
}
