'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import BikeCard from '@/components/BikeCard'
import { Phone } from 'lucide-react'
import type { Bike } from '@/lib/supabase'

const CATEGORIES = [
  { label: 'Ebike',    href: '/ebike',    gradient: 'linear-gradient(145deg, #0d1f3c 0%, #1a3a6b 45%, #0a1628 100%)' },
  { label: 'MTB',      href: '/mtb',      gradient: 'linear-gradient(145deg, #0a1a0d 0%, #18351e 45%, #0a1510 100%)' },
  { label: 'Trekking', href: '/trekking', gradient: 'linear-gradient(145deg, #0f1a2e 0%, #1a2d4a 45%, #0c1525 100%)' },
  { label: 'Gravel',   href: '/gravel',   gradient: 'linear-gradient(145deg, #1c1200 0%, #302000 45%, #151000 100%)' },
  { label: 'Gyerek',   href: '/gyerek',   gradient: 'linear-gradient(145deg, #1a0a2e 0%, #2d1357 45%, #110828 100%)' },
  { label: 'Összes',   href: '#termekek', gradient: 'linear-gradient(145deg, #111111 0%, #2a2a2a 45%, #111111 100%)' },
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

function useCountUp(target: number, durationMs = 1600) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!target) return
    setVal(0)
    let frame = 0
    const totalFrames = Math.round(durationMs / 16)
    const id = setInterval(() => {
      frame++
      const t = Math.min(frame / totalFrames, 1)
      const eased = 1 - Math.pow(1 - t, 4)
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

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="hero-split" style={{
        backgroundImage: 'url(/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>

        {/* Left – text over dark overlay */}
        <div style={{
          padding: 'clamp(3.5rem, 7vw, 6rem) clamp(2rem, 5vw, 5.5rem)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          background: 'rgba(0,0,0,0.55)',
        }}>
          <div className="aos" style={{
            fontSize: '10.5px', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{
              display: 'inline-block', width: '24px', height: '2px',
              background: '#e8c547', flexShrink: 0,
            }} />
            Outlet · Bemutató · Használt
          </div>

          <h1 className="aos d1" style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
            fontWeight: 900, letterSpacing: '-0.045em',
            lineHeight: 1.02, color: '#ffffff',
            marginBottom: '1.75rem',
          }}>
            Prémium<br />
            kerékpárok<br />
            félár alatt
          </h1>

          <div className="aos d2" style={{
            display: 'flex', gap: '14px', flexWrap: 'wrap',
            alignItems: 'center',
            fontSize: '12.5px', fontWeight: 500,
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '2.5rem',
          }}>
            <span>1000+ eladás</span>
            <span style={{
              display: 'inline-block', width: '3px', height: '3px',
              borderRadius: '50%', background: 'rgba(255,255,255,0.3)', flexShrink: 0,
            }} />
            <span>2008 óta</span>
            <span style={{
              display: 'inline-block', width: '3px', height: '3px',
              borderRadius: '50%', background: 'rgba(255,255,255,0.3)', flexShrink: 0,
            }} />
            <span>3 hónap garancia</span>
          </div>

          <div className="aos d3" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a href="#termekek" style={{
              background: '#e8c547', color: '#111111',
              padding: '14px 26px', borderRadius: '6px',
              fontSize: '13.5px', fontWeight: 700,
              letterSpacing: '-0.02em', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#d4b23e')}
              onMouseLeave={e => (e.currentTarget.style.background = '#e8c547')}
            >
              Böngéssz most <span style={{ fontSize: '16px' }}>→</span>
            </a>

            <a href="tel:+36308897559" style={{
              background: 'transparent', color: '#ffffff',
              border: '1.5px solid rgba(255,255,255,0.35)',
              padding: '14px 22px', borderRadius: '6px',
              fontSize: '13.5px', fontWeight: 600,
              letterSpacing: '-0.02em', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <Phone size={13} />
              +36 30 889 7559
            </a>
          </div>
        </div>

        {/* Right – savings panel */}
        <div className="hero-savings-panel" style={{
          background: '#e8c547',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '3.5rem 2.5rem', textAlign: 'center',
          gap: '0.6rem', overflow: 'hidden',
          position: 'sticky', top: 0, height: '100vh', alignSelf: 'start',
        }}>
          <div style={{
            position: 'absolute', top: '-50px', right: '-50px',
            width: '220px', height: '220px', borderRadius: '50%',
            border: '45px solid rgba(17,17,17,0.05)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-70px', left: '-35px',
            width: '200px', height: '200px', borderRadius: '50%',
            border: '45px solid rgba(17,17,17,0.04)',
            pointerEvents: 'none',
          }} />

          <div style={{
            fontSize: '10px', fontWeight: 800,
            color: 'rgba(17,17,17,0.5)',
            textTransform: 'uppercase', letterSpacing: '0.12em',
            position: 'relative',
          }}>Átlagos megtakarítás</div>

          <div style={{
            fontSize: 'clamp(2.75rem, 5.5vw, 5rem)',
            fontWeight: 900, letterSpacing: '-0.055em',
            color: '#111111', lineHeight: 1.0,
            fontVariantNumeric: 'tabular-nums',
            position: 'relative',
          }}>
            {displaySavings.toLocaleString('hu-HU')}
          </div>

          <div style={{
            fontSize: '17px', fontWeight: 700,
            color: 'rgba(17,17,17,0.55)',
            letterSpacing: '-0.02em',
            position: 'relative',
          }}>Ft · vásárlásonként</div>

          <div style={{
            marginTop: '1.75rem',
            background: 'rgba(17,17,17,0.1)',
            borderRadius: '6px', padding: '1rem 1.25rem',
            fontSize: '12px', color: 'rgba(17,17,17,0.65)',
            lineHeight: 1.7, maxWidth: '210px',
            position: 'relative',
          }}>
            Cube · Scott · Bulls<br />Giant · KTM · Specialized
          </div>
        </div>
      </section>

      {/* ── GRADIENT BRIDGE: light → dark ────────────────────── */}
      <div style={{ height: '5rem', background: 'linear-gradient(to bottom, #FAFAF8, #111111)' }} />

      {/* ── CATEGORY GRID ──────────────────────────────────────── */}
      <section style={{
        padding: '0 clamp(1.5rem, 4vw, 3rem) clamp(3rem, 6vw, 5rem)',
        background: '#111111',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>

          <div className="aos" style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            marginBottom: '1.75rem',
          }}>
            <span style={{
              fontSize: '10px', fontWeight: 800,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
            }}>Kategóriák</span>
            <span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          </div>

          <div className="cat-grid">
            {CATEGORIES.map((cat, i) => (
              <Link key={cat.label} href={cat.href}
                className={`cat-card aos d${Math.min(i + 1, 5)}`}
                style={{
                  position: 'relative', overflow: 'hidden',
                  background: cat.gradient,
                  borderRadius: '8px',
                  aspectRatio: '4/3',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '1.25rem 1.5rem',
                }}
              >
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(ellipse at 25% 25%, rgba(255,255,255,0.04) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)',
                  pointerEvents: 'none',
                }} />
                <span style={{
                  position: 'relative', zIndex: 1,
                  fontSize: '1.15rem', fontWeight: 800,
                  color: '#ffffff', letterSpacing: '-0.025em',
                  lineHeight: 1.1,
                }}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST STATS ────────────────────────────────────────── */}
      <section style={{ background: '#F2F0EB', borderBottom: '1px solid rgba(17,17,17,0.08)' }}>
        <div style={{
          maxWidth: '1360px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          padding: '0 clamp(1.5rem, 4vw, 3rem)',
        }}>
          {[
            { num: '1000+', label: 'eladás 2008 óta', desc: 'Kerékpár gazdát cserélt' },
            { num: '3 hónap', label: 'garancia', desc: 'Minden bringára, kivétel nélkül' },
            { num: '4.7 ★', label: 'Google értékelés', desc: 'Valódi vásárlói visszajelzések' },
          ].map((s, i) => (
            <div key={s.label} className="aos" style={{
              textAlign: 'center',
              padding: 'clamp(2.5rem, 5vw, 4rem) 1.5rem',
              borderRight: i < 2 ? '1px solid rgba(17,17,17,0.1)' : 'none',
              display: 'flex', flexDirection: 'column', gap: '6px',
            }}>
              <div style={{
                fontSize: 'clamp(1.85rem, 3.5vw, 2.85rem)',
                fontWeight: 900, letterSpacing: '-0.05em',
                color: '#111111', lineHeight: 1,
              }}>{s.num}</div>
              <div style={{
                fontSize: '10.5px', fontWeight: 800,
                color: '#e8c547', textTransform: 'uppercase',
                letterSpacing: '0.08em', marginTop: '4px',
              }}>{s.label}</div>
              <div style={{
                fontSize: '12px', color: 'rgba(17,17,17,0.38)',
                lineHeight: 1.5,
              }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUCTS ───────────────────────────────────────────── */}
      <section id="termekek" style={{
        padding: 'clamp(1.75rem, 3vw, 2.5rem) clamp(1.5rem, 4vw, 3rem) clamp(3rem, 6vw, 5rem)',
        background: '#fafaf8',
      }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>

          <div className="aos" style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap',
            gap: '12px', marginBottom: '2.25rem',
          }}>
            <h2 style={{
              fontSize: 'clamp(1.4rem, 3vw, 2.1rem)',
              fontWeight: 900, letterSpacing: '-0.045em',
              color: '#111111',
            }}>Elérhető kerékpárok</h2>
            {!loading && bikes.length > 0 && (
              <span style={{
                fontSize: '12px', fontWeight: 600,
                color: 'rgba(17,17,17,0.35)',
                background: 'rgba(17,17,17,0.05)',
                padding: '6px 14px', borderRadius: '20px',
              }}>{bikes.length} db elérhető</span>
            )}
          </div>

          {loading ? (
            <div style={{
              textAlign: 'center', padding: '6rem 2rem',
              color: 'rgba(17,17,17,0.25)', fontSize: '13px',
              letterSpacing: '0.04em',
            }}>
              Betöltés…
            </div>
          ) : bikes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
              <div style={{ fontSize: '48px', marginBottom: '1rem', opacity: 0.25 }}>🚲</div>
              <div style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(17,17,17,0.4)' }}>
                Jelenleg nincs elérhető kerékpár.
              </div>
            </div>
          ) : (
            <div className="bikes-grid">
              {bikes.map((bike, i) => (
                <BikeCard key={bike.id} bike={bike} delay={(i % 3) * 0.08} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── REVIEWS ────────────────────────────────────────────── */}
      <section style={{
        background: '#F2F0EB',
        padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem)',
        borderTop: '1px solid rgba(17,17,17,0.08)',
      }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>

          <div className="aos" style={{ marginBottom: '2.5rem' }}>
            <div style={{
              fontSize: '10px', fontWeight: 800,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'rgba(17,17,17,0.35)', marginBottom: '1rem',
            }}>Vevői vélemények</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 900, letterSpacing: '-0.05em',
                color: '#111111', lineHeight: 1,
              }}>4.7</span>
              <span style={{ fontSize: '20px', color: '#e8c547', letterSpacing: '3px' }}>★★★★★</span>
              <a
                href="https://www.google.com/maps/search/Bringabarát+Tesztbike+Kápolnásnyék"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '12px', fontWeight: 600,
                  color: 'rgba(17,17,17,0.4)',
                  textDecoration: 'underline', textUnderlineOffset: '3px',
                }}
              >7 Google értékelés</a>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '1.25rem',
          }}>
            {REVIEWS.map((r, i) => (
              <div key={i} className={`aos d${i + 1}`} style={{
                background: '#ffffff',
                border: '1px solid rgba(17,17,17,0.08)',
                borderRadius: '10px',
                padding: '1.75rem',
                boxShadow: '0 1px 4px rgba(17,17,17,0.04)',
              }}>
                <div style={{ fontSize: '14px', color: '#e8c547', marginBottom: '14px', letterSpacing: '2px' }}>★★★★★</div>
                <p style={{
                  fontSize: '13.5px', lineHeight: 1.75,
                  color: 'rgba(17,17,17,0.65)',
                  marginBottom: '1.25rem',
                  fontStyle: 'italic',
                }}>„{r.text}"</p>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#111111' }}>{r.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer style={{
        background: '#111111', color: '#ffffff',
        padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2rem)',
      }}>
        <div style={{
          maxWidth: '1360px', margin: '0 auto',
          display: 'flex', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '2.5rem',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div>
            <div style={{
              fontSize: '20px', fontWeight: 900,
              letterSpacing: '-0.04em', marginBottom: '1rem',
            }}>Sale<span style={{ color: '#e8c547' }}>Bikes</span></div>
            <div style={{
              fontSize: '12.5px', color: 'rgba(255,255,255,0.35)',
              lineHeight: 1.8,
            }}>
              Bringabarát Tesztbike<br />
              Kápolnásnyék, Tó utca 6 · 2475
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a href="tel:+36308897559" style={{
              fontSize: '12.5px', color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none', transition: 'color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
            >+36 30 889 7559</a>
            <a href="mailto:ht.bike@hotmail.com" style={{
              fontSize: '12.5px', color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none', transition: 'color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
            >ht.bike@hotmail.com</a>
            <a href="/rolunk" style={{
              fontSize: '12.5px', color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none', transition: 'color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
            >Rólunk</a>
          </div>
        </div>
        <div style={{
          maxWidth: '1360px', margin: '0 auto',
          paddingTop: '1.5rem',
          fontSize: '11.5px', color: 'rgba(255,255,255,0.2)',
          display: 'flex', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '8px',
        }}>
          <span>© 2025 SaleBikes · Bringabarát Tesztbike</span>
          <span>Outlet · Bemutató · Használt kerékpárok</span>
        </div>
      </footer>

      {/* ── STICKY MOBILE CTA ──────────────────────────────────── */}
      <a href="tel:+36308897559" className="mobile-cta" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: '#e8c547', color: '#111111',
        alignItems: 'center', justifyContent: 'center',
        gap: '10px', padding: '17px 16px',
        fontSize: '14.5px', fontWeight: 800,
        letterSpacing: '-0.02em', textDecoration: 'none',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
      }}>
        <Phone size={16} />
        Hívj most · +36 30 889 7559
      </a>
    </>
  )
}
