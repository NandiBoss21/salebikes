'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

function getSessionId(): string {
  try {
    let id = localStorage.getItem('_sid')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('_sid', id)
    }
    return id
  } catch { return 'unknown' }
}

export function usePageView(path: string, bikeId?: string) {
  useEffect(() => {
    const sessionId = getSessionId()
    supabase.from('page_views').insert({
      path,
      bike_id: bikeId ?? null,
      referrer: document.referrer || null,
      session_id: sessionId,
    }).then(() => {})
  }, [path, bikeId])
}
