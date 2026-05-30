'use client'
import { useEffect, useRef } from 'react'
import type { ReactNode, CSSProperties } from 'react'

interface Props {
  children: ReactNode
  delay?: number
  className?: string
  style?: CSSProperties
  from?: 'bottom' | 'left' | 'right'
}

export default function AnimatedSection({ children, delay = 0, className, style, from = 'bottom' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'none'
          io.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -100px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: from === 'bottom' ? 'translateY(40px)' : from === 'left' ? 'translateX(-30px)' : 'translateX(30px)',
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
