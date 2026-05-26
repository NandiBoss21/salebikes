'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Bike } from '@/lib/supabase'

const CATEGORY_LABELS: Record<string, string> = {
  ebike: 'Ebike',
  mtb: 'MTB',
  trekking: 'Trekking',
  gravel: 'Gravel',
  gyerek: 'Gyerek',
  orszaguti: 'Országúti',
  kemping: 'Kemping',
  alkatreszek: 'Alkatrészek',
  ruhazat: 'Ruházat',
}

function fmt(n: number) {
  return n.toLocaleString('hu-HU') + ' Ft'
}

const SIZE_DATA: { min: number; max: number; label: string; range: string }[] = [
  { min: 0,   max: 158, label: 'XS',  range: '13–14" / 33–36 cm' },
  { min: 158, max: 168, label: 'S',   range: '15–16" / 38–41 cm' },
  { min: 168, max: 178, label: 'M',   range: '17–18" / 43–46 cm' },
  { min: 178, max: 185, label: 'L',   range: '19–20" / 48–51 cm' },
  { min: 185, max: 193, label: 'XL',  range: '21–22" / 53–56 cm' },
  { min: 193, max: 999, label: 'XXL', range: '23–24" / 58–61 cm' },
]

const SIZE_INCHES: Record<string, string[]> = {
  XS:  ['13', '14'],
  S:   ['15', '16'],
  M:   ['17', '18'],
  L:   ['19', '20'],
  XL:  ['21', '22'],
  XXL: ['23', '24'],
}

const SIZE_CMS: Record<string, string[]> = {
  XS:  ['33', '34', '35', '36'],
  S:   ['38', '39', '40', '41'],
  M:   ['43', '44', '45', '46'],
  L:   ['48', '49', '50', '51'],
  XL:  ['53', '54', '55', '56'],
  XXL: ['58', '59', '60', '61'],
}

function getSizeInfo(height: number) {
  return SIZE_DATA.find(s => height >= s.min && height < s.max) ?? SIZE_DATA[SIZE_DATA.length - 1]
}

function matchesSize(bikeSize: string | undefined, label: string): boolean {
  if (!bikeSize) return false
  const s = bikeSize.toUpperCase().trim()
  if (s === label) return true
  if (s.startsWith(label + ' ') || s.startsWith(label + '(') || s.startsWith(label + '/')) return true
  for (const inch of SIZE_INCHES[label] ?? []) {
    if (s.includes(inch + '"') || s.includes(inch + '-') || s === inch) return true
  }
  for (const cm of SIZE_CMS[label] ?? []) {
    if (s.includes(cm + ' CM') || s.includes(cm + 'CM') || s.endsWith(' ' + cm) || s === cm) return true
  }
  return false
}

export default function SizeCalculator() {
  const [height, setHeight] = useState(170)
  const [allBikes, setAllBikes] = useState<Bike[]>([])

  useEffect(() => {
    supabase
      .from('bikes')
      .select('*')
      .eq('available', true)
      .not('sold', 'eq', true)
      .then(({ data }) => setAllBikes((data || []) as Bike[]))
  }, [])

  const isChild = height < 148
  const { label, range } = getSizeInfo(height)
  const matchingBikes = isChild
    ? allBikes.filter(b => b.category === 'gyerek')
    : allBikes.filter(b => matchesSize(b.size, label) && b.category !== 'gyerek')

  return (
    <section id="meretkereso" style={{
      background: '#111111',
      padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div style={{
            fontSize: '10px', fontWeight: 800,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)', marginBottom: '0.6rem',
          }}>Méretkereső</div>
          <h2 style={{
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: '#ffffff', marginBottom: '0.5rem',
          }}>Találd meg a neked való kerékpárt</h2>
          <p style={{
            fontSize: '14px', color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.6,
          }}>Add meg a magasságod és megmutatjuk mi illik hozzád</p>
        </div>

        {/* Slider card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '2rem 2.5rem',
          maxWidth: '560px',
          margin: '0 auto 3rem',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: '1.25rem',
          }}>
            <label style={{
              fontSize: '13px', fontWeight: 600,
              color: 'rgba(255,255,255,0.55)', letterSpacing: '0.02em',
            }}>Magasságod</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="number"
                min={140} max={210}
                value={height}
                onChange={e => {
                  const v = parseInt(e.target.value)
                  if (!isNaN(v)) setHeight(Math.min(210, Math.max(140, v)))
                }}
                style={{
                  width: '64px', padding: '6px 10px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '6px',
                  color: '#ffffff', fontSize: '15px', fontWeight: 700,
                  textAlign: 'center', outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>cm</span>
            </div>
          </div>

          <style>{`
            .size-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.12); outline: none; }
            .size-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #e8c547; cursor: pointer; border: 3px solid #111111; box-shadow: 0 0 0 2px #e8c547; }
            .size-slider::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: #e8c547; cursor: pointer; border: 3px solid #111111; }
          `}</style>
          <input
            type="range"
            min={140} max={210}
            value={height}
            onChange={e => setHeight(parseInt(e.target.value))}
            className="size-slider"
          />
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '11px', color: 'rgba(255,255,255,0.2)',
            marginTop: '6px',
          }}>
            <span>140 cm</span>
            <span>210 cm</span>
          </div>

          {/* Result */}
          <div style={{
            marginTop: '1.75rem', paddingTop: '1.75rem',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
          }}>
            <div>
              <div style={{
                fontSize: '10px', fontWeight: 700,
                color: 'rgba(255,255,255,0.3)', marginBottom: '6px',
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>Ajánlott méret</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  background: '#e8c547', color: '#111111',
                  fontSize: '20px', fontWeight: 900,
                  padding: '4px 16px', borderRadius: '6px',
                  letterSpacing: '-0.02em', lineHeight: 1.4,
                }}>{isChild ? 'Gyerek' : label}</span>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                  {isChild ? '24" kerék és kisebb' : range}
                </span>
              </div>
            </div>
            <div style={{ fontSize: '13px' }}>
              {matchingBikes.length > 0
                ? <span style={{ color: '#e8c547', fontWeight: 700 }}>{matchingBikes.length} db raktáron</span>
                : <span style={{ color: 'rgba(255,255,255,0.3)' }}>Nincs raktáron</span>
              }
            </div>
          </div>
        </div>

        {/* Child-height message */}
        {isChild && (
          <p style={{
            textAlign: 'center', marginBottom: '1.5rem',
            fontSize: '14px', color: 'rgba(255,255,255,0.5)',
          }}>Gyerek kerékpárokat ajánlunk ennél a magasságnál.</p>
        )}

        {/* Bike grid */}
        {matchingBikes.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}>
            {matchingBikes.map(bike => {
              const img = bike.images?.[0]
              const pct = bike.original_price > bike.sale_price
                ? Math.round((1 - bike.sale_price / bike.original_price) * 100)
                : 0
              return (
                <div key={bike.id} style={{
                  background: '#1a1a1a',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  display: 'flex', flexDirection: 'column',
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(232,197,71,0.35)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                >
                  {/* Image */}
                  <div style={{
                    position: 'relative', aspectRatio: '3/2',
                    background: '#0d0d0d', flexShrink: 0, overflow: 'hidden',
                  }}>
                    {img ? (
                      <Image
                        src={img}
                        alt={`${bike.brand} ${bike.model}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 600px) 100vw, 300px"
                      />
                    ) : (
                      <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '40px', color: 'rgba(255,255,255,0.08)',
                      }}>🚲</div>
                    )}
                    {/* Category badge */}
                    <span style={{
                      position: 'absolute', top: 10, left: 10,
                      background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
                      color: 'rgba(255,255,255,0.75)',
                      fontSize: '10px', fontWeight: 700,
                      padding: '4px 10px', borderRadius: '5px',
                      textTransform: 'uppercase', letterSpacing: '0.04em',
                    }}>{CATEGORY_LABELS[bike.category] ?? bike.category}</span>
                    {/* Discount badge */}
                    {pct > 0 && (
                      <span style={{
                        position: 'absolute', top: 10, right: 10,
                        background: '#e8c547', color: '#111111',
                        fontSize: '11px', fontWeight: 800,
                        padding: '4px 10px', borderRadius: '5px',
                      }}>−{pct}%</span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                      fontSize: '10px', fontWeight: 700,
                      color: '#e8c547', letterSpacing: '0.06em',
                      textTransform: 'uppercase', marginBottom: '3px',
                    }}>{bike.brand}</div>
                    <div style={{
                      fontSize: '15px', fontWeight: 700,
                      color: '#ffffff', letterSpacing: '-0.02em',
                      lineHeight: 1.3, flex: 1,
                    }}>{bike.model}</div>
                    <div style={{
                      marginTop: '0.875rem',
                      paddingTop: '0.875rem',
                      borderTop: '1px solid rgba(255,255,255,0.07)',
                    }}>
                      <div style={{
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.25)',
                        textDecoration: 'line-through', marginBottom: '2px',
                      }}>{fmt(bike.original_price)}</div>
                      <div style={{
                        fontSize: '20px', fontWeight: 800,
                        color: '#ffffff', letterSpacing: '-0.04em', lineHeight: 1,
                      }}>{fmt(bike.sale_price)}</div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div style={{ padding: '0 1rem 1rem' }}>
                    <Link href={`/kerekpar/${bike.id}`} style={{
                      display: 'block', textAlign: 'center',
                      background: '#e8c547', color: '#111111',
                      padding: '12px', borderRadius: '7px',
                      fontSize: '13px', fontWeight: 800,
                      textDecoration: 'none', letterSpacing: '-0.01em',
                      transition: 'background 0.15s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#d4b23e')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#e8c547')}
                    >
                      Megnézem →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            color: 'rgba(255,255,255,0.35)',
            fontSize: '14px', lineHeight: 1.8,
          }}>
            <div style={{ fontSize: '36px', marginBottom: '1rem', opacity: 0.4 }}>🔍</div>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
              Jelenleg nincs raktáron ilyen méretű kerékpár –<br />
              hívj minket és segítünk!
            </div>
            <a href="tel:+36308897559" style={{
              display: 'inline-block', marginTop: '1.25rem',
              background: '#e8c547', color: '#111111',
              padding: '12px 28px', borderRadius: '7px',
              fontSize: '14px', fontWeight: 800,
              textDecoration: 'none', letterSpacing: '-0.01em',
            }}>Hívj minket</a>
          </div>
        )}
      </div>
    </section>
  )
}
