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
    async function fetchBikes() {
      setLoading(true)
      const { data } = await supabase
        .from('bikes')
        .select('*')
        .eq('available', true)
        .eq('category', category)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
      setBikes((data || []) as Bike[])
      setLoading(false)
    }
    fetchBikes()
  }, [category])

  return (
    <>
      <Navbar />

      <section style={{ padding: '4rem 2rem 3.5rem' }}>
        <div style={{
          display: 'inline-block',
          fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: '#e8c547',
          border: '1px solid rgba(232,197,71,0.4)',
          padding: '4px 12px', borderRadius: '2px',
          marginBottom: '1.2rem',
        }}>
          Outlet · Bemutató · Használt
        </div>

        <h1 style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
          lineHeight: 0.95,
          textTransform: 'uppercase',
          letterSpacing: '-0.01em',
          marginBottom: '2.5rem',
        }}>
          {label}<br />
          <span style={{ color: '#e8c547' }}>kerékpárok</span>
        </h1>

        {loading ? (
          <div style={{
            textAlign: 'center', padding: '4rem',
            color: 'rgba(240,237,232,0.3)', fontSize: '15px',
          }}>
            Kerékpárok betöltése…
          </div>
        ) : bikes.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '4rem',
            color: 'rgba(240,237,232,0.4)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🚲</div>
            <div style={{ fontSize: '18px' }}>Ebben a kategóriában nincs elérhető kerékpár.</div>
            <a href="/" style={{
              color: '#e8c547', marginTop: '1rem', display: 'inline-block',
              textDecoration: 'none',
            }}>← Összes kerékpár</a>
          </div>
        ) : (
          <>
            <div style={{
              fontSize: '13px', color: 'rgba(240,237,232,0.4)',
              marginBottom: '1.5rem',
            }}>{bikes.length} kerékpár elérhető</div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5px',
              background: 'rgba(255,255,255,0.06)',
            }}>
              {bikes.map(bike => (
                <BikeCard key={bike.id} bike={bike} />
              ))}
            </div>
          </>
        )}
      </section>

      <a href="tel:+36308897559" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#e8c547', color: '#0a0a0a',
        textAlign: 'center', padding: '16px',
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 700, fontSize: '16px',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: '12px',
        textDecoration: 'none', zIndex: 200,
      }}>
        <Phone size={18} />
        Hívj most és egyeztessünk időpontot
        <span style={{
          background: '#0a0a0a', color: '#e8c547',
          fontSize: '13px', padding: '3px 10px',
          borderRadius: '20px', fontWeight: 700,
        }}>+36 30 889 7559</span>
      </a>
    </>
  )
}
