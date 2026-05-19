import CategoryPage from '@/components/CategoryPage'
import type { Metadata } from 'next'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Outlet Gyerek kerékpárok | SaleBikes',
  description: 'Prémium outlet és használt gyerek kerékpárok 3 hónap garanciával. Cube, Scott – bolti ár töredékéért.',
}

export default function GyerekPage() {
  return <CategoryPage category="gyerek" label="Gyerek" />
}
