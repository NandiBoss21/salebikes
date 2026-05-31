'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import BikeCard from '@/components/BikeCard'
import { Phone } from 'lucide-react'
import type { Bike } from '@/lib/supabase'
import AnimatedSection from '@/components/AnimatedSection'
import SizeCalculator from '@/components/SizeCalculator'
import { useCountUp } from '@/hooks/useCountUp'
import { usePageView } from '@/hooks/usePageView'

const CATEGORIES = [
  { label: 'Ebike',       href: '/ebike',       image: '/image/category-ebike.png' },
  { label: 'MTB',         href: '/mtb',         image: '/image/category-mtb.png' },
  { label: 'Trekking',    href: '/trekking',    image: '/image/category-trekking.png' },
  { label: 'Gravel',      href: '/gravel',      image: '/image/category-gravel.png' },
  { label: 'Gyerek',      href: '/gyerek',      image: '/image/category-gyerek.png' },
  { label: 'Országúti',   href: '/orszaguti',   image: '/image/category-orszaguti.png' },
  { label: 'Kemping',     href: '/kemping',     image: '/image/category-kemping.png' },
  { label: 'Alkatrészek', href: '/alkatreszek', image: '/image/category-alkatreszek.png' },
  { label: 'Ruházat',     href: '/ruhazat',     image: '/image/category-ruhazat.png' },
]

const BRANDS = ['Focus', 'Shimano', 'Campagnolo', 'Fox', 'Giant', 'Conway', 'Scott', 'Bulls', 'Cannondale', 'Corratec', 'Cube', 'Genesis', 'Merida', 'KTM']

const REVIEWS = [
  { text: 'Legjobb hely, barátságos a tulajdonos is, csak ajánlani tudom őket!', name: 'Orion T.' },
  { text: 'A Bringabarát telephely rendezett és profi hely, ahol gyors és korrekt kiszolgálást kaptam. Minden gördülékenyen ment, teljesen elégedett voltam.', name: 'Marsi Dominik' },
  { text: 'Tamás nagyon korrekt! Mindig őszintén elmondja a véleményét, akkor is, ha neki kedvezőtlen! Csodás bringák, maximális tájékoztatás!', name: 'István V.' },
  { text: 'Hat bicikli vásárlásán vagyok túl tőlük és évek óta semmi gond semelyikkel. Korrekt!', name: 'Adrián' },
  { text: 'Nagyon kedves és segítőkész kiszolgálásban volt részem. Széles választék, jó minőségű kerékpárok, barátságos hangulat. Bátran ajánlom!', name: 'Dávid S.' },
]

const MTB_SIZES    = [
  { height: '148–158 cm', frame: '13–14"', size: 'XS' },
  { height: '158–168 cm', frame: '15–16"', size: 'S' },
  { height: '168–178 cm', frame: '17–18"', size: 'M' },
  { height: '178–185 cm', frame: '19–20"', size: 'L' },
  { height: '185–193 cm', frame: '21–22"', size: 'XL' },
  { height: '193–198 cm', frame: '23–24"', size: 'XXL' },
]
const TREKKING_SIZES = [
  { height: '147–155 cm', frame: '13–14" / 47–49 cm', size: 'XS' },
  { height: '155–165 cm', frame: '15–16" / 50–52 cm', size: 'S' },
  { height: '165–175 cm', frame: '17–18" / 53–54 cm', size: 'M' },
  { height: '175–183 cm', frame: '19–20" / 55–57 cm', size: 'L' },
  { height: '183–191 cm', frame: '21–22" / 58–61 cm', size: 'XL' },
  { height: '191–198 cm', frame: '23–25" / 61–63 cm', size: 'XXL' },
]
const ROAD_SIZES = [
  { height: '148–152 cm', frame: '47–48 cm', size: 'XXS' },
  { height: '152–160 cm', frame: '49–50 cm', size: 'XS' },
  { height: '160–168 cm', frame: '51–53 cm', size: 'S' },
  { height: '168–175 cm', frame: '54–55 cm', size: 'M' },
  { height: '175–183 cm', frame: '56–58 cm', size: 'L' },
  { height: '183–191 cm', frame: '58–60 cm', size: 'XL' },
  { height: '191–198 cm', frame: '61–63 cm', size: 'XXL' },
]
const KIDS_SIZES = [
  { age: '2–4 év', height: '85–100 cm', wheel: '12"' },
  { age: '3–5 év', height: '95–110 cm', wheel: '14"' },
  { age: '5–7 év', height: '110–120 cm', wheel: '16"' },
  { age: '7–9 év', height: '120–135 cm', wheel: '20"' },
  { age: '9–11 év', height: '135–145 cm', wheel: '24"' },
  { age: '11+ év', height: '145+ cm',    wheel: '26"' },
]

const SIZE_TABS = ['MTB', 'Trekking', 'Országúti', 'Gyerek'] as const
type SizeTab = typeof SIZE_TABS[number]

const thStyle: React.CSSProperties = {
  padding: '11px 16px', textAlign: 'left',
  fontSize: '11px', fontWeight: 800,
  letterSpacing: '0.06em', textTransform: 'uppercase',
  color: '#111111',
}
const tdStyle: React.CSSProperties = {
  padding: '11px 16px',
  fontSize: '13px', fontWeight: 500,
  color: 'rgba(17,17,17,0.75)',
  borderBottom: '1px solid rgba(0,0,0,0.05)',
}

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
  usePageView('/')
  const [mounted, setMounted] = useState(false)
  const [bikes, setBikes] = useState<Bike[]>([])
  const [featuredBikes, setFeaturedBikes] = useState<Bike[]>([])
  const [loading, setLoading] = useState(true)
  const [sizeTab, setSizeTab] = useState<SizeTab>('MTB')
  const [catOrder, setCatOrder] = useState<{ slug: string; visible: boolean }[] | null>(null)

  useEffect(() => {
    supabase.from('categories').select('slug,visible,display_order').order('display_order')
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) setCatOrder(data as { slug: string; visible: boolean; display_order: number }[])
      })
  }, [])

  const visibleCategories = catOrder
    ? catOrder.filter(c => c.visible).map(c => CATEGORIES.find(cat => cat.href === `/${c.slug}`)).filter(Boolean) as typeof CATEGORIES
    : CATEGORIES

  useEffect(() => {
    supabase.from('bikes').select('*').eq('available', true).not('sold', 'eq', true).not('is_deleted', 'eq', true)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => { setBikes((data || []) as Bike[]); setLoading(false) })
  }, [])

  useEffect(() => {
    supabase.from('bikes').select('*')
      .eq('available', true).not('sold', 'eq', true).not('is_deleted', 'eq', true).eq('featured', true)
      .then(({ data }) => {
        const featured = (data || []) as Bike[]
        if (featured.length > 0) {
          setFeaturedBikes(featured.sort((a, b) => {
            const pctA = a.original_price > 0 ? Math.round((1 - a.sale_price / a.original_price) * 100) : 0
            const pctB = b.original_price > 0 ? Math.round((1 - b.sale_price / b.original_price) * 100) : 0
            return pctB - pctA
          }))
        } else {
          supabase.from('bikes').select('*')
            .eq('available', true).not('sold', 'eq', true).not('is_deleted', 'eq', true)
            .order('created_at', { ascending: false }).limit(6)
            .then(({ data: fallback }) => setFeaturedBikes((fallback || []) as Bike[]))
        }
      })
  }, [])

  useEffect(() => setMounted(true), [])

  useAos([])
  useAos([loading])
  useAos([catOrder])

  const avgSavings = bikes.length > 0
    ? Math.round(bikes.reduce((sum, b) => sum + Math.max(0, b.original_price - b.sale_price), 0) / bikes.length)
    : 0

  const { value: count1000, ref: ref1000 } = useCountUp(1000)
  const { value: count180k, ref: ref180k } = useCountUp(avgSavings > 0 ? avgSavings : 180000)

  return (
    <>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        width: '100%',
        height: '85vh',
        backgroundImage: 'url(/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          zIndex: 0,
        }} />

        {/* Text content – left side */}
        <div style={{
          position: 'relative', zIndex: 1,
          flex: 1,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(5.5rem, 8vw, 7rem) clamp(2rem, 5vw, 5.5rem) 110px',
          maxWidth: '680px',
        }}>
          <div
            style={{
              fontSize: '10.5px', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem',
              display: 'flex', alignItems: 'center', gap: '10px',
              animation: 'hero-fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
            }}
          >
            <span style={{
              display: 'inline-block', width: '24px', height: '2px',
              background: '#e8c547', flexShrink: 0,
            }} />
            Outlet · Bemutató · Használt
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.9rem, 5.5vw, 4.2rem)',
              fontWeight: 900, letterSpacing: '-0.045em',
              lineHeight: 1.02, color: '#ffffff',
              marginBottom: '1.75rem',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            {['Prémium', 'kerékpárok', 'akár félár alatt'].map((line, i) => (
              <span
                key={line}
                style={{
                  display: 'block',
                  animation: 'hero-fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
                  animationDelay: `${0.15 + i * 0.1}s`,
                }}
              >
                {line}
              </span>
            ))}
          </h1>

          <div
            style={{
              display: 'flex', gap: '14px', flexWrap: 'wrap',
              alignItems: 'center',
              fontSize: '12.5px', fontWeight: 500,
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '2.5rem',
              textShadow: '0 1px 4px rgba(0,0,0,0.5)',
              animation: 'hero-fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both',
            }}
          >
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
            <span>Garancia</span>
          </div>

          <div
            style={{
              display: 'flex', gap: '10px', flexWrap: 'wrap',
              animation: 'hero-fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.55s both',
            }}
          >
            <a href="#kategoriak" style={{
              background: '#ffffff', color: '#111111',
              padding: '14px 26px', borderRadius: '6px',
              fontSize: '13.5px', fontWeight: 700,
              letterSpacing: '-0.02em', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f0f0f0')}
              onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}
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

        {/* Location label – right side, desktop only */}
        <div className="hero-location" style={{
          position: 'absolute', right: '3rem', top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1, textAlign: 'right', pointerEvents: 'none',
        }}>
          <div style={{
            fontSize: '13px', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#ffffff',
            textShadow: '0 1px 6px rgba(0,0,0,0.6)',
          }}>2475 Kápolnásnyék</div>
          <div style={{
            fontSize: '11px', fontWeight: 400,
            color: 'rgba(255,255,255,0.65)',
            marginTop: '4px',
            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
            letterSpacing: '0.05em',
          }}>Tó utca 6.</div>
        </div>

        {/* Stat bar */}
        <div className="hero-stat-bar" style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'stretch',
        }}>
          {[
            {
              label: 'Eladás 2008 óta',
              numEl: <span ref={ref1000} style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.2 }}>{count1000}+</span>,
            },
            {
              label: 'Átlag megtakarítás',
              numEl: <span ref={ref180k} style={{ fontSize: 'clamp(1.21rem, 2.2vw, 1.65rem)', fontWeight: 800, color: '#e8c547', letterSpacing: '-0.03em', lineHeight: 1.2 }}>{count180k.toLocaleString('hu-HU')} Ft</span>,
            },
            {
              label: 'Google értékelés',
              numEl: <span style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.2 }}>4.9 ★</span>,
            },
            {
              label: 'Minden kerékpárra',
              numEl: <span style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.2 }}>Garancia</span>,
            },
          ].map((stat, i) => (
            <div key={stat.label} style={{
              flex: 1,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '1.25rem 1rem',
              borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.2)' : 'none',
              textAlign: 'center',
            }}>
              {stat.numEl}
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '3px', letterSpacing: '0.02em' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORY GRID ──────────────────────────────────────── */}
      <section id="kategoriak" style={{
        padding: '3rem clamp(1.5rem, 4vw, 3rem) clamp(3rem, 6vw, 5rem)',
        background: '#111111',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>

          <div className="aos" style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            marginBottom: '1.75rem',
          }}>
            <span style={{
              fontSize: '14px', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#ffffff',
            }}>Kategóriák</span>
            <span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          </div>

          <div className="cat-grid">
            {visibleCategories.map((cat, i) => (
              <div
                key={cat.label}
                className="aos"
                style={{ transitionDelay: `${i * 0.06}s` }}
              >
              <Link href={cat.href}
                className="cat-card"
                style={{
                  position: 'relative', overflow: 'hidden',
                  background: '#111',
                  borderRadius: '8px',
                  aspectRatio: '4/3',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '1rem 1.25rem',
                }}
              >
                <div className="cat-card-img" style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${cat.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }} />
                <div className="cat-card-overlay" style={{
                  position: 'absolute', inset: 0,
                }} />
                <span style={{
                  position: 'relative', zIndex: 1,
                  fontSize: '1.1rem', fontWeight: 700,
                  color: '#ffffff', letterSpacing: '-0.025em',
                  lineHeight: 1.1,
                  textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                }}>{cat.label}</span>
              </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST STATS ────────────────────────────────────────── */}
      <section style={{ background: '#F2F0EB', borderBottom: '1px solid rgba(17,17,17,0.08)' }}>
        <div className="trust-grid" style={{
          maxWidth: '1360px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          padding: '0 clamp(1.5rem, 4vw, 3rem)',
        }}>
          {[
            { num: '1000+', label: 'eladás 2008 óta' },
            { num: 'Garancia', label: 'minden bringára' },
            { num: '4.9 ★', label: 'Google értékelés' },
          ].map((s, i) => (
            <AnimatedSection key={s.label} delay={i * 0.12} className="trust-stat" style={{
              textAlign: 'center',
              padding: 'clamp(2.5rem, 5vw, 4rem) 1.5rem',
              borderRight: i < 2 ? '1px solid rgba(17,17,17,0.1)' : 'none',
              display: 'flex', flexDirection: 'column', gap: '6px',
            }}>
              <div className="trust-stat-num" style={{
                fontSize: 'clamp(1.85rem, 3.5vw, 2.85rem)',
                fontWeight: 900, letterSpacing: '-0.05em',
                color: '#111111', lineHeight: 1,
              }}>{s.num}</div>
              <div style={{
                fontSize: '10.5px', fontWeight: 800,
                color: '#e8c547', textTransform: 'uppercase',
                letterSpacing: '0.08em', marginTop: '4px',
              }}>{s.label}</div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ── SEO TEXT ────────────────────────────────────────────── */}
      <section style={{
        background: '#111111',
        padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div className="seo-text-grid" style={{ maxWidth: '1360px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#e8c547', marginBottom: '1.25rem' }}>
              Kápolnásnyék · Velence · 50 km Budapesttől
            </div>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: '#ffffff',
              lineHeight: 1.1,
              marginBottom: '1.75rem'
            }}>
              Prémium kerékpárok.<br />Átvilágítva, garanciával,<br />tisztességes áron.
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'rgba(255,255,255,0.55)', marginBottom: '1.25rem' }}>
              A Bringabarát Testbike Kápolnásnyéken, a Velencei-tó mellett kínál válogatott outlet és használt kerékpárokat – Budapesttől mindössze 50 km-re. Cube, Scott, Bulls, Giant, KTM és más prémium márkák, személyesen ellenőrizve, garanciával.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'rgba(255,255,255,0.55)', marginBottom: '2rem' }}>
              Nem alkalmi túrákon összeszedett ismeretlen darabok – hanem szakmai szelekció, ahol csak azt kínáljuk, amit mi magunk is megvennénk. 2008 óta több mint 1000 kerékpár talált gazdát nálunk. Kápolnásnyék és Velence Fejér megye szívében, Pest megye közelében helyezkedik el – könnyen elérhető Székesfehérvárról, Érdről, Budaörsről és Budapest déli kerületeiből egyaránt.
            </p>
            <a href="tel:+36308897559" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#e8c547', color: '#111111',
              padding: '13px 24px', borderRadius: '6px',
              fontSize: '13.5px', fontWeight: 700,
              textDecoration: 'none', letterSpacing: '-0.01em'
            }}>
              Hívj most – +36 30 889 7559
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            {[
              { szam: '1000+', cimke: 'Eladott kerékpár 2008 óta', leiras: 'Tapasztalat, amit nem lehet megvásárolni.' },
              { szam: '~300 000 Ft', cimke: 'Átlagos megtakarítás vásárlónként', leiras: 'A bolti árhoz képest, garanciával együtt.' },
              { szam: '4.9 ★', cimke: 'Google értékelés', leiras: 'Valódi vásárlói visszajelzések alapján.' },
              { szam: '50 km', cimke: 'Budapesttől', leiras: 'Kápolnásnyék, személyes megtekintés rugalmasan.' },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)',
                padding: '1.5rem 2rem',
                display: 'flex', alignItems: 'center', gap: '1.5rem',
                borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none'
              }}>
                <div style={{ minWidth: '110px' }}>
                  <div style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', fontWeight: 900, color: '#e8c547', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {item.szam}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', marginBottom: '3px' }}>{item.cimke}</div>
                  <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{item.leiras}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRANDS ─────────────────────────────────────────────── */}
      <section style={{
        background: '#FAFAF8',
        padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)',
        borderBottom: '1px solid rgba(17,17,17,0.06)',
      }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <div className="aos" style={{
            fontSize: '10px', fontWeight: 800,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(17,17,17,0.3)', marginBottom: '1.75rem',
            textAlign: 'center',
          }}>Forgalmazott márkák</div>
          <div className="aos d1" style={{
            display: 'flex', flexWrap: 'wrap',
            justifyContent: 'center', gap: '10px',
          }}>
            {BRANDS.map(brand => (
              <span key={brand} style={{
                fontSize: '13px', fontWeight: 600,
                color: 'rgba(17,17,17,0.55)',
                padding: '7px 18px',
                border: '1px solid #E8E4DC',
                borderRadius: '100px',
                background: '#ffffff',
                letterSpacing: '-0.01em',
                transition: 'color 0.15s, border-color 0.15s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#111111'
                  e.currentTarget.style.borderColor = '#111111'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'rgba(17,17,17,0.55)'
                  e.currentTarget.style.borderColor = '#E8E4DC'
                }}
              >{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── KIEMELT AJÁNLATOK ──────────────────────────────────── */}
      {mounted && featuredBikes.length > 0 && (
        <section style={{
          background: '#F2F0EB',
          padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)',
          borderBottom: '1px solid rgba(17,17,17,0.07)',
        }}>
          <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
            <div className="aos" style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', flexWrap: 'wrap',
              gap: '12px', marginBottom: '2rem',
            }}>
              <div>
                <div style={{
                  fontSize: '10px', fontWeight: 800,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'rgba(17,17,17,0.35)', marginBottom: '6px',
                }}>Kiemelt ajánlat</div>
                <h2 style={{
                  fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                  fontWeight: 900, letterSpacing: '-0.04em',
                  color: '#111111', lineHeight: 1.1,
                }}>Kiemelt ajánlatok</h2>
                <p style={{
                  fontSize: '14px', color: 'rgba(17,17,17,0.45)',
                  marginTop: '6px', lineHeight: 1.5,
                }}>Személyesen válogatott, legjobb ár-érték arányú kerékpárok</p>
              </div>
            </div>
            <div className="bikes-grid">
              {featuredBikes.map((bike, i) => (
                <BikeCard key={bike.id} bike={bike} delay={i * 0.08} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── MÉRETTÁBLÁZAT ──────────────────────────────────────── */}
      <section id="merettablazat" style={{
        background: '#FAFAF8',
        padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem)',
        borderTop: '1px solid rgba(17,17,17,0.07)',
        borderBottom: '1px solid rgba(17,17,17,0.07)',
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div className="aos" style={{ marginBottom: '2rem' }}>
            <div style={{
              fontSize: '10px', fontWeight: 800,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'rgba(17,17,17,0.35)', marginBottom: '0.6rem',
            }}>Segítség a választáshoz</div>
            <h2 style={{
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 900, letterSpacing: '-0.04em',
              color: '#111111',
            }}>Mérettáblázat</h2>
          </div>

          {/* Tabs */}
          <div className="aos d1" style={{
            display: 'flex', gap: '6px', flexWrap: 'wrap',
            marginBottom: '1.5rem',
          }}>
            {SIZE_TABS.map(tab => (
              <button key={tab} onClick={() => setSizeTab(tab)} style={{
                padding: '8px 20px', borderRadius: '6px',
                fontSize: '13px', fontWeight: 600,
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: sizeTab === tab ? '#e8c547' : '#ffffff',
                borderColor: sizeTab === tab ? '#e8c547' : '#E8E4DC',
                color: sizeTab === tab ? '#111111' : 'rgba(17,17,17,0.55)',
              }}>
                {tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="aos d2" style={{
            borderRadius: '10px', overflow: 'hidden',
            border: '1px solid #E8E4DC',
          }}>
            {(sizeTab === 'MTB' || sizeTab === 'Trekking' || sizeTab === 'Országúti') && (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#e8c547' }}>
                    <th style={thStyle}>Testmagasság</th>
                    <th style={thStyle}>{sizeTab === 'Országúti' ? 'Csőhossz' : 'Keretméret'}</th>
                    <th style={thStyle}>Méret</th>
                  </tr>
                </thead>
                <tbody>
                  {(sizeTab === 'MTB' ? MTB_SIZES : sizeTab === 'Trekking' ? TREKKING_SIZES : ROAD_SIZES).map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#FAFAF8' : '#F2F0EB' }}>
                      <td style={tdStyle}>{row.height}</td>
                      <td style={tdStyle}>{row.frame}</td>
                      <td style={{ ...tdStyle, fontWeight: 700, color: '#111111' }}>{row.size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {sizeTab === 'Gyerek' && (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#e8c547' }}>
                    <th style={thStyle}>Kor</th>
                    <th style={thStyle}>Magasság</th>
                    <th style={thStyle}>Kerékméret</th>
                  </tr>
                </thead>
                <tbody>
                  {KIDS_SIZES.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#FAFAF8' : '#F2F0EB' }}>
                      <td style={tdStyle}>{row.age}</td>
                      <td style={tdStyle}>{row.height}</td>
                      <td style={{ ...tdStyle, fontWeight: 700, color: '#111111' }}>{row.wheel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <p style={{
            marginTop: '1rem', fontSize: '11.5px',
            color: 'rgba(17,17,17,0.35)', lineHeight: 1.6,
          }}>
            * Az értékek irányadók. Bizonytalan esetben kérj segítséget — hívj minket!
          </p>
        </div>
      </section>

      {/* ── MÉRETKERESŐ ────────────────────────────────────────── */}
      <SizeCalculator />

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
              }}>4.9★</span>
              <a
                href="https://www.google.com/maps/place/Bringabarát+Testbike/@47.279,18.679,17z"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '12px', fontWeight: 600,
                  color: 'rgba(17,17,17,0.4)',
                  textDecoration: 'underline', textUnderlineOffset: '3px',
                }}
              >Google értékelés</a>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.25rem',
          }}>
            {REVIEWS.map((r, i) => (
              <AnimatedSection key={i} delay={i * 0.08} style={{ flex: '1 1 290px', maxWidth: '380px' }}>
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #E8E4DC',
                  borderRadius: '12px',
                  padding: '1.75rem',
                  boxShadow: '0 1px 4px rgba(17,17,17,0.04)',
                  height: '100%',
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
              </AnimatedSection>
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
              Bringabarát Testbike<br />
              2475 Kápolnásnyék, Tó utca 6.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{
              fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.07em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.2)', marginBottom: '2px',
            }}>Elérhetőség</div>
            <a href="tel:+36308897559" style={{
              fontSize: '12.5px', color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none', transition: 'color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
            >+36 30 889 7559</a>
            <a href="mailto:bringabarat@hotmail.com" style={{
              fontSize: '12.5px', color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none', transition: 'color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
            >bringabarat@hotmail.com</a>
            <a href="/rolunk" style={{
              fontSize: '12.5px', color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none', transition: 'color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
            >Rólunk</a>
            <a href="/kapcsolat" style={{
              fontSize: '12.5px', color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none', transition: 'color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
            >Kapcsolat</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{
              fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.07em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.2)', marginBottom: '2px',
            }}>Oldalak</div>
            <a href="/garancia" style={{
              fontSize: '12.5px', color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none', transition: 'color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
            >Garancia</a>
            <a href="/faq" style={{
              fontSize: '12.5px', color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none', transition: 'color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
            >GYIK</a>
            <a href="/aszf" style={{
              fontSize: '12.5px', color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none', transition: 'color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
            >ÁSZF</a>
            <a href="/adatkezeles" style={{
              fontSize: '12.5px', color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none', transition: 'color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
            >Adatkezelés</a>
          </div>
        </div>
        <div style={{
          maxWidth: '1360px', margin: '0 auto',
          paddingTop: '1.5rem',
          fontSize: '11.5px', color: 'rgba(255,255,255,0.2)',
          display: 'flex', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '8px',
        }}>
          <span>© 2026 Bringabarát Testbike</span>
          <span>Outlet · Bemutató · Használt kerékpárok</span>
        </div>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: '8px' }}>
          Készítette: HazeOS
        </p>
      </footer>

      {/* ── STICKY MOBILE CTA ──────────────────────────────────── */}
      <a href="tel:+36308897559" className="mobile-cta" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999,
        background: '#e8c547', color: '#111111',
        alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        fontSize: '16px', fontWeight: 700,
        textDecoration: 'none',
      }}>
        📞 Hívj most – +36 30 889 7559
      </a>
    </>
  )
}
