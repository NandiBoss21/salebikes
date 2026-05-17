import CategoryPage from '@/components/CategoryPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Outlet MTB kerékpárok | SaleBikes',
  description: 'Prémium outlet és használt mountain bike kerékpárok 3 hónap garanciával. Cube, Scott, Bulls – bolti ár töredékéért.',
}

export default function MtbPage() {
  return <CategoryPage category="mtb" label="MTB" />
}
