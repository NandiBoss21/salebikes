'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import BikeCard from '@/components/BikeCard'
import { Phone } from 'lucide-react'
import type { Bike } from '@/lib/supabase'

export default function CategoryPage({ category, label }: { category: string; label: string }) {
  const [bikes, setBikes] = useState<Bike[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('bikes')
      .select('*')
      .eq('available', true)
      .eq('category', category)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setBikes((data || []) as Bike[])
        setLoading(false)
      })
  }, [category])

  return (
    <>
      <Navbar />

      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 2rem', background: '#ffffff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{
              fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'rgba(17,17,17,0.4)', marginBottom: '0.75rem',
            }}>
              Outlet · Bemutató · Használt
            </div>
            <h1 style={{
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              fontWeight: 900, letterSpacing: '-0.04em',
              color: '#111111', lineHeight: 1.05,
            }}>
              {label}{' '}
              <span style={{ color: '#e8c547' }}>kerékpárok</span>
            </h1>
          </div>

          {/* Content */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'rgba(17,17,17,0.3)', fontSize: '14px' }}>
              Betöltés…
            </div>
          ) : bikes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'rgba(17,17,17,0.4)' }}>
              <div style={{ fontSize: '40px', marginBottom: '1rem' }}>🚲</div>
              <div style={{ fontSize: '16px', marginBottom: '1rem', fontWeight: 500 }}>
                Ebben a kategóriában nincs elérhető kerékpár.
              </div>
              <a href="/" style={{
                color: '#111111', fontWeight: 600, fontSize: '14px',
                textDecoration: 'underline',
              }}>← Összes kerékpár</a>
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
