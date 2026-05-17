'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import BikeCard from '@/components/BikeCard'
import { Phone } from 'lucide-react'
import type { Bike } from '@/lib/supabase'

const CATEGORIES = [
  { label: 'Ebike',    href: '/ebike',    bg: '#1a1a2e' },
  { label: 'MTB',      href: '/mtb',      bg: '#16213e' },
  { label: 'Trekking', href: '/trekking', bg: '#0f3460' },
  { label: 'Gravel',   href: '/gravel',   bg: '#533483' },
  { label: 'Gyerek',   href: '/gyerek',   bg: '#2b2d42' },
  { label: 'Összes',   href: '#termekek', bg: '#111111' },
]

const REVIEWS = [
  { text: 'Nagyon kedves és segítőkész kiszolgálásban volt részem. Széles választék, jó minőségű kerékpárok, barátságos hangulat. Bátran ajánlom mindenkinek, aki bringát keres!', name: 'Dávid S.' },
  { text: 'Hat bicikli vásárlásán vagyok túl tőlük és évek óta semmi gond semelyikkel. Korrekt!', name: 'Adrián' },
  { text: 'Nagyon jó kis bolt. Szuper bringákkal, kedves, segítőkész eladóval.', name: 'Kollár Gábor' },
]

function useAos(deps: unknown[]) {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target) }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    )
    document.querySelectorAll('.aos:not(.in-view)').forEach(el => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

function useCountUp(target: number, durationMs = 1400) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!target) return
    setVal(0)
    let frame = 0
    const totalFrames = Math.round(durationMs / 16)
    const id = setInterval(() => {
      frame++
      const t = Math.min(frame / totalFrames, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setVal(Math.round(target * eased))
      if (frame >= totalFrames) clearInterval(id)
    }, 16)
    return () => clearInterval(id)
  }, [target, durationMs])
  return val
}

export default function Home() {
  const [bikes, setBikes] = useState<Bike[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('bikes').select('*').eq('available', true)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => { setBikes((data || []) as Bike[]); setLoading(false) })
  }, [])

  useAos([])
  useAos([loading])

  const savingsTarget = !loading && bikes.length > 0
    ? Math.round(bikes.reduce((s, b) => s + (b.original_price - b.sale_price), 0) / bikes.length / 1000) * 1000
    : 180000
  const displaySavings = useCountUp(savingsTarget)

  return (
    <>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero-split" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>

        {/* Left – text */}
        <div style={{
          padding: 'clamp(3rem, 6vw, 5.5rem) clamp(2rem, 5vw, 5rem)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          background: '#ffffff',
        }}>
          <div className="aos" style={{
            fontSize: '11px', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'rgba(17,17,17,0.4)', marginBottom: '1.25rem',
          }}>
            Outlet · Bemutató · Használt
          </div>

          <h1 className="aos d1" style={{
            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            fontWeight: 900, letterSpacing: '-0.04em',
            lineHeight: 1.05, color: '#111111',
            marginBottom: '1.25rem',
          }}>
            Prémium kerékpárok<br />félár alatt
          </h1>

          <div className="aos d2" style={{
            display: 'flex', gap: '12px', flexWrap: 'wrap',
            fontSize: '13px', fontWeight: 500,
            color: 'rgba(17,17,17,0.45)',
            marginBottom: '2.25rem',
          }}>
            <span>1000+ eladás</span>
            <span style={{ color: 'rgba(17,17,17,0.18)' }}>·</span>
            <span>2008 óta</span>
            <span style={{ color: 'rgba(17,17,17,0.18)' }}>·</span>
            <span>3 hónap garancia</span>
          </div>

          <div className="aos d3" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a href="#termekek" style={{
              background: '#111111', color: '#ffffff',
              padding: '13px 24px', borderRadius: '8px',
              fontSize: '14px', fontWeight: 700,
              letterSpacing: '-0.02em', textDecoration: 'none',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#333')}
              onMouseLeave={e => (e.currentTarget.style.background = '#111111')}
            >Kerékpárok böngészése →</a>

            <a href="tel:+36308897559" style={{
              background: 'transparent', color: '#111111',
              border: '1.5px solid rgba(17,17,17,0.2)',
              padding: '13px 24px', borderRadius: '8px',
              fontSize: '14px', fontWeight: 600,
              letterSpacing: '-0.02em', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '7px',
              transition: 'border-color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#111111')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(17,17,17,0.2)')}
            >
              <Phone size={14} />+36 30 889 7559
            </a>
          </div>
        </div>

        {/* Right – animated savings panel */}
        <div className="hero-savings-panel" style={{
          background: '#e8c547',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '3rem 2rem', textAlign: 'center',
          gap: '0.5rem',
        }}>
          <div style={{
            fontSize: '12px', fontWeight: 700,
            color: 'rgba(17,17,17,0.5)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>Átlagos megtakarítás</div>

          <div style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 900, letterSpacing: '-0.05em',
            color: '#111111', lineHeight: 1.1,
          }}>
            {displaySavings.toLocaleString('hu-HU')} Ft
          </div>

          <div style={{
            fontSize: '13px', fontWeight: 500,
            color: 'rgba(17,17,17,0.5)',
          }}>vásárlásonként</div>

          <div style={{
            marginTop: '1.5rem',
            background: 'rgba(17,17,17,0.08)',
            borderRadius: '8px', padding: '1rem 1.25rem',
            fontSize: '12px', color: 'rgba(17,17,17,0.6)',
            lineHeight: 1.5, maxWidth: '220px',
          }}>
            Cube, Scott, Bulls, Giant, KTM kerékpárok bolti ár töredékéért
          </div>
        </div>
      </section>

      {/* ── CATEGORY GRID ────────────────────────────────── */}
      <section style={{ padding: '3rem 2rem', background: '#f9f9f9', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 className="aos" style={{
            fontSize: '15px', fontWeight: 700,
            letterSpacing: '-0.02em', color: '#111111',
            marginBottom: '1.25rem',
          }}>Kategóriák</h2>

          <div className="cat-grid">
            {CATEGORIES.map(cat => (
              <Link key={cat.label} href={cat.href} style={{
                position: 'relative', overflow: 'hidden',
                background: cat.bg,
                borderRadius: '10px',
                aspectRatio: '5/3',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '1.1rem 1.25rem',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.03)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.18)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.05) 60%)',
                }} />
                <span style={{
                  position: 'relative', zIndex: 1,
                  fontSize: '1.05rem', fontWeight: 800,
                  color: '#ffffff', letterSpacing: '-0.02em',
                }}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST STATS ──────────────────────────────────── */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          padding: '0 2rem',
        }}>
          {[
            { num: '1000+', sub: 'eladás 2008 óta' },
            { num: '3 hónap', sub: 'garancia minden bringára' },
            { num: '4.7 ★', sub: 'Google értékelés' },
          ].map((s, i) => (
            <div key={s.sub} className="aos" style={{
              textAlign: 'center',
              padding: '2.5rem 1.5rem',
              borderRight: i < 2 ? '1px solid rgba(0,0,0,0.07)' : 'none',
            }}>
              <div style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                fontWeight: 900, letterSpacing: '-0.04em',
                color: '#111111', lineHeight: 1, marginBottom: '6px',
              }}>{s.num}</div>
              <div style={{
                fontSize: '12px', fontWeight: 500,
                color: 'rgba(17,17,17,0.4)',
              }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUCTS ─────────────────────────────────────── */}
      <section id="termekek" style={{ padding: '4rem 2rem 5rem', background: '#f9f9f9' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          <h2 className="aos" style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 800, letterSpacing: '-0.04em',
            color: '#111111', marginBottom: '2rem',
          }}>Elérhető kerékpárok</h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'rgba(17,17,17,0.3)', fontSize: '14px' }}>
              Betöltés…
            </div>
          ) : bikes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'rgba(17,17,17,0.4)' }}>
              <div style={{ fontSize: '40px', marginBottom: '1rem' }}>🚲</div>
              <div style={{ fontSize: '16px', fontWeight: 500 }}>Jelenleg nincs elérhető kerékpár.</div>
            </div>
          ) : (
            <>
              <div style={{
                fontSize: '12px', color: 'rgba(17,17,17,0.4)',
                marginBottom: '1.5rem', fontWeight: 500,
              }}>{bikes.length} kerékpár elérhető</div>
              <div className="bikes-grid">
                {bikes.map((bike, i) => (
                  <div key={bike.id} className={`aos d${Math.min((i % 3) + 1, 5)}`}>
                    <BikeCard bike={bike} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── REVIEWS ──────────────────────────────────────── */}
      <section style={{ background: '#ffffff', padding: '5rem 2rem', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="aos" style={{ marginBottom: '2.5rem' }}>
            <div style={{
              fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'rgba(17,17,17,0.35)', marginBottom: '8px',
            }}>Vevői vélemények</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                fontWeight: 900, letterSpacing: '-0.04em',
                color: '#111111',
              }}>4.7</span>
              <span style={{ fontSize: '22px', color: '#e8c547', letterSpacing: '2px' }}>★★★★★</span>
              <a
                href="https://www.google.com/maps/search/Bringabarát+Tesztbike+Kápolnásnyék"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '13px', fontWeight: 500,
                  color: 'rgba(17,17,17,0.4)',
                  textDecoration: 'underline',
                }}
              >7 Google értékelés</a>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}>
            {REVIEWS.map((r, i) => (
              <div key={i} className={`aos d${i + 1}`} style={{
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.07)',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <div style={{ fontSize: '15px', color: '#e8c547', marginBottom: '12px', letterSpacing: '2px' }}>★★★★★</div>
                <p style={{
                  fontSize: '14px', lineHeight: 1.7,
                  color: 'rgba(17,17,17,0.65)',
                  marginBottom: '1.25rem',
                  fontStyle: 'italic',
                }}>„{r.text}"</p>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111111' }}>{r.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer style={{
        background: '#111111', color: '#ffffff',
        padding: 'clamp(2.5rem, 5vw, 4rem) 2rem',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '2rem',
          paddingBottom: '2rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div>
            <div style={{
              fontSize: '18px', fontWeight: 800,
              letterSpacing: '-0.03em', marginBottom: '0.75rem',
            }}>Sale<span style={{ color: '#e8c547' }}>Bikes</span></div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
              Bringabarát Tesztbike<br />
              Kápolnásnyék, Tó utca 6 · 2475
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href="tel:+36308897559" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>+36 30 889 7559</a>
            <a href="mailto:ht.bike@hotmail.com" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>ht.bike@hotmail.com</a>
            <a href="/rolunk" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Rólunk</a>
          </div>
        </div>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          paddingTop: '1.5rem',
          fontSize: '12px', color: 'rgba(255,255,255,0.25)',
        }}>© 2025 SaleBikes · Bringabarát Tesztbike</div>
      </footer>

      {/* ── STICKY MOBILE CTA ────────────────────────────── */}
      <a href="tel:+36308897559" className="mobile-cta" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: '#e8c547', color: '#111111',
        alignItems: 'center', justifyContent: 'center',
        gap: '10px', padding: '16px',
        fontSize: '15px', fontWeight: 700,
        letterSpacing: '-0.01em', textDecoration: 'none',
      }}>
        <Phone size={17} />
        Hívj most · +36 30 889 7559
      </a>
    </>
  )
}
