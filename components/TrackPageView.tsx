'use client'
import { usePageView } from '@/hooks/usePageView'

export default function TrackPageView({ path, bikeId }: { path: string; bikeId?: string }) {
  usePageView(path, bikeId)
  return null
}
