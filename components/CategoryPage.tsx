'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import BikeCard from '@/components/BikeCard'
import { Phone } from 'lucide-react'
import type { Bike } from '@/lib/supabase'

export default function CategoryPage({ category, label, suffix = 'kerékpárok' }: { category: string; label: string; suffix?: string }) {
  const [bikes, setBikes] = useState<Bike[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('bikes')
      .select('*')
      .eq('available', true)
      .not('sold', 'eq', true)
      .not('is_deleted', 'eq', true)
      .eq('category', category)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setBikes((data || []) as Bike[])
        setLoading(false)
      })
  }, [category])

  const heroImage = `/image/category-${category}.png`

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section style={{
        position: 'relative',
        height: 'clamp(260px, 35vw, 360px)',
        background: '#111111',
        overflow: 'hidden',
        display: 'flex', alignItems: 'flex-end',
      }}>
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(17,17,17,0.85) 0%, rgba(17,17,17,0.45) 50%, rgba(17,17,17,0.2) 100%)',
        }} />

        {/* Text */}
        <div style={{ position: 'relative', zIndex: 1, padding: 'clamp(1.5rem, 4vw, 2.5rem) 2rem', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
          <div style={{
            fontSize: '11px', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem',
          }}>
            Outlet · Bemutató · Használt
          </div>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 7vw, 4.5rem)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: '#ffffff', lineHeight: 1.05, margin: 0,
          }}>
            {label}{suffix ? (
              <>{' '}<span style={{ color: '#e8c547' }}>{suffix}</span></>
            ) : null}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: 'clamp(2.5rem, 5vw, 4rem) 2rem', background: '#fafaf8', minHeight: '40vh' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'rgba(17,17,17,0.3)', fontSize: '14px' }}>
              Betöltés…
            </div>
          ) : bikes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'rgba(17,17,17,0.45)' }}>
              <div style={{ fontSize: '40px', marginBottom: '1.25rem' }}>🚲</div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: '#111111', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                Hamarosan érkeznek kerékpárok ebben a kategóriában.
              </div>
              <div style={{ fontSize: '14px', marginBottom: '1.75rem', color: 'rgba(17,17,17,0.45)' }}>
                Értesülj elsőként az új feltöltésekről — hívj minket!
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="tel:+36308897559" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  background: '#111111', color: '#ffffff',
                  padding: '13px 24px', borderRadius: '8px',
                  fontWeight: 700, fontSize: '14px', textDecoration: 'none',
                  letterSpacing: '-0.01em',
                }}>
                  <Phone size={15} /> +36 30 889 7559
                </a>
                <a href="/" style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: 'transparent', color: '#111111',
                  border: '1px solid #E8E4DC',
                  padding: '13px 24px', borderRadius: '8px',
                  fontWeight: 600, fontSize: '14px', textDecoration: 'none',
                }}>← Összes kerékpár</a>
              </div>
            </div>
          ) : (
            <>
              <div style={{
                fontSize: '12px', color: 'rgba(17,17,17,0.4)',
                marginBottom: '1.25rem', fontWeight: 500,
              }}>{bikes.length} kerékpár elérhető</div>
              <div className="bikes-grid">
                {bikes.map(bike => (
                  <BikeCard key={bike.id} bike={bike} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Sticky mobile CTA */}
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
