import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import BikeGallery from '@/components/BikeGallery'
import TrackPageView from '@/components/TrackPageView'
import { InquiryButtonDesktop, InquiryButtonMobile } from '@/components/InquiryButton'
import { CheckCircle, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import type { Bike } from '@/lib/supabase'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const { data } = await supabase.from('bikes').select('*').eq('id', id).eq('is_deleted', false).single()
  if (!data) return { title: 'Kerékpár | SaleBikes' }
  const bike = data as Bike
  const rawImage = Array.isArray(bike.images) && bike.images.length > 0
    ? bike.images[0]
    : null
  const bikeImage = rawImage
    ? `${rawImage}?width=1200&height=630&resize=cover`
    : 'https://testbikevelence.hu/hero-bg.png'
  return {
    title: `${bike.brand} ${bike.model} – ${bike.sale_price.toLocaleString('hu-HU')} Ft | SaleBikes`,
    description: `${bike.brand} ${bike.model} ${bike.condition === 'outlet' ? 'outlet' : 'használt'} kerékpár ${bike.sale_price.toLocaleString('hu-HU')} Ft-ért.${bike.original_price > 0 ? ` Bolti ár: ${bike.original_price.toLocaleString('hu-HU')} Ft.` : ''} Garancia, adásvételi szerződés.`,
    openGraph: {
      title: `${bike.brand} ${bike.model} – ${bike.sale_price.toLocaleString('hu-HU')} Ft`,
      description: `${bike.brand} ${bike.model} kerékpár garanciával.${bike.original_price > 0 ? ` Bolti ár: ${bike.original_price.toLocaleString('hu-HU')} Ft.` : ''}`,
      type: 'website',
      locale: 'hu_HU',
      images: [
        {
          url: bikeImage,
          width: 1200,
          height: 630,
          alt: `${bike.brand} ${bike.model}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [bikeImage],
    },
    alternates: {
      canonical: `https://testbikevelence.hu/kerekpar/${id}`,
    },
  }
}

const CONDITION_LEVELS = [
  { label: 'Új',        desc: 'Bemutató darab, 0 km, karcmentes. Gyárihoz azonos állapot.',        key: 'uj' },
  { label: 'Kiváló',   desc: 'Alig használt, 1–2 szezon. Kopásnyomok nélkül.',                    key: 'kivalo' },
  { label: 'Jó',        desc: 'Normálisan használt. Kisebb esztétikai kopásnyomok.',               key: 'jo' },
  { label: 'Megfelelő', desc: 'Rendszeres használat nyomai láthatók. Műszakilag kifogástalan.',    key: 'megfelelo' },
]
const CONDITION_DETAIL_IDX: Record<string, number> = { uj: 0, kivalo: 1, jo: 2, megfelelo: 3 }

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
  const { data } = await supabase.from('bikes').select('*').eq('id', id).eq('is_deleted', false).single()

  if (!data) notFound()

  const bike = data as Bike
  const savings = bike.original_price > 0 ? bike.original_price - bike.sale_price : 0
  const pct = bike.original_price > 0 ? Math.round((1 - bike.sale_price / bike.original_price) * 100) : 0
  const conditionIndex = { uj: 0, kivalo: 1, jo: 2, megfelelo: 3 } as const
  const condIdx = conditionIndex[bike.condition_detail as keyof typeof conditionIndex] ?? (bike.condition === 'outlet' ? 0 : 2)
  const pageBg = getBikeBackground(bike.color)

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const { count: viewers } = await supabase
    .from('page_views')
    .select('*', { count: 'exact', head: true })
    .eq('bike_id', id)
    .gte('created_at', todayStart.toISOString())
  const cleanDesc = bike.description ? cleanDescription(bike.description) : ''

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${bike.brand} ${bike.model}`,
    image: bike.images?.[0],
    description: bike.description || `${bike.brand} ${bike.model} ${bike.condition === 'outlet' ? 'outlet' : 'használt'} kerékpár garanciával.`,
    brand: {
      '@type': 'Brand',
      name: bike.brand,
    },
    offers: {
      '@type': 'Offer',
      price: bike.sale_price,
      priceCurrency: 'HUF',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'LocalBusiness',
        name: 'Bringabarát Testbike',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Tó utca 6.',
          addressLocality: 'Kápolnásnyék',
          postalCode: '2475',
          addressCountry: 'HU',
        },
      },
    },
    itemCondition: bike.condition === 'outlet'
      ? 'https://schema.org/NewCondition'
      : 'https://schema.org/UsedCondition',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <TrackPageView path={`/kerekpar/${id}`} bikeId={id} />

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
              {bike.original_price > 0 && (
                <div style={{
                  fontSize: '13px', color: 'rgba(17,17,17,0.4)',
                  textDecoration: 'line-through', marginBottom: '6px',
                  letterSpacing: '-0.01em',
                }}>
                  Bolti ár: {bike.original_price.toLocaleString('hu-HU')} Ft
                </div>
              )}
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
                  <div key={c.label} title={c.desc} style={{ flex: 1, textAlign: 'center', cursor: 'help' }}>
                    <div style={{
                      height: '5px', borderRadius: '3px',
                      background: i === condIdx ? '#e8c547' : i < condIdx ? 'rgba(232,197,71,0.3)' : 'rgba(0,0,0,0.08)',
                      marginBottom: '6px',
                      transition: 'background 0.2s',
                      outline: i === condIdx ? '2px solid #e8c547' : 'none',
                      outlineOffset: '2px',
                    }} />
                    <div style={{
                      fontSize: '10px', fontWeight: i === condIdx ? 800 : 500,
                      color: i === condIdx ? '#111111' : 'rgba(17,17,17,0.35)',
                      letterSpacing: '-0.01em',
                    }}>{c.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Viewers counter — only shown when > 0 */}
            {viewers != null && viewers > 0 && (
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
            )}

            {/* CTA — desktop */}
            <InquiryButtonDesktop bikeId={bike.id} bikeName={`${bike.brand} ${bike.model}`} bikeLabel={`${bike.brand} ${bike.model} – ${bike.sale_price.toLocaleString('hu-HU')} Ft`} />

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
            {(() => {
              const km = bike.kilometers ?? 0
              const kmVal = bike.condition === 'outlet'
                ? '0 km · Karcmentes'
                : km > 0 ? `${km.toLocaleString('hu-HU')} km` : null
              const rows = [
                { label: 'Kilométer', val: kmVal },
                { label: 'Méret',     val: bike.size },
                { label: 'Évjárat',   val: bike.year?.toString() },
                { label: 'Szín',      val: bike.color },
              ].filter(r => r.val)
              if (rows.length === 0) return null
              return (
            <div style={{
              border: '1px solid rgba(0,0,0,0.07)',
              borderRadius: '10px', overflow: 'hidden',
              marginBottom: '2.25rem',
            }}>
              {rows.map((row, i, arr) => (
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
              )
            })()}

            {/* Description — boilerplate lines filtered, newlines preserved */}
            {cleanDesc && (
              <div style={{
                background: '#ffffff',
                border: '1px solid #E8E4DC',
                borderRadius: '8px',
                padding: '1.5rem',
                marginBottom: '2rem',
              }}>
                <p style={{
                  fontSize: '14px', lineHeight: 1.8,
                  color: '#333333',
                  margin: 0,
                  whiteSpace: 'pre-line',
                }}>{cleanDesc}</p>
              </div>
            )}

            {/* Guarantee list */}
            <div style={{
              border: '1px solid #E8E4DC',
              borderRadius: '12px', padding: '0.25rem 1.5rem',
              background: '#ffffff',
            }}>
              {[
                'Garancia rendeltetésszerű használat mellett',
                'Adásvételi szerződés alvázszámmal',
              ].map((text, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '16px 0',
                  borderBottom: i < 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  fontSize: '14px', fontWeight: 500,
                  color: 'rgba(17,17,17,0.75)',
                  lineHeight: 1.4,
                }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: '#e8c547', flexShrink: 0,
                  }}>
                    <CheckCircle size={14} color="#111111" strokeWidth={2.5} />
                  </span>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA — mobile only */}
      <InquiryButtonMobile bikeId={bike.id} bikeName={`${bike.brand} ${bike.model}`} bikeLabel={`${bike.brand} ${bike.model} – ${bike.sale_price.toLocaleString('hu-HU')} Ft`} />
    </>
  )
}
