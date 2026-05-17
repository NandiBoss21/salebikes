'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Phone } from 'lucide-react'

const categories = [
  { label: 'Ebike', href: '/ebike' },
  { label: 'MTB', href: '/mtb' },
  { label: 'Trekking', href: '/trekking' },
  { label: 'Gravel', href: '/gravel' },
  { label: 'Gyerek', href: '/gyerek' },
  { label: 'Rólunk', href: '/rolunk' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: '#ffffff',
      borderBottom: '1px solid rgba(0,0,0,0.07)',
      boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.07)' : 'none',
      transition: 'box-shadow 0.3s ease',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        maxWidth: '1400px', margin: '0 auto',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900, fontSize: '22px',
            letterSpacing: '0.05em', textTransform: 'uppercase',
            color: '#0a0a0a',
          }}>
            Sale<span style={{ color: '#e8c547' }}>Bikes</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul style={{
          display: 'flex', gap: '2rem', listStyle: 'none', alignItems: 'center',
        }} className="desktop-nav">
          {categories.map(c => (
            <li key={c.label}>
              <Link href={c.href} style={{
                fontSize: '12px', fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'rgba(10,10,10,0.5)', textDecoration: 'none',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = '#0a0a0a')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(10,10,10,0.5)')}
              >{c.label}</Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a href="tel:+36308897559" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: '#e8c547', color: '#0a0a0a',
          padding: '10px 20px', borderRadius: '3px',
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 700, fontSize: '14px',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          textDecoration: 'none',
        }} className="desktop-nav">
          <Phone size={15} />
          Hívj most
        </a>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          style={{
            display: 'none', background: 'none', border: 'none',
            color: '#0a0a0a', cursor: 'pointer', padding: '4px',
          }}
          className="mobile-menu-btn"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: '#ffffff',
          borderTop: '1px solid rgba(0,0,0,0.07)',
          padding: '1rem 2rem 1.5rem',
        }}>
          {categories.map(c => (
            <Link key={c.label} href={c.href} onClick={() => setOpen(false)} style={{
              display: 'block', padding: '13px 0',
              borderBottom: '1px solid rgba(0,0,0,0.05)',
              fontSize: '14px', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(10,10,10,0.6)', textDecoration: 'none',
            }}>{c.label}</Link>
          ))}
          <a href="tel:+36308897559" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', marginTop: '1.25rem',
            background: '#e8c547', color: '#0a0a0a',
            padding: '13px', textAlign: 'center',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700, fontSize: '15px',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            textDecoration: 'none', borderRadius: '3px',
          }}>
            <Phone size={16} /> +36 30 889 7559
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
