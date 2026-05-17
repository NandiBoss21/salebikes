'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import BikeCard from '@/components/BikeCard'
import { Phone, Shield, FileText, RotateCcw, MapPin, Star } from 'lucide-react'
import type { Bike } from '@/lib/supabase'

const CATS = [
  { key: 'all',       label: 'Összes' },
  { key: 'ebike',     label: 'Ebike' },
  { key: 'mtb',       label: 'MTB' },
  { key: 'trekking',  label: 'Trekking' },
  { key: 'gravel',    label: 'Gravel' },
  { key: 'gyerek',    label: 'Gyerek' },
  { key: 'orszaguti', label: 'Országúti' },
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

export default function Home() {
  const [cat, setCat] = useState('all')
  const [bikes, setBikes] = useState<Bike[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    let q = supabase.from('bikes').select('*').eq('available', true)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
    if (cat !== 'all') q = q.eq('category', cat)
    q.then(({ data }) => { setBikes((data || []) as Bike[]); setLoading(false) })
  }, [cat])

  useAos([])
  useAos([loading])

  const avgSavings = !loading && bikes.length > 0
    ? Math.round(bikes.reduce((s, b) => s + (b.original_price - b.sale_price), 0) / bikes.length / 1000) * 1000
    : null

  return (
    <>
      <Navbar />

      {/* ── HERO ─────────────────────────────────── */}
      <section style={{
        background: '#ffffff',
        padding: 'clamp(2rem, 4vw, 3.5rem) 2rem clamp(3rem, 6vw, 5rem)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>

          <div className="aos" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '11px', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: '#111111', background: '#f5f5f5',
            padding: '6px 14px', borderRadius: '20px',
            marginBottom: '2rem',
          }}>
            <span style={{
              display: 'inline-block', width: '6px', height: '6px',
              borderRadius: '50%', background: '#e8c547',
            }} />
            Outlet · Bemutató · Használt
          </div>

          <h1 className="aos d1" style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 900, lineHeight: 1.0,
            letterSpacing: '-0.04em', color: '#111111',
            marginBottom: '1.5rem',
          }}>
            Prémium kerékpárok<br />
            <span style={{ color: '#e8c547' }}>félár alatt.</span>
          </h1>

          <p className="aos d2" style={{
            fontSize: 'clamp(15px, 2.5vw, 18px)',
            fontWeight: 400, lineHeight: 1.65,
            color: 'rgba(17,17,17,0.5)',
            maxWidth: '560px',
            marginBottom: avgSavings ? '1rem' : '2.5rem',
          }}>
            Cube, Scott, Bulls, Giant, KTM – outlet és használt bringák
            3 hónap garanciával{avgSavings ? '. Átlagos megtakarítás:' : '.'}
          </p>

          {avgSavings && (
            <div className="aos d2" style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
              fontWeight: 800, letterSpacing: '-0.04em',
              color: '#111111', marginBottom: '2.5rem',
            }}>
              <span style={{
                background: '#e8c547', padding: '2px 12px',
                borderRadius: '6px',
              }}>
                {avgSavings.toLocaleString('hu-HU')} Ft
              </span>
              {' '}vásárlásonként
            </div>
          )}

          <div className="aos d3" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href="#termekek" style={{
              background: '#111111', color: '#ffffff',
              padding: '13px 26px', borderRadius: '8px',
              fontSize: '14px', fontWeight: 700,
              letterSpacing: '-0.02em', textDecoration: 'none',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#333')}
              onMouseLeave={e => (e.currentTarget.style.background = '#111111')}
            >Kerékpárok megtekintése →</a>

            <a href="tel:+36308897559" style={{
              background: 'transparent', color: '#111111',
              border: '1.5px solid rgba(17,17,17,0.2)',
              padding: '13px 26px', borderRadius: '8px',
              fontSize: '14px', fontWeight: 600,
              letterSpacing: '-0.02em', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'border-color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#111111')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(17,17,17,0.2)')}
            >
              <Phone size={14} />
              +36 30 889 7559
            </a>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────── */}
      <div className="aos" style={{
        background: '#f9f9f9',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', flexWrap: 'wrap',
          padding: '0 2rem',
        }}>
          {[
            { icon: <Shield size={14} />, text: '3 hónap garancia' },
            { icon: <FileText size={14} />, text: 'Adásvételi szerződés' },
            { icon: <RotateCcw size={14} />, text: 'Visszavétel garantált' },
            { icon: <MapPin size={14} />, text: 'Kápolnásnyék' },
            { icon: <Star size={14} />, text: '4.7 ★ Google' },
          ].map((item, i, arr) => (
            <div key={item.text} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '1.1rem 1.75rem',
              fontSize: '12px', fontWeight: 500,
              color: 'rgba(17,17,17,0.55)',
              borderRight: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.07)' : 'none',
              flex: '1 1 auto',
            }}>
              <span style={{ color: '#e8c547', flexShrink: 0 }}>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* ── PRODUCTS ─────────────────────────────── */}
      <section id="termekek" style={{ padding: '4rem 2rem 5rem', background: '#ffffff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          <h2 className="aos" style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 800, letterSpacing: '-0.04em',
            color: '#111111', marginBottom: '1.75rem',
          }}>Elérhető kerékpárok</h2>

          {/* Category filters */}
          <div className="aos d1" style={{
            display: 'flex', gap: '8px', flexWrap: 'wrap',
            marginBottom: '2.25rem',
          }}>
            {CATS.map(c => (
              <button key={c.key} onClick={() => setCat(c.key)} style={{
                padding: '7px 16px',
                fontSize: '12px', fontWeight: 600,
                letterSpacing: '-0.01em',
                borderRadius: '20px', border: '1.5px solid', cursor: 'pointer',
                transition: 'all 0.15s',
                ...(cat === c.key
                  ? { background: '#111111', color: '#ffffff', borderColor: '#111111' }
                  : { background: 'transparent', color: 'rgba(17,17,17,0.5)', borderColor: 'rgba(17,17,17,0.15)' }
                ),
              }}>{c.label}</button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{
              textAlign: 'center', padding: '5rem',
              color: 'rgba(17,17,17,0.3)', fontSize: '14px',
            }}>Betöltés…</div>
          ) : bikes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'rgba(17,17,17,0.4)' }}>
              <div style={{ fontSize: '40px', marginBottom: '1rem' }}>🚲</div>
              <div style={{ fontSize: '16px', marginBottom: '1rem', fontWeight: 500 }}>
                Ebben a kategóriában nincs elérhető kerékpár.
              </div>
              <button onClick={() => setCat('all')} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#111111', fontSize: '14px', fontWeight: 600,
                textDecoration: 'underline',
              }}>← Összes kerékpár</button>
            </div>
          ) : (
            <>
              <div style={{
                fontSize: '12px', color: 'rgba(17,17,17,0.4)',
                marginBottom: '1.25rem', fontWeight: 500,
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

      {/* ── WHY US ───────────────────────────────── */}
      <section style={{ background: '#f9f9f9', padding: '5rem 2rem', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 className="aos" style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 800, letterSpacing: '-0.04em',
            color: '#111111', marginBottom: '3rem',
          }}>Miért minket válassz?</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '2rem',
          }}>
            {[
              { title: '3 hónap garancia', desc: 'Minden kerékpárra. Rendeltetésszerű használat mellett javítjuk vagy visszaváltjuk.' },
              { title: 'Adásvételi szerződés', desc: 'Alvázszámmal ellátott szerződés minden vásárláshoz. Biztonságos és átlátható.' },
              { title: 'Outlet darabok', desc: '0 km-es, karcmentes bemutatódarabok bolti ár töredékéért. Csak kiállított – nem használt.' },
              { title: 'Rugalmas időpont', desc: 'Kápolnásnyék – előre egyeztetett időpontban, neked megfelelően.' },
              { title: 'Prémium márkák', desc: 'Cube, Scott, Bulls, Giant, KTM, Merida – csak megbízható, minőségi gyártók.' },
              { title: 'Visszavételi garancia', desc: 'Ha nem felel meg, visszaváltjuk. Nincs kockázat a vásárlásnál.' },
            ].map((item, i) => (
              <div key={item.title} className={`aos d${Math.min(i + 1, 5)}`} style={{
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.07)',
                borderRadius: '10px',
                padding: '1.5rem',
              }}>
                <div style={{
                  width: '32px', height: '3px',
                  background: '#e8c547', borderRadius: '2px',
                  marginBottom: '1rem',
                }} />
                <div style={{
                  fontSize: '14px', fontWeight: 700,
                  color: '#111111', marginBottom: '8px',
                  letterSpacing: '-0.02em',
                }}>{item.title}</div>
                <div style={{
                  fontSize: '13px', fontWeight: 400, lineHeight: 1.65,
                  color: 'rgba(17,17,17,0.5)',
                }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────── */}
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
        }}>
          © 2025 SaleBikes · Bringabarát Tesztbike
        </div>
      </footer>

      {/* ── STICKY MOBILE CTA ───────────────────── */}
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
