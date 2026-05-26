'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Phone, Menu, X, ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const NAV_PRIMARY = [
  { label: 'Ebike',    href: '/ebike' },
  { label: 'MTB',      href: '/mtb' },
  { label: 'Trekking', href: '/trekking' },
]

const NAV_DROPDOWN = [
  { label: 'Gravel',    href: '/gravel' },
  { label: 'Gyerek',   href: '/gyerek' },
  { label: 'Országúti', href: '/orszaguti' },
  { label: 'Kemping',  href: '/kemping' },
]

const NAV_EXTRA = [
  { label: 'Alkatrészek', href: '/alkatreszek' },
  { label: 'Ruházat',     href: '/ruhazat' },
]

const NAV_RIGHT = [
  { label: 'Mérettáblázat', href: '/#merettablazat' },
  { label: 'Méretkereső', href: '/#meretkereso' },
  { label: 'Garancia', href: '/garancia' },
  { label: 'GYIK', href: '/faq' },
  { label: 'Rólunk', href: '/rolunk' },
  { label: 'Kapcsolat', href: '/kapcsolat' },
]

const NAV_MOBILE = [
  ...NAV_PRIMARY,
  { label: 'Összes kerékpár', href: '/osszes-kerekpar' },
  ...NAV_DROPDOWN,
  ...NAV_EXTRA,
  ...NAV_RIGHT,
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [hiddenSlugs, setHiddenSlugs] = useState<string[] | null>(null)

  useEffect(() => {
    supabase.from('categories').select('slug,visible').then(({ data, error }) => {
      if (!error && data) setHiddenSlugs(data.filter(c => !c.visible).map(c => c.slug))
    })
  }, [])

  const isVisible = (href: string) => {
    if (!hiddenSlugs) return true
    const slug = href.replace('/', '')
    return !hiddenSlugs.includes(slug)
  }

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  function openDrop() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setDropOpen(true)
  }

  function closeDrop() {
    closeTimer.current = setTimeout(() => setDropOpen(false), 150)
  }

  const textColor = scrolled ? 'rgba(17,17,17,0.5)' : 'rgba(255,255,255,0.85)'
  const hoverColor = scrolled ? '#111111' : '#ffffff'
  const hoverBg = scrolled ? '#f5f5f5' : 'rgba(255,255,255,0.12)'
  const logoMainColor = scrolled ? '#111111' : '#ffffff'
  const logoSubColor = scrolled ? 'rgba(17,17,17,0.38)' : 'rgba(255,255,255,0.5)'

  const linkStyle: React.CSSProperties = {
    display: 'block', padding: '6px 12px',
    fontSize: '13px', fontWeight: 500,
    color: textColor,
    textDecoration: 'none',
    borderRadius: '6px',
    transition: 'color 0.15s, background 0.15s',
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? '#ffffff' : 'rgba(0,0,0,0.3)',
      backdropFilter: scrolled ? 'none' : 'blur(8px)',
      WebkitBackdropFilter: scrolled ? 'none' : 'blur(8px)',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        padding: '0 3rem', height: '64px',
        display: 'flex', alignItems: 'center', gap: '1.5rem',
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ lineHeight: 1.15 }}>
            <div style={{
              fontSize: '17px', fontWeight: 900,
              letterSpacing: '-0.035em', color: logoMainColor,
              transition: 'color 0.3s ease',
            }}>Bringabarát</div>
            <div style={{
              fontSize: '10px', fontWeight: 500,
              letterSpacing: '0.01em', color: logoSubColor,
              transition: 'color 0.3s ease',
            }}>Kápolnásnyék · Velence</div>
          </div>
        </Link>

        {/* Desktop left nav */}
        <ul className="desk-nav" style={{
          display: 'flex', listStyle: 'none',
          gap: '0.25rem', flex: 1, alignItems: 'center',
        }}>
          {/* Primary links */}
          {NAV_PRIMARY.map(item => (
            <li key={item.label}>
              <Link href={item.href} style={linkStyle}
                onMouseEnter={e => {
                  e.currentTarget.style.color = hoverColor
                  e.currentTarget.style.background = hoverBg
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = textColor
                  e.currentTarget.style.background = 'transparent'
                }}
              >{item.label}</Link>
            </li>
          ))}

          {/* Összes kerékpár dropdown */}
          <li
            style={{ position: 'relative' }}
            onMouseEnter={openDrop}
            onMouseLeave={closeDrop}
          >
            <button style={{
              ...linkStyle,
              display: 'flex', alignItems: 'center', gap: '4px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit',
              color: dropOpen ? hoverColor : textColor,
            }}>
              Összes kerékpár
              <ChevronDown size={13} style={{
                transition: 'transform 0.2s',
                transform: dropOpen ? 'rotate(180deg)' : 'none',
              }} />
            </button>

            {/* Dropdown panel — always rendered for CSS transitions */}
            <div
              onMouseEnter={openDrop}
              onMouseLeave={closeDrop}
              style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: 0,
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.07)',
                borderRadius: '12px',
                padding: '6px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                minWidth: '172px', zIndex: 200,
                opacity: dropOpen ? 1 : 0,
                transform: dropOpen ? 'translateY(0)' : 'translateY(-8px)',
                pointerEvents: dropOpen ? 'auto' : 'none',
                transition: 'opacity 0.2s ease, transform 0.2s ease',
              }}
            >
              <Link href="/osszes-kerekpar" onClick={() => setDropOpen(false)} style={{
                display: 'block', padding: '9px 16px 11px',
                fontSize: '13px', fontWeight: 600,
                color: '#111111', textDecoration: 'none',
                borderRadius: '7px', marginBottom: '4px',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
              }}>Összes kerékpár</Link>

              {NAV_DROPDOWN.filter(item => isVisible(item.href)).map(item => (
                <Link key={item.label} href={item.href}
                  onClick={() => setDropOpen(false)}
                  style={{
                    display: 'block', padding: '10px 16px',
                    fontSize: '13px', fontWeight: 500,
                    color: 'rgba(17,17,17,0.65)',
                    textDecoration: 'none', borderRadius: '7px',
                    transition: 'background 0.15s, color 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#fafaf8'
                    e.currentTarget.style.color = '#111111'
                    e.currentTarget.style.boxShadow = 'inset 3px 0 0 #e8c547'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'rgba(17,17,17,0.65)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >{item.label}</Link>
              ))}
            </div>
          </li>

          {/* Alkatrészek + Ruházat as direct links */}
          {NAV_EXTRA.filter(item => isVisible(item.href)).map(item => (
            <li key={item.label}>
              <Link href={item.href} style={linkStyle}
                onMouseEnter={e => {
                  e.currentTarget.style.color = hoverColor
                  e.currentTarget.style.background = hoverBg
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = textColor
                  e.currentTarget.style.background = 'transparent'
                }}
              >{item.label}</Link>
            </li>
          ))}
        </ul>

        {/* Desktop right nav + CTA */}
        <div className="desk-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
          {NAV_RIGHT.map(item => (
            <Link key={item.label} href={item.href} style={linkStyle}
              onMouseEnter={e => {
                e.currentTarget.style.color = hoverColor
                e.currentTarget.style.background = hoverBg
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = textColor
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
            marginLeft: '10px',
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
          cursor: 'pointer', padding: '6px',
          color: scrolled ? '#111111' : '#ffffff',
          borderRadius: '6px', marginLeft: 'auto',
          transition: 'color 0.3s ease',
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
          {NAV_MOBILE.filter(item => isVisible(item.href)).map(item => (
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
