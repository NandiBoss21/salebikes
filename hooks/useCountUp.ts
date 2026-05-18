'use client'
import { useState, useEffect, useRef } from 'react'

export function useCountUp(target: number, duration = 2000) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const rafId = useRef<number>(0)

  useEffect(() => {
    const el = ref.current
    if (!el || target === 0) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect()
          const startTime = performance.now()
          const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 4)
            setValue(Math.round(target * eased))
            if (progress < 1) {
              rafId.current = requestAnimationFrame(tick)
            }
          }
          rafId.current = requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [target, duration])

  return { value, ref }
}
