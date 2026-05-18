import { useEffect, useRef } from 'react'

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(delay?: number) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.classList.add('aos')
    if (delay) el.style.transitionDelay = `${delay}s`

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view')
          io.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [delay])

  return ref
}
