'use client'
import { motion } from 'framer-motion'
import type { ReactNode, CSSProperties } from 'react'

interface Props {
  children: ReactNode
  delay?: number
  className?: string
  style?: CSSProperties
  from?: 'bottom' | 'left' | 'right'
}

export default function AnimatedSection({ children, delay = 0, className, style, from = 'bottom' }: Props) {
  const initial = {
    opacity: 0,
    y: from === 'bottom' ? 40 : 0,
    x: from === 'left' ? -30 : from === 'right' ? 30 : 0,
  }

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
