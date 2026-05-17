import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
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
    description: `${bike.brand} ${bike.model} outlet kerékpár ${bike.sale_price.toLocaleString('hu-HU')} Ft-ért. Bolti ár: ${bike.original_price.toLocaleString('hu-HU')} Ft. 3 hónap garancia, adásvételi szerződés.`,
  }
}

export default async function BikePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data } = await supabase.from('bikes').select('*').eq('id', id).single()

  if (!data) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(240,237,232,0.4)' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🚲</div>
          <div>Ez a kerékpár már nem elérhető.</div>
          <Link href="/" style={{ color: '#e8c547', marginTop: '1rem', display: 'inline-block' }}>← Vissza a kínálathoz</Link>
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

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: 'rgba(240,237,232,0.5)', textDecoration: 'none',
          fontSize: '13px', marginBottom: '2rem',
        }}>
          <ChevronLeft size={16} /> Vissza a kínálathoz
        </Link>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
        }}>
          {/* Images */}
          <div>
            {bike.images?.length > 0 ? (
              <>
                <div style={{
                  width: '100%', aspectRatio: '4/3',
                  background: '#1a1a1a', borderRadius: '2px',
                  overflow: 'hidden', marginBottom: '8px',
                }}>
                  <img src={bike.images[0]} alt={`${bike.brand} ${bike.model}`} style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                  }} />
                </div>
                {bike.images.length > 1 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${Math.min(bike.images.length - 1, 4)}, 1fr)`,
                    gap: '8px',
                  }}>
                    {bike.images.slice(1).map((img, i) => (
                      <div key={i} style={{
                        aspectRatio: '4/3', background: '#1a1a1a',
                        borderRadius: '2px', overflow: 'hidden',
                      }}>
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{
                width: '100%', aspectRatio: '4/3',
                background: '#1a1a1a', borderRadius: '2px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '64px',
              }}>🚲</div>
            )}
          </div>

          {/* Details */}
          <div>
            <div style={{
              display: 'inline-block',
              fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#e8c547', marginBottom: '8px',
            }}>
              {bike.brand} · {bike.condition === 'outlet' ? 'Outlet / Bemutató' : 'Használt'}
            </div>

            <h1 style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 900, fontSize: '2.5rem',
              textTransform: 'uppercase', lineHeight: 1,
              marginBottom: '1.5rem',
            }}>{bike.model}</h1>

            {/* Price block */}
            <div style={{
              background: '#111', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '4px', padding: '1.5rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ fontSize: '13px', color: 'rgba(240,237,232,0.4)', marginBottom: '4px' }}>
                Bolti ár: <span style={{ textDecoration: 'line-through' }}>{bike.original_price.toLocaleString('hu-HU')} Ft</span>
              </div>
              <div style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 900, fontSize: '2.8rem',
                lineHeight: 1, marginBottom: '8px',
              }}>{bike.sale_price.toLocaleString('hu-HU')} Ft</div>
              <div style={{
                background: 'rgba(232,197,71,0.15)',
                border: '1px solid rgba(232,197,71,0.3)',
                borderRadius: '2px', padding: '6px 12px',
                display: 'inline-flex', gap: '8px',
                fontSize: '13px', color: '#e8c547', fontWeight: 600,
              }}>
                {savings.toLocaleString('hu-HU')} Ft megtakarítás · {pct}% kedvezmény
              </div>
            </div>

            {/* CTA */}
            <a href="tel:+36308897559" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '10px', width: '100%', padding: '16px',
              background: '#e8c547', color: '#0a0a0a',
              borderRadius: '2px', textDecoration: 'none',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700, fontSize: '18px',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}>
              <Phone size={20} />
              Érdeklődöm – +36 30 889 7559
            </a>

            {/* Specs */}
            {bike.specs?.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  fontSize: '11px', fontWeight: 600,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: 'rgba(240,237,232,0.4)', marginBottom: '10px',
                }}>Komponensek</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {bike.specs.map((s, i) => (
                    <span key={i} style={{
                      fontSize: '12px', padding: '5px 10px',
                      border: '1px solid rgba(240,237,232,0.15)',
                      borderRadius: '2px', color: 'rgba(240,237,232,0.7)',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Details */}
            {(bike.size || bike.year || bike.color) && (
              <div style={{
                background: '#111', borderRadius: '4px',
                padding: '1rem', marginBottom: '1.5rem',
              }}>
                {[
                  { label: 'Méret', val: bike.size },
                  { label: 'Évjárat', val: bike.year?.toString() },
                  { label: 'Szín', val: bike.color },
                ].filter(r => r.val).map(row => (
                  <div key={row.label} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '6px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    fontSize: '13px',
                  }}>
                    <span style={{ color: 'rgba(240,237,232,0.4)' }}>{row.label}</span>
                    <span>{row.val}</span>
                  </div>
                ))}
              </div>
            )}

            {bike.description && (
              <p style={{
                fontSize: '14px', lineHeight: 1.7,
                color: 'rgba(240,237,232,0.6)',
                marginBottom: '1.5rem',
              }}>{bike.description}</p>
            )}

            {/* Guarantees */}
            <div style={{
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '4px', padding: '1.25rem',
            }}>
              {[
                { icon: <Shield size={16} />, text: '3 hónap garancia rendeltetésszerű használat mellett' },
                { icon: <FileText size={16} />, text: 'Adásvételi szerződés alvázszámmal' },
                { icon: <RotateCcw size={16} />, text: 'Visszavétel ha nem felel meg az elvárásoknak' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 0',
                  borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  fontSize: '13px', color: 'rgba(240,237,232,0.7)',
                }}>
                  <span style={{ color: '#e8c547', flexShrink: 0 }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <a href="tel:+36308897559" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#e8c547', color: '#0a0a0a',
        padding: '16px', textAlign: 'center',
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 700, fontSize: '16px',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: '12px',
        textDecoration: 'none', zIndex: 200,
      }}>
        <Phone size={18} />
        Hívj most – +36 30 889 7559
      </a>
    </>
  )
}
