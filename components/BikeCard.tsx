import Link from 'next/link'
import Image from 'next/image'
import { Phone } from 'lucide-react'
import type { Bike } from '@/lib/supabase'

function formatPrice(p: number) {
  return p.toLocaleString('hu-HU') + ' Ft'
}

function savings(original: number, sale: number) {
  const diff = original - sale
  if (diff >= 1000000) return `−${(diff/1000000).toFixed(1)}M Ft`
  return `−${Math.round(diff/1000)}e Ft`
}

export default function BikeCard({ bike }: { bike: Bike }) {
  const img = bike.images?.[0]
  const conditionLabel = bike.condition === 'outlet' ? 'Outlet · Új' : 'Használt'
  const conditionStyle = bike.condition === 'outlet'
    ? { background: '#e8c547', color: '#0a0a0a' }
    : { background: 'rgba(240,237,232,0.15)', color: '#f0ede8' }

  return (
    <div style={{
      background: '#111111',
      transition: 'background 0.15s',
      position: 'relative',
      display: 'flex', flexDirection: 'column',
    }}
      onMouseEnter={e => (e.currentTarget.style.background = '#161616')}
      onMouseLeave={e => (e.currentTarget.style.background = '#111111')}
    >
      <Link href={`/kerékpár/${bike.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {/* Image */}
        <div style={{
          width: '100%', aspectRatio: '4/3',
          background: '#1a1a1a', position: 'relative',
          overflow: 'hidden',
        }}>
          {img ? (
            <Image
              src={img}
              alt={`${bike.brand} ${bike.model}`}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.1)', fontSize: '48px',
            }}>🚲</div>
          )}

          <span style={{
            position: 'absolute', top: '12px', left: '12px',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700, fontSize: '11px',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '3px 8px', borderRadius: '2px',
            ...conditionStyle,
          }}>
            {conditionLabel}
          </span>

          {bike.featured && (
            <span style={{
              position: 'absolute', top: '12px', right: '12px',
              background: '#c0392b', color: '#fff',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700, fontSize: '11px',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '3px 8px', borderRadius: '2px',
            }}>Népszerű</span>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem 1.25rem 1rem' }}>
          <div style={{
            fontSize: '11px', fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#e8c547', marginBottom: '4px',
          }}>{bike.brand}</div>

          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700, fontSize: '1.15rem',
            textTransform: 'uppercase', letterSpacing: '0.02em',
            marginBottom: '8px', lineHeight: 1.1,
          }}>{bike.model}</div>

          {bike.specs?.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {bike.specs.slice(0, 3).map((s, i) => (
                <span key={i} style={{
                  fontSize: '10px', fontWeight: 500,
                  letterSpacing: '0.05em', padding: '3px 7px',
                  border: '1px solid rgba(240,237,232,0.15)',
                  borderRadius: '2px',
                  color: 'rgba(240,237,232,0.5)',
                  textTransform: 'uppercase',
                }}>{s}</span>
              ))}
            </div>
          )}

          <div style={{
            display: 'flex', alignItems: 'baseline',
            justifyContent: 'space-between',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}>
            <div>
              <div style={{
                fontSize: '12px',
                color: 'rgba(240,237,232,0.35)',
                textDecoration: 'line-through',
              }}>Bolti ár: {formatPrice(bike.original_price)}</div>
              <div style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700, fontSize: '1.4rem',
              }}>{formatPrice(bike.sale_price)}</div>
            </div>
            <div style={{
              fontSize: '11px', fontWeight: 600,
              color: '#e8c547', letterSpacing: '0.05em',
            }}>{savings(bike.original_price, bike.sale_price)}</div>
          </div>
        </div>
      </Link>

      {/* CTA */}
      <div style={{ padding: '0 1.25rem 1.25rem' }}>
        <a href="tel:+36308897559" style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '6px',
          padding: '10px 14px',
          background: 'rgba(232,197,71,0.08)',
          border: '1px solid rgba(232,197,71,0.2)',
          color: '#e8c547',
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 600, fontSize: '13px',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          width: '100%', cursor: 'pointer',
          borderRadius: '2px', textDecoration: 'none',
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.background = '#e8c547'
            el.style.color = '#0a0a0a'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.background = 'rgba(232,197,71,0.08)'
            el.style.color = '#e8c547'
          }}
        >
          <Phone size={14} />
          Érdeklődöm
        </a>
      </div>
    </div>
  )
}
