import CategoryPage from '@/components/CategoryPage'
import type { Metadata } from 'next'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Outlet Kemping kerékpárok | Bringabarát',
  description: 'Prémium outlet és használt kemping kerékpárok 3 hónap garanciával. Strapabíró túrakerékpárok bolti ár töredékéért.',
}

export default function KempingPage() {
  return <CategoryPage category="kemping" label="Kemping" />
}
