'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, Menu, X } from 'lucide-react'

const NAV = [
  { label: 'Ebike',    href: '/ebike' },
  { label: 'MTB',      href: '/mtb' },
  { label: 'Trekking', href: '/trekking' },
  { label: 'Gravel',   href: '/gravel' },
  { label: 'Gyerek',   href: '/gyerek' },
  { label: 'Rólunk',   href: '/rolunk' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: '#ffffff',
      borderBottom: '1px solid rgba(0,0,0,0.08)',
      boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.06)' : 'none',
      transition: 'box-shadow 0.25s ease',
    }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '0 2rem', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ fontSize: '19px', fontWeight: 800, letterSpacing: '-0.03em', color: '#111111' }}>
            Sale<span style={{ color: '#e8c547' }}>Bikes</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="desk-nav" style={{
          display: 'flex', listStyle: 'none',
          gap: '4px', margin: '0 1.5rem',
        }}>
          {NAV.map(item => (
            <li key={item.label}>
              <Link href={item.href} style={{
                display: 'block', padding: '6px 14px',
                fontSize: '13px', fontWeight: 500,
                color: 'rgba(17,17,17,0.5)',
                textDecoration: 'none',
                borderRadius: '6px',
                transition: 'color 0.15s, background 0.15s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#111111'
                  e.currentTarget.style.background = '#f5f5f5'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'rgba(17,17,17,0.5)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >{item.label}</Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a href="tel:+36308897559" className="desk-nav" style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          background: '#e8c547', color: '#111111',
          padding: '9px 18px', borderRadius: '8px',
          fontSize: '13px', fontWeight: 700,
          letterSpacing: '-0.01em', textDecoration: 'none',
          flexShrink: 0,
          transition: 'background 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = '#d4b23e')}
          onMouseLeave={e => (e.currentTarget.style.background = '#e8c547')}
        >
          <Phone size={14} />
          Hívj most
        </a>

        {/* Mobile button */}
        <button onClick={() => setOpen(o => !o)} className="mob-btn" style={{
          display: 'none', alignItems: 'center', justifyContent: 'center',
          background: 'none', border: 'none',
          cursor: 'pointer', padding: '6px', color: '#111111',
          borderRadius: '6px',
        }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div style={{
          borderTop: '1px solid rgba(0,0,0,0.07)',
          background: '#ffffff',
          padding: '0.75rem 2rem 1.5rem',
        }}>
          {NAV.map(item => (
            <Link key={item.label} href={item.href} onClick={() => setOpen(false)} style={{
              display: 'block', padding: '13px 0',
              borderBottom: '1px solid rgba(0,0,0,0.05)',
              fontSize: '15px', fontWeight: 500,
              color: 'rgba(17,17,17,0.65)', textDecoration: 'none',
            }}>{item.label}</Link>
          ))}
          <a href="tel:+36308897559" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', marginTop: '1rem',
            background: '#e8c547', color: '#111111',
            padding: '14px', borderRadius: '8px',
            fontSize: '15px', fontWeight: 700,
            textDecoration: 'none',
          }}>
            <Phone size={16} />
            +36 30 889 7559
          </a>
        </div>
      )}
    </nav>
  )
}
