import CategoryPage from '@/components/CategoryPage'
import type { Metadata } from 'next'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Outlet Gravel kerékpárok | SaleBikes',
  description: 'Prémium outlet és használt gravel kerékpárok 3 hónap garanciával. Scott, Cube, Genesis – bolti ár töredékéért.',
}

export default function GravelPage() {
  return <CategoryPage category="gravel" label="Gravel" />
}
