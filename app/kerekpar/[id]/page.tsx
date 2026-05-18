import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import BikeGallery from '@/components/BikeGallery'
import { Phone, CheckCircle, ChevronLeft } from 'lucide-react'
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

const CONDITION_LEVELS = [
  { label: 'Új',        desc: 'Bemutató darab, 0 km, karcmentes. Gyárihoz azonos állapot.' },
  { label: 'Kiváló',   desc: 'Alig használt, 1–2 szezon. Kopásnyomok nélkül.' },
  { label: 'Jó',        desc: 'Normálisan használt. Kisebb esztétikai kopásnyomok.' },
  { label: 'Megfelelő', desc: 'Rendszeres használat nyomai láthatók. Műszakilag kifogástalan.' },
]
const CONDITION_IDX: Record<string, number> = { outlet: 0, hasznalt: 2 }

// Subtle tinted background based on bike color — max ~5% color, never darker than #e8e8e8
function getBikeBackground(color?: string | null): string {
  if (!color) return '#fafaf8'
  const c = color.toLowerCase()
  if (/fekete|black|sötét|charcoal|grafite|grafit/.test(c)) return '#f0f0f0'
  if (/zöld|green|olive|khaki|forest|lime/.test(c))          return '#f2f5f2'
  if (/kék|blue|navy|cobalt|teal|türkiz/.test(c))            return '#f2f3f8'
  if (/piros|red|bordó|narancs|orange|coral|rose|pink/.test(c)) return '#fdf2f2'
  return '#fafaf8'
}

// Strip lines that contain boilerplate already shown elsewhere on the page
const STRIP_KEYWORDS = ['Bolti ár', 'salebikes.hu', 'Kápolnásnyék', '+36']
function cleanDescription(text: string): string {
  return text
    .split('\n')
    .filter(line => !STRIP_KEYWORDS.some(kw => line.includes(kw)))
    .join('\n')
    .trim()
}

export default async function BikePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data } = await supabase.from('bikes').select('*').eq('id', id).single()

  if (!data) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '6rem 2rem', background: '#fafaf8' }}>
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
  const condIdx = CONDITION_IDX[bike.condition] ?? 2
  const viewers = (id.charCodeAt(id.length - 1) % 8) + 3
  const pageBg = getBikeBackground(bike.color)
  const cleanDesc = bike.description ? cleanDescription(bike.description) : ''

  return (
    <>
      <Navbar />

      <div className="bike-detail-wrap" style={{
        background: pageBg,
        transition: 'background 0.6s ease',
      }}>

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
              background: '#f5f3ef',
              border: '1px solid rgba(0,0,0,0.07)',
              borderRadius: '10px',
              padding: '1.5rem',
              marginBottom: '1.75rem',
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

            {/* Condition scale */}
            <div style={{ marginBottom: '1.75rem', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{
                  fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  color: 'rgba(17,17,17,0.35)',
                }}>Állapot</div>
                <details style={{ display: 'inline' }}>
                  <summary style={{
                    fontSize: '12px', fontWeight: 500,
                    color: '#e8c547', cursor: 'pointer',
                    listStyle: 'none',
                  }}>Mit jelent ez?</summary>
                  <div style={{
                    position: 'absolute', zIndex: 10,
                    background: '#111111', color: '#ffffff',
                    borderRadius: '8px', padding: '1rem 1.25rem',
                    width: '260px', right: 0,
                    fontSize: '12px', lineHeight: 1.6,
                    marginTop: '6px',
                  }}>
                    {CONDITION_LEVELS.map((c, i) => (
                      <div key={c.label} style={{
                        paddingBottom: i < CONDITION_LEVELS.length - 1 ? '10px' : 0,
                        marginBottom: i < CONDITION_LEVELS.length - 1 ? '10px' : 0,
                        borderBottom: i < CONDITION_LEVELS.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                      }}>
                        <strong style={{ color: i === condIdx ? '#e8c547' : '#ffffff' }}>{c.label}</strong>
                        {' – '}{c.desc}
                      </div>
                    ))}
                  </div>
                </details>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                {CONDITION_LEVELS.map((c, i) => (
                  <div key={c.label} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{
                      height: '4px', borderRadius: '2px',
                      background: i <= condIdx ? '#e8c547' : 'rgba(0,0,0,0.1)',
                      marginBottom: '6px',
                      transition: 'background 0.2s',
                    }} />
                    <div style={{
                      fontSize: '10px', fontWeight: i === condIdx ? 700 : 500,
                      color: i === condIdx ? '#111111' : 'rgba(17,17,17,0.35)',
                      letterSpacing: '-0.01em',
                    }}>{c.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Viewers counter */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '12px', fontWeight: 500,
              color: 'rgba(17,17,17,0.5)',
              marginBottom: '1.5rem',
            }}>
              <span style={{
                display: 'inline-block', width: '8px', height: '8px',
                borderRadius: '50%', background: '#22c55e',
                boxShadow: '0 0 0 3px rgba(34,197,94,0.2)',
              }} />
              {viewers} ember nézte ma
            </div>

            {/* CTA — desktop */}
            <a href="tel:+36308897559" className="bike-cta-btn hide-mobile" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '10px', width: '100%', padding: '16px',
              color: '#111111',
              borderRadius: '9px', textDecoration: 'none',
              fontSize: '16px', fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '1.5rem',
            }}>
              <Phone size={18} />
              Érdeklődöm – +36 30 889 7559
            </a>

            {/* Specs */}
            {bike.specs?.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
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
                marginBottom: '2.25rem',
              }}>
                {[
                  { label: 'Méret',   val: bike.size },
                  { label: 'Évjárat', val: bike.year?.toString() },
                  { label: 'Szín',    val: bike.color },
                ].filter(r => r.val).map((row, i, arr) => (
                  <div key={row.label} style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderBottom: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                    background: i % 2 === 0 ? '#ffffff' : '#fafaf8',
                  }}>
                    <span style={{ fontSize: '13px', color: 'rgba(17,17,17,0.45)', fontWeight: 500 }}>{row.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{row.val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Description — boilerplate lines filtered, newlines preserved */}
            {cleanDesc && (
              <p style={{
                fontSize: '14px', lineHeight: 1.8,
                color: 'rgba(17,17,17,0.55)',
                marginBottom: '2rem',
                whiteSpace: 'pre-line',
              }}>{cleanDesc}</p>
            )}

            {/* Guarantee list */}
            <div style={{
              border: '1px solid rgba(0,0,0,0.07)',
              borderRadius: '12px', padding: '0.25rem 1.5rem',
              background: '#fafaf8',
            }}>
              {[
                '3 hónap garancia rendeltetésszerű használat mellett',
                'Adásvételi szerződés alvázszámmal',
                'Visszavétel ha nem felel meg az elvárásoknak',
              ].map((text, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '16px 0',
                  borderBottom: i < 2 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  fontSize: '14px', fontWeight: 500,
                  color: 'rgba(17,17,17,0.75)',
                  lineHeight: 1.4,
                }}>
                  <span style={{ color: '#22c55e', flexShrink: 0 }}>
                    <CheckCircle size={18} />
                  </span>
                  {text}
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
