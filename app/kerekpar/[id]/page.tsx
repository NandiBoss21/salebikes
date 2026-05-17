import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import BikeGallery from '@/components/BikeGallery'
import { Phone, Shield, FileText, RotateCcw, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import type { Bike } from '@/lib/supabase'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const { data } = await supabase.from('bikes').select('*').eq('id', id).single()
  if (!data) return { title: 'Kerékpár | SaleBikes' }
  const bike = data as Bike
  return {
    title: `${bike.brand} ${bike.model} – ${bike.sale_price.toLocaleString('hu-HU')} Ft | SaleBikes`,
    description: `${bike.brand} ${bike.model} ${bike.condition === 'outlet' ? 'outlet' : 'használt'} kerékpár ${bike.sale_price.toLocaleString('hu-HU')} Ft-ért. Bolti ár: ${bike.original_price.toLocaleString('hu-HU')} Ft. 3 hónap garancia, adásvételi szerződés.`,
  }
}

export default async function BikePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data } = await supabase.from('bikes').select('*').eq('id', id).single()

  if (!data) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
          <div style={{ fontSize: '40px', marginBottom: '1rem' }}>🚲</div>
          <div style={{ fontSize: '16px', color: 'rgba(17,17,17,0.5)', marginBottom: '1.5rem' }}>
            Ez a kerékpár már nem elérhető.
          </div>
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: '#111111', fontWeight: 600, fontSize: '14px',
          }}>
            <ChevronLeft size={16} /> Vissza a kínálathoz
          </Link>
        </div>
      </>
    )
  }

  const bike = data as Bike
  const savings = bike.original_price - bike.sale_price
  const pct = Math.round((1 - bike.sale_price / bike.original_price) * 100)

  return (
    <>
      <Navbar />

      <div className="bike-detail-wrap">

        {/* Back link */}
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontSize: '13px', fontWeight: 500,
          color: 'rgba(17,17,17,0.45)', textDecoration: 'none',
          marginBottom: '2rem',
          transition: 'color 0.15s',
        }}>
          <ChevronLeft size={15} /> Vissza a kínálathoz
        </Link>

        <div className="bike-detail-grid">

          {/* Left — gallery */}
          <div>
            <BikeGallery images={bike.images || []} alt={`${bike.brand} ${bike.model}`} />
          </div>

          {/* Right — details */}
          <div>
            {/* Brand + condition */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
              <span style={{
                fontSize: '11px', fontWeight: 700,
                color: '#e8c547', letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>{bike.brand}</span>
              <span style={{
                fontSize: '10px', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.05em',
                padding: '3px 9px', borderRadius: '4px',
                background: bike.condition === 'outlet' ? '#e8c547' : '#111111',
                color: bike.condition === 'outlet' ? '#111111' : '#ffffff',
              }}>
                {bike.condition === 'outlet' ? 'Outlet' : 'Használt'}
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              fontWeight: 800, letterSpacing: '-0.04em',
              color: '#111111', lineHeight: 1.1,
              marginBottom: '1.75rem',
            }}>{bike.model}</h1>

            {/* Price block */}
            <div style={{
              background: '#f9f9f9',
              border: '1px solid rgba(0,0,0,0.07)',
              borderRadius: '10px',
              padding: '1.5rem',
              marginBottom: '1.25rem',
            }}>
              <div style={{
                fontSize: '13px', color: 'rgba(17,17,17,0.4)',
                textDecoration: 'line-through', marginBottom: '6px',
                letterSpacing: '-0.01em',
              }}>
                Bolti ár: {bike.original_price.toLocaleString('hu-HU')} Ft
              </div>
              <div style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 900, letterSpacing: '-0.05em',
                color: '#111111', lineHeight: 1, marginBottom: '12px',
              }}>{bike.sale_price.toLocaleString('hu-HU')} Ft</div>
              {savings > 0 && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: '#e8c547',
                  borderRadius: '6px', padding: '7px 14px',
                  fontSize: '14px', fontWeight: 700,
                  color: '#111111', letterSpacing: '-0.02em',
                }}>
                  −{savings.toLocaleString('hu-HU')} Ft megtakarítás · −{pct}%
                </div>
              )}
            </div>

            {/* CTA — desktop */}
            <a href="tel:+36308897559" className="hide-mobile" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '10px', width: '100%', padding: '16px',
              background: '#e8c547', color: '#111111',
              borderRadius: '9px', textDecoration: 'none',
              fontSize: '16px', fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '1.5rem',
              transition: 'background 0.15s',
            }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.background = '#d4b23e')}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.background = '#e8c547')}
            >
              <Phone size={18} />
              Érdeklődöm – +36 30 889 7559
            </a>

            {/* Specs */}
            {bike.specs?.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  color: 'rgba(17,17,17,0.35)', marginBottom: '10px',
                }}>Komponensek</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {bike.specs.map((s, i) => (
                    <span key={i} style={{
                      fontSize: '12px', fontWeight: 500,
                      padding: '5px 11px',
                      border: '1px solid rgba(0,0,0,0.10)',
                      borderRadius: '5px', color: 'rgba(17,17,17,0.7)',
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Details table */}
            {(bike.size || bike.year || bike.color) && (
              <div style={{
                border: '1px solid rgba(0,0,0,0.07)',
                borderRadius: '10px', overflow: 'hidden',
                marginBottom: '1.5rem',
              }}>
                {[
                  { label: 'Méret', val: bike.size },
                  { label: 'Évjárat', val: bike.year?.toString() },
                  { label: 'Szín', val: bike.color },
                ].filter(r => r.val).map((row, i, arr) => (
                  <div key={row.label} style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderBottom: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                    background: i % 2 === 0 ? '#ffffff' : '#fafafa',
                  }}>
                    <span style={{ fontSize: '13px', color: 'rgba(17,17,17,0.45)', fontWeight: 500 }}>{row.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{row.val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            {bike.description && (
              <p style={{
                fontSize: '14px', lineHeight: 1.7,
                color: 'rgba(17,17,17,0.55)',
                marginBottom: '1.5rem',
              }}>{bike.description}</p>
            )}

            {/* Guarantee list */}
            <div style={{
              border: '1px solid rgba(0,0,0,0.07)',
              borderRadius: '10px', padding: '1.25rem',
            }}>
              {[
                { icon: <Shield size={15} />, text: '3 hónap garancia rendeltetésszerű használat mellett' },
                { icon: <FileText size={15} />, text: 'Adásvételi szerződés alvázszámmal' },
                { icon: <RotateCcw size={15} />, text: 'Visszavétel ha nem felel meg az elvárásoknak' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                  padding: '10px 0',
                  borderBottom: i < 2 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  fontSize: '13px', color: 'rgba(17,17,17,0.65)',
                  lineHeight: 1.4,
                }}>
                  <span style={{ color: '#e8c547', flexShrink: 0, marginTop: '1px' }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA — mobile only */}
      <a href="tel:+36308897559" className="mobile-cta" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: '#e8c547', color: '#111111',
        alignItems: 'center', justifyContent: 'center',
        gap: '10px', padding: '16px',
        fontSize: '15px', fontWeight: 800,
        letterSpacing: '-0.01em', textDecoration: 'none',
      }}>
        <Phone size={17} />
        Érdeklődöm – +36 30 889 7559
      </a>
    </>
  )
}
