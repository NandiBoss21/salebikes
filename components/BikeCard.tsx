'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Phone } from 'lucide-react'
import type { Bike } from '@/lib/supabase'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

function fmt(n: number) {
  return n.toLocaleString('hu-HU') + ' Ft'
}

const CONDITION_TEXT: Record<string, string> = {
  outlet:   '0 km · Karcmentes',
  hasznalt: 'Jó állapot',
}

export default function BikeCard({ bike, delay }: { bike: Bike; delay?: number }) {
  const animRef = useScrollAnimation<HTMLDivElement>(delay)
  const img = bike.images?.[0]
  const savings = bike.original_price - bike.sale_price
  const pct = bike.original_price > bike.sale_price
    ? Math.round((1 - bike.sale_price / bike.original_price) * 100)
    : 0
  const condText = CONDITION_TEXT[bike.condition] ?? bike.condition

  return (
    <div ref={animRef}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #E8E4DC',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        transition: 'box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'
          ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
          ;(e.currentTarget as HTMLDivElement).style.transform = 'none'
        }}
      >
        <Link href={`/kerekpar/${bike.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1, display: 'flex', flexDirection: 'column' }}>

          {/* Image — 60% of card visual weight */}
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

            {/* Utolsó darab — bottom strip, only for featured outlet bikes */}
            {bike.condition === 'outlet' && bike.featured && (
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'rgba(220,38,38,0.92)',
                padding: '5px 10px',
                fontSize: '11px', fontWeight: 700,
                color: '#ffffff', letterSpacing: '0.03em',
                textTransform: 'uppercase', textAlign: 'center',
              }}>
                Utolsó darab
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ padding: '1rem 1rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
              <div style={{
                fontSize: '10px', fontWeight: 700,
                color: '#e8c547', letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>{bike.brand}</div>
              <div style={{
                fontSize: '10px', fontWeight: 600,
                color: bike.condition === 'outlet' ? '#059669' : '#6B6B6B',
                letterSpacing: '-0.01em',
              }}>{condText}</div>
            </div>

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
              borderTop: '1px solid #E8E4DC',
            }}>
              <div style={{
                fontSize: '11px', color: '#6B6B6B',
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
            gap: '6px', padding: '14px',
            minHeight: '48px',
            background: '#111111', color: '#ffffff',
            borderRadius: '7px', textDecoration: 'none',
            fontSize: '13px', fontWeight: 700,
            letterSpacing: '-0.01em',
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = '#333333')}
            onMouseLeave={e => (e.currentTarget.style.background = '#111111')}
          >
            <Phone size={13} />
            Érdeklődöm
          </a>
        </div>
      </div>
    </div>
  )
}
