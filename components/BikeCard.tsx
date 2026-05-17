'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone } from 'lucide-react'
import type { Bike } from '@/lib/supabase'

function formatPrice(p: number) {
  return p.toLocaleString('hu-HU') + ' Ft'
}

export default function BikeCard({ bike }: { bike: Bike }) {
  const [hovered, setHovered] = useState(false)
  const img = bike.images?.[0]
  const pct = bike.original_price > bike.sale_price
    ? Math.round((1 - bike.sale_price / bike.original_price) * 100)
    : 0

  return (
    <div style={{
      background: '#ffffff',
      display: 'flex', flexDirection: 'column',
      border: '1px solid rgba(0,0,0,0.06)',
      transition: 'box-shadow 0.3s ease',
      boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.10)' : '0 1px 4px rgba(0,0,0,0.04)',
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/kerekpar/${bike.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* Image – 70% of card */}
        <div className="bike-img-wrap" style={{
          position: 'relative', overflow: 'hidden',
          aspectRatio: '4/3',
          background: '#f0f0ee', flexShrink: 0,
        }}>
          {img ? (
            <Image
              src={img}
              alt={`${bike.brand} ${bike.model}`}
              fill
              className="bike-img"
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '56px', color: 'rgba(0,0,0,0.1)',
            }}>🚲</div>
          )}

          {/* Condition badge */}
          <span style={{
            position: 'absolute', top: '12px', left: '12px',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700, fontSize: '11px',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '4px 10px', borderRadius: '2px',
            background: bike.condition === 'outlet' ? '#e8c547' : '#0a0a0a',
            color: bike.condition === 'outlet' ? '#0a0a0a' : '#ffffff',
          }}>
            {bike.condition === 'outlet' ? 'Outlet · Új' : 'Használt'}
          </span>

          {/* Discount badge */}
          {pct > 0 && (
            <span style={{
              position: 'absolute', top: '12px', right: '12px',
              background: '#0a0a0a', color: '#e8c547',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700, fontSize: '13px',
              padding: '4px 10px', borderRadius: '2px',
            }}>−{pct}%</span>
          )}
        </div>

        {/* Text – minimal */}
        <div style={{ padding: '1rem 1.25rem 0.75rem' }}>
          <div style={{
            fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#e8c547', marginBottom: '3px',
          }}>{bike.brand}</div>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700, fontSize: '1.1rem',
            textTransform: 'uppercase', letterSpacing: '0.02em',
            lineHeight: 1.1, marginBottom: '0.75rem', color: '#0a0a0a',
          }}>{bike.model}</div>
          <div style={{
            display: 'flex', alignItems: 'baseline',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(0,0,0,0.07)', paddingTop: '0.75rem',
          }}>
            <div>
              <div style={{
                fontSize: '11px', color: 'rgba(0,0,0,0.35)',
                textDecoration: 'line-through', marginBottom: '1px',
              }}>{formatPrice(bike.original_price)}</div>
              <div style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700, fontSize: '1.3rem', color: '#0a0a0a',
              }}>{formatPrice(bike.sale_price)}</div>
            </div>
            {bike.featured && (
              <span style={{
                fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: '#c0392b',
              }}>Népszerű</span>
            )}
          </div>
        </div>
      </Link>

      {/* CTA */}
      <div style={{ padding: '0 1.25rem 1.25rem' }}>
        <a href="tel:+36308897559" style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '6px',
          padding: '10px',
          background: '#e8c547', color: '#0a0a0a',
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 700, fontSize: '12px',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          textDecoration: 'none', borderRadius: '2px',
          transition: 'background 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = '#d4b23e')}
          onMouseLeave={e => (e.currentTarget.style.background = '#e8c547')}
        >
          <Phone size={13} />
          Érdeklődöm
        </a>
      </div>
    </div>
  )
}
