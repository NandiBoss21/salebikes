'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import BikeCard from '@/components/BikeCard'
import { Phone, Shield, FileText, RotateCcw, MapPin, Star, ChevronDown } from 'lucide-react'
import type { Bike } from '@/lib/supabase'

const HeroBike3D = dynamic(() => import('@/components/HeroBike3D'), { ssr: false })

const CATEGORIES = [
  { key: 'all', label: 'Összes' },
  { key: 'ebike', label: 'Ebike' },
  { key: 'mtb', label: 'MTB' },
  { key: 'trekking', label: 'Trekking' },
  { key: 'gravel', label: 'Gravel' },
  { key: 'gyerek', label: 'Gyerek' },
  { key: 'orszaguti', label: 'Országúti' },
]

const BRANDS = ['Cube', 'Scott', 'Bulls', 'Giant', 'KTM', 'Merida', 'Corratec', 'Genesis', 'Focus', 'Brennabor']

function useAos(deps: unknown[]) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view')
          observer.unobserve(e.target)
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.aos:not(.in-view)').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export default function Home() {
  const [category, setCategory] = useState('all')
  const [bikes, setBikes] = useState<Bike[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBikes() {
      setLoading(true)
      let query = supabase
        .from('bikes').select('*').eq('available', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
      if (category !== 'all') query = query.eq('category', category)
      const { data } = await query
      setBikes((data || []) as Bike[])
      setLoading(false)
    }
    fetchBikes()
  }, [category])

  useAos([])
  useAos([loading])

  return (
    <>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        overflow: 'hidden',
      }}>
        {/* Left – text */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(3rem, 8vw, 7rem) clamp(2rem, 5vw, 5rem)',
          background: '#f8f8f6',
        }}>
          <div className="aos" style={{
            display: 'inline-block',
            fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#e8c547',
            border: '1px solid rgba(232,197,71,0.5)',
            padding: '5px 14px', borderRadius: '2px',
            marginBottom: '2rem', alignSelf: 'flex-start',
          }}>
            Outlet · Bemutató · Használt
          </div>

          <h1 className="aos d1" style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(3.5rem, 7vw, 6.5rem)',
            lineHeight: 0.92,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            marginBottom: '1.75rem',
            color: '#0a0a0a',
          }}>
            Prémium<br />
            bringák<br />
            <span style={{
              color: '#e8c547',
              WebkitTextStroke: '0px',
            }}>félár alatt</span>
          </h1>

          <p className="aos d2" style={{
            fontSize: '16px', fontWeight: 400,
            color: 'rgba(10,10,10,0.55)',
            maxWidth: '420px', lineHeight: 1.7,
            marginBottom: '2.5rem',
          }}>
            Cube, Scott, Bulls, Giant, KTM – bemutatódarabok és outlet kerékpárok 3 hónap garanciával. Kápolnásnyék, személyes megtekintés rugalmasan.
          </p>

          <div className="aos d3" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <a href="#termekek" style={{
              background: '#e8c547', color: '#0a0a0a',
              padding: '14px 28px', borderRadius: '3px',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700, fontSize: '14px',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              textDecoration: 'none',
            }}>Kerékpárok böngészése</a>

            <a href="tel:+36308897559" style={{
              background: 'transparent', color: '#0a0a0a',
              border: '1px solid rgba(10,10,10,0.2)',
              padding: '14px 28px', borderRadius: '3px',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 600, fontSize: '14px',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              textDecoration: 'none',
            }}>+36 30 889 7559</a>
          </div>

          {/* Stats */}
          <div className="aos d4" style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
            {[
              { val: loading ? '…' : `${bikes.length}+`, label: 'Kerékpár raktáron' },
              { val: '3 hó', label: 'Garancia' },
              { val: '−50%', label: 'Bolti ártól' },
            ].map(s => (
              <div key={s.label}>
                <div style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 900, fontSize: '2rem',
                  color: '#e8c547', lineHeight: 1,
                }}>{s.val}</div>
                <div style={{
                  fontSize: '11px', fontWeight: 600,
                  color: 'rgba(10,10,10,0.4)',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  marginTop: '4px',
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right – 3D bike */}
        <div className="hero-bike" style={{
          position: 'relative',
          background: '#111111',
          overflow: 'hidden',
        }}>
          <HeroBike3D />
          {/* Scroll hint */}
          <a href="#termekek" style={{
            position: 'absolute', bottom: '2rem', left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '6px',
            color: 'rgba(255,255,255,0.5)',
            textDecoration: 'none',
            fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            opacity: 0.7,
          }}>
            <ChevronDown size={20} />
          </a>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────── */}
      <div className="aos" style={{
        display: 'flex', gap: '0', flexWrap: 'wrap',
        borderTop: '1px solid rgba(0,0,0,0.07)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        background: '#ffffff',
      }}>
        {[
          { icon: <Shield size={15} />, text: '3 hónap garancia' },
          { icon: <FileText size={15} />, text: 'Adásvételi szerződés' },
          { icon: <RotateCcw size={15} />, text: 'Visszavétel garantált' },
          { icon: <MapPin size={15} />, text: 'Kápolnásnyék · Rugalmas időpont' },
          { icon: <Star size={15} />, text: '4.7 ★ Google értékelés' },
        ].map((item, i) => (
          <div key={item.text} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '1.1rem 2rem',
            fontSize: '12px', fontWeight: 500,
            color: 'rgba(10,10,10,0.55)',
            borderRight: i < 4 ? '1px solid rgba(0,0,0,0.07)' : 'none',
            flex: '1 1 auto',
            letterSpacing: '0.03em',
          }}>
            <span style={{ color: '#e8c547', flexShrink: 0 }}>{item.icon}</span>
            {item.text}
          </div>
        ))}
      </div>

      {/* ── PRODUCTS ─────────────────────────────────────────── */}
      <section style={{ padding: '5rem 2rem', background: '#f8f8f6' }} id="termekek">
        <div className="aos" style={{
          display: 'flex', alignItems: 'baseline',
          justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '1rem',
          marginBottom: '2rem',
          maxWidth: '1400px', margin: '0 auto 2rem',
        }}>
          <h2 style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 3rem)',
            textTransform: 'uppercase', letterSpacing: '-0.01em',
          }}>Elérhető kerékpárok</h2>
        </div>

        {/* Filters */}
        <div className="aos d1" style={{
          display: 'flex', gap: '8px', marginBottom: '2.5rem',
          flexWrap: 'wrap', maxWidth: '1400px', margin: '0 auto 2.5rem',
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              style={{
                padding: '8px 18px',
                fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                borderRadius: '2px', border: '1px solid', cursor: 'pointer',
                transition: 'all 0.2s',
                ...(category === cat.key
                  ? { background: '#0a0a0a', color: '#ffffff', borderColor: '#0a0a0a' }
                  : { background: 'transparent', color: 'rgba(10,10,10,0.45)', borderColor: 'rgba(10,10,10,0.18)' }
                ),
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {loading ? (
            <div style={{
              textAlign: 'center', padding: '5rem',
              color: 'rgba(10,10,10,0.3)', fontSize: '15px',
            }}>
              Kerékpárok betöltése…
            </div>
          ) : bikes.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '5rem',
              color: 'rgba(10,10,10,0.4)',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🚲</div>
              <div style={{ fontSize: '18px', marginBottom: '1rem' }}>Ebben a kategóriában nincs elérhető kerékpár.</div>
              <button onClick={() => setCategory('all')} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#e8c547', fontSize: '15px', fontWeight: 600,
              }}>← Összes kerékpár</button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1px',
              background: 'rgba(0,0,0,0.06)',
            }}>
              {bikes.map((bike, i) => (
                <div key={bike.id} className={`aos d${Math.min(i % 4 + 1, 5)}`}>
                  <BikeCard bike={bike} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── WHY US ───────────────────────────────────────────── */}
      <section style={{ background: '#ffffff', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 className="aos" style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 3rem)',
            textTransform: 'uppercase', letterSpacing: '-0.01em',
            marginBottom: '3rem',
          }}>Miért minket válassz?</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '2.5rem',
          }}>
            {[
              { title: '3 hónap garancia', desc: 'Minden kerékpárra. Rendeltetésszerű használat mellett javítjuk vagy visszaváltjuk.' },
              { title: 'Adásvételi szerződés', desc: 'Alvázszámmal ellátott szerződés minden vásárláshoz. Biztonságos és átlátható.' },
              { title: 'Outlet és bemutatók', desc: '0 km-es, karcmentes darabok bolti ár töredékéért. Nem használt – csak kiállított.' },
              { title: 'Rugalmas megtekintés', desc: 'Kápolnásnyék – időpont egyeztetés alapján, a neked megfelelő időben.' },
              { title: 'Prémium márkák', desc: 'Cube, Scott, Bulls, Giant, KTM, Merida – csak megbízható, minőségi gyártók.' },
              { title: 'Visszavételi garancia', desc: 'Ha nem felel meg, visszaváltjuk. Nincs kockázat a vásárlásnál.' },
            ].map((item, i) => (
              <div key={item.title} className={`aos d${Math.min(i + 1, 5)}`} style={{
                borderTop: '3px solid #e8c547',
                paddingTop: '1.25rem',
              }}>
                <div style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 700, fontSize: '1rem',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  marginBottom: '8px', color: '#0a0a0a',
                }}>{item.title}</div>
                <div style={{
                  fontSize: '13px', fontWeight: 400, lineHeight: 1.65,
                  color: 'rgba(10,10,10,0.5)',
                }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRANDS ───────────────────────────────────────────── */}
      <section className="aos" style={{
        padding: '3rem 2rem',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        background: '#f8f8f6',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'rgba(10,10,10,0.3)', marginBottom: '1.5rem',
          }}>Elérhető márkák</div>
          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {BRANDS.map(b => (
              <span key={b} style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700, fontSize: '1.15rem',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'rgba(10,10,10,0.18)',
              }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{
        padding: '2.5rem 2rem 6rem',
        borderTop: '1px solid rgba(0,0,0,0.07)',
        background: '#ffffff',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem',
      }}>
        <div>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900, fontSize: '20px',
            letterSpacing: '0.05em', textTransform: 'uppercase', color: '#0a0a0a',
          }}>Sale<span style={{ color: '#e8c547' }}>Bikes</span></div>
          <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.35)', marginTop: '6px', lineHeight: 1.7 }}>
            Bringabarát Tesztbike · Kápolnásnyék, Tó utca 6 · 2475<br />
            +36 30 889 7559 · salebikes.hu
          </div>
        </div>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <a href="mailto:ht.bike@hotmail.com" style={{ fontSize: '13px', color: 'rgba(10,10,10,0.45)', textDecoration: 'none' }}>ht.bike@hotmail.com</a>
          <a href="/garancia" style={{ fontSize: '13px', color: 'rgba(10,10,10,0.45)', textDecoration: 'none' }}>Garancia</a>
          <a href="/aszf" style={{ fontSize: '13px', color: 'rgba(10,10,10,0.45)', textDecoration: 'none' }}>ÁSZF</a>
        </div>
      </footer>

      {/* ── STICKY CTA ───────────────────────────────────────── */}
      <a href="tel:+36308897559" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#0a0a0a', color: '#ffffff',
        textAlign: 'center', padding: '15px',
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 700, fontSize: '15px',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: '12px',
        textDecoration: 'none', zIndex: 200,
      }}>
        <Phone size={17} />
        Hívj most és egyeztessünk időpontot
        <span style={{
          background: '#e8c547', color: '#0a0a0a',
          fontSize: '13px', padding: '3px 12px',
          borderRadius: '20px', fontWeight: 700,
        }}>+36 30 889 7559</span>
      </a>
    </>
  )
}
