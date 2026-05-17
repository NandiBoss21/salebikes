'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Phone } from 'lucide-react'
import type { Bike } from '@/lib/supabase'

function fmt(n: number) {
  return n.toLocaleString('hu-HU') + ' Ft'
}

export default function BikeCard({ bike }: { bike: Bike }) {
  const img = bike.images?.[0]
  const savings = bike.original_price - bike.sale_price
  const pct = bike.original_price > bike.sale_price
    ? Math.round((1 - bike.sale_price / bike.original_price) * 100)
    : 0

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid rgba(0,0,0,0.07)',
      borderRadius: '10px',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      transition: 'box-shadow 0.2s ease, transform 0.2s ease',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 28px rgba(0,0,0,0.10)'
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
        ;(e.currentTarget as HTMLDivElement).style.transform = 'none'
      }}
    >
      <Link href={`/kerekpar/${bike.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Image — 65% of card visual weight */}
        <div className="card-img-wrap" style={{
          position: 'relative', overflow: 'hidden',
          aspectRatio: '3/2',
          background: '#f5f5f5', flexShrink: 0,
        }}>
          {img ? (
            <Image
              src={img}
              alt={`${bike.brand} ${bike.model}`}
              fill
              className="card-img"
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '48px', color: 'rgba(0,0,0,0.12)',
            }}>🚲</div>
          )}

          {/* Condition badge — top left */}
          <span style={{
            position: 'absolute', top: 10, left: 10,
            fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.04em', textTransform: 'uppercase',
            padding: '4px 10px', borderRadius: '5px',
            background: bike.condition === 'outlet' ? '#e8c547' : '#111111',
            color: bike.condition === 'outlet' ? '#111111' : '#ffffff',
          }}>
            {bike.condition === 'outlet' ? 'Outlet' : 'Használt'}
          </span>

          {/* Discount badge — top right */}
          {pct > 0 && (
            <span style={{
              position: 'absolute', top: 10, right: 10,
              fontSize: '11px', fontWeight: 800,
              padding: '4px 10px', borderRadius: '5px',
              background: '#111111', color: '#e8c547',
              letterSpacing: '-0.01em',
            }}>
              −{pct}%
            </span>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '1rem 1rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontSize: '10px', fontWeight: 700,
            color: '#e8c547', letterSpacing: '0.06em',
            textTransform: 'uppercase', marginBottom: '4px',
          }}>{bike.brand}</div>

          <div style={{
            fontSize: '15px', fontWeight: 700,
            color: '#111111', lineHeight: 1.3,
            letterSpacing: '-0.02em',
            marginBottom: 'auto',
          }}>{bike.model}</div>

          {/* Price row */}
          <div style={{
            marginTop: '0.875rem',
            paddingTop: '0.875rem',
            borderTop: '1px solid rgba(0,0,0,0.07)',
          }}>
            <div style={{
              fontSize: '11px', color: 'rgba(17,17,17,0.35)',
              textDecoration: 'line-through', marginBottom: '3px',
              letterSpacing: '-0.01em',
            }}>{fmt(bike.original_price)}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{
                fontSize: '21px', fontWeight: 800,
                color: '#111111', letterSpacing: '-0.04em', lineHeight: 1,
              }}>{fmt(bike.sale_price)}</div>
              {savings > 0 && (
                <div style={{
                  fontSize: '11px', fontWeight: 700,
                  color: '#111111', background: '#e8c547',
                  padding: '4px 9px', borderRadius: '5px',
                  letterSpacing: '-0.01em', whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                  −{savings.toLocaleString('hu-HU')} Ft
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* CTA */}
      <div style={{ padding: '0 1rem 1rem' }}>
        <a href="tel:+36308897559" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '6px', padding: '11px',
          background: '#e8c547', color: '#111111',
          borderRadius: '7px', textDecoration: 'none',
          fontSize: '13px', fontWeight: 700,
          letterSpacing: '-0.01em',
          transition: 'background 0.15s',
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
