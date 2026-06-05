'use client'
import { useEffect } from 'react'

// iOS Safari restores pages from the Back/Forward Cache (bfcache) without
// re-running React hydration. This can leave CSS animations in a mid-state
// and cause touch events to stop registering. Reloading on bfcache
// restoration gives the user a fresh, interactive page.
export default function PageshowFix() {
  useEffect(() => {
    const handler = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload()
    }
    window.addEventListener('pageshow', handler)
    return () => window.removeEventListener('pageshow', handler)
  }, [])
  return null
}
