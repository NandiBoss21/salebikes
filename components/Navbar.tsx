'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Phone } from 'lucide-react'

const categories = [
  { label: 'Ebike', href: '/?kategoria=ebike' },
  { label: 'MTB', href: '/?kategoria=mtb' },
  { label: 'Trekking', href: '/?kategoria=trekking' },
  { label: 'Gravel', href: '/?kategoria=gravel' },
  { label: 'Gyerek', href: '/?kategoria=gyerek' },
  { label: 'Rólunk', href: '/rolunk' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: '#0a0a0a',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.1rem 2rem',
        maxWidth: '1400px', margin: '0 auto',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900, fontSize: '22px',
            letterSpacing: '0.05em', textTransform: 'uppercase',
            color: '#f0ede8',
          }}>
            Sale<span style={{ color: '#e8c547' }}>Bikes</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul style={{
          display: 'flex', gap: '2rem', listStyle: 'none',
          alignItems: 'center',
        }} className="desktop-nav">
          {categories.map(c => (
            <li key={c.label}>
              <Link href={c.href} style={{
                fontSize: '13px', fontWeight: 500,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(240,237,232,0.6)', textDecoration: 'none',
              }}>{c.label}</Link>
            </li>
          ))}
        </ul>

        <a href="tel:+36308897559" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: '#e8c547', color: '#0a0a0a',
          padding: '10px 20px', borderRadius: '2px',
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 700, fontSize: '14px',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          textDecoration: 'none',
        }}>
          <Phone size={16} />
          Hívj most
        </a>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          style={{
            display: 'none', background: 'none', border: 'none',
            color: '#f0ede8', cursor: 'pointer',
          }}
          className="mobile-menu-btn"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: '#111', borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '1rem 2rem',
        }}>
          {categories.map(c => (
            <Link key={c.label} href={c.href} onClick={() => setOpen(false)} style={{
              display: 'block', padding: '12px 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              fontSize: '15px', fontWeight: 500,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'rgba(240,237,232,0.7)', textDecoration: 'none',
            }}>{c.label}</Link>
          ))}
          <a href="tel:+36308897559" style={{
            display: 'block', marginTop: '1rem',
            background: '#e8c547', color: '#0a0a0a',
            padding: '12px', textAlign: 'center',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700, fontSize: '15px',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            textDecoration: 'none', borderRadius: '2px',
          }}>📞 +36 30 889 7559</a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
