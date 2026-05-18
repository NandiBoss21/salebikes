import CategoryPage from '@/components/CategoryPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Outlet Országúti kerékpárok | Bringabarát',
  description: 'Prémium outlet és használt országúti kerékpárok 3 hónap garanciával. Scott, Giant, Cube – bolti ár töredékéért.',
}

export default function OrszagutiPage() {
  return <CategoryPage category="orszaguti" label="Országúti" />
}
