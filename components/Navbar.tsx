'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, Menu, X, ChevronDown } from 'lucide-react'

const NAV_PRIMARY = [
  { label: 'Ebike',    href: '/ebike' },
  { label: 'MTB',      href: '/mtb' },
  { label: 'Trekking', href: '/trekking' },
]

const NAV_DROPDOWN = [
  { label: 'Gravel',    href: '/gravel' },
  { label: 'Gyerek',   href: '/gyerek' },
  { label: 'Országúti',href: '/orszaguti' },
  { label: 'Kemping',  href: '/kemping' },
]

const NAV_RIGHT = [
  { label: 'Mérettáblázat', href: '/#merettablazat' },
  { label: 'Rólunk', href: '/rolunk' },
  { label: 'Kapcsolat', href: '/kapcsolat' },
]

const NAV_MOBILE = [
  ...NAV_PRIMARY,
  ...NAV_DROPDOWN,
  { label: 'Összes kerékpár', href: '/' },
  ...NAV_RIGHT,
]

const linkStyle: React.CSSProperties = {
  display: 'block', padding: '6px 12px',
  fontSize: '13px', fontWeight: 500,
  color: 'rgba(17,17,17,0.5)',
  textDecoration: 'none',
  borderRadius: '6px',
  transition: 'color 0.15s, background 0.15s',
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: scrolled ? 'rgba(255,255,255,0.85)' : '#ffffff',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.07)' : 'none',
      boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,0.06)' : 'none',
      transition: 'background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
    }}>
      <div style={{
        maxWidth: '1360px', margin: '0 auto',
        padding: '0 clamp(1.5rem, 4vw, 3rem)', height: '64px',
        display: 'flex', alignItems: 'center', gap: '1.5rem',
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ lineHeight: 1.15 }}>
            <div style={{
              fontSize: '17px', fontWeight: 900,
              letterSpacing: '-0.035em', color: '#111111',
            }}>Bringabarát</div>
            <div style={{
              fontSize: '10px', fontWeight: 500,
              letterSpacing: '0.01em', color: 'rgba(17,17,17,0.38)',
            }}>Kápolnásnyék · Velence</div>
          </div>
        </Link>

        {/* Desktop left nav */}
        <ul className="desk-nav" style={{
          display: 'flex', listStyle: 'none',
          gap: '2px', flex: 1,
        }}>
          {NAV_PRIMARY.map(item => (
            <li key={item.label}>
              <Link href={item.href} style={linkStyle}
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

          {/* Összes kerékpár dropdown */}
          <li
            style={{ position: 'relative' }}
            onMouseEnter={() => setDropOpen(true)}
            onMouseLeave={() => setDropOpen(false)}
          >
            <button style={{
              ...linkStyle,
              display: 'flex', alignItems: 'center', gap: '4px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit',
              color: dropOpen ? '#111111' : 'rgba(17,17,17,0.5)',
            }}>
              Összes kerékpár
              <ChevronDown size={13} style={{
                transition: 'transform 0.2s',
                transform: dropOpen ? 'rotate(180deg)' : 'none',
              }} />
            </button>

            {dropOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 4px)', left: 0,
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '10px',
                padding: '6px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                minWidth: '160px', zIndex: 200,
              }}>
                <Link href="/" style={{
                  display: 'block', padding: '8px 12px 12px',
                  fontSize: '13px', fontWeight: 600,
                  color: '#111111', textDecoration: 'none',
                  borderRadius: '6px', marginBottom: '6px',
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                }}>Összes kerékpár</Link>
                {NAV_DROPDOWN.map(item => (
                  <Link key={item.label} href={item.href}
                    onClick={() => setDropOpen(false)}
                    style={{
                      display: 'block', padding: '8px 12px',
                      fontSize: '13px', fontWeight: 500,
                      color: 'rgba(17,17,17,0.65)',
                      textDecoration: 'none', borderRadius: '6px',
                      transition: 'background 0.1s, color 0.1s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#f5f5f5'
                      e.currentTarget.style.color = '#111111'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'rgba(17,17,17,0.65)'
                    }}
                  >{item.label}</Link>
                ))}
              </div>
            )}
          </li>
        </ul>

        {/* Desktop right nav + CTA */}
        <div className="desk-nav" style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
          {NAV_RIGHT.map(item => (
            <Link key={item.label} href={item.href} style={linkStyle}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#111111'
                e.currentTarget.style.background = '#f5f5f5'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'rgba(17,17,17,0.5)'
                e.currentTarget.style.background = 'transparent'
              }}
            >{item.label}</Link>
          ))}

          <a href="tel:+36308897559" style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            background: '#e8c547', color: '#111111',
            padding: '9px 18px', borderRadius: '8px',
            fontSize: '13px', fontWeight: 700,
            letterSpacing: '-0.01em', textDecoration: 'none',
            marginLeft: '6px',
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = '#d4b23e')}
            onMouseLeave={e => (e.currentTarget.style.background = '#e8c547')}
          >
            <Phone size={14} />
            Hívj most
          </a>
        </div>

        {/* Mobile button */}
        <button onClick={() => setOpen(o => !o)} className="mob-btn" style={{
          display: 'none', alignItems: 'center', justifyContent: 'center',
          background: 'none', border: 'none',
          cursor: 'pointer', padding: '6px', color: '#111111',
          borderRadius: '6px', marginLeft: 'auto',
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
          {NAV_MOBILE.map(item => (
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
