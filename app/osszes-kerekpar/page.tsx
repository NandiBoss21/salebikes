'use client'

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import BikeCard from '@/components/BikeCard'
import { Phone, SlidersHorizontal, X } from 'lucide-react'
import type { Bike } from '@/lib/supabase'
import { usePageView } from '@/hooks/usePageView'

const CATEGORIES = [
  { key: 'ebike',      label: 'Ebike' },
  { key: 'mtb',        label: 'MTB' },
  { key: 'trekking',   label: 'Trekking' },
  { key: 'gravel',     label: 'Gravel' },
  { key: 'gyerek',     label: 'Gyerek' },
  { key: 'orszaguti',  label: 'Országúti' },
  { key: 'kemping',    label: 'Kemping' },
  { key: 'alkatreszek', label: 'Alkatrészek' },
  { key: 'ruhazat',   label: 'Ruházat' },
]

const SORT_OPTIONS = [
  { key: 'newest',    label: 'Legújabb' },
  { key: 'price_asc', label: 'Ár: növekvő' },
  { key: 'price_desc', label: 'Ár: csökkenő' },
  { key: 'saving',    label: 'Megtakarítás' },
]

export default function OsszesKerekparPage() {
  usePageView('/osszes-kerekpar')

  const [bikes, setBikes] = useState<Bike[]>([])
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Filters
  const [category, setCategory] = useState('')
  const [condition, setCondition] = useState<'' | 'outlet' | 'hasznalt'>('')
  const [sortBy, setSortBy] = useState('newest')
  const [priceMax, setPriceMax] = useState(0)   // 0 = no limit (set after data loads)
  const [priceMaxInput, setPriceMaxInput] = useState(0)

  useEffect(() => {
    supabase
      .from('bikes')
      .select('*')
      .eq('available', true)
      .not('sold', 'eq', true)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const list = (data || []) as Bike[]
        setBikes(list)
        setLoading(false)
        if (list.length > 0) {
          const max = Math.max(...list.map(b => b.sale_price))
          const rounded = Math.ceil(max / 100000) * 100000
          setPriceMax(rounded)
          setPriceMaxInput(rounded)
        }
      })
  }, [])

  const activeMax = priceMax === 0 ? Infinity : priceMax

  const filtered = useMemo(() => {
    let result = [...bikes]

    if (category) result = result.filter(b => b.category === category)
    if (condition) result = result.filter(b => b.condition === condition)
    if (priceMaxInput > 0 && priceMaxInput < priceMax) {
      result = result.filter(b => b.sale_price <= priceMaxInput)
    }

    if (sortBy === 'price_asc') result.sort((a, b) => a.sale_price - b.sale_price)
    else if (sortBy === 'price_desc') result.sort((a, b) => b.sale_price - a.sale_price)
    else if (sortBy === 'saving') result.sort((a, b) => (b.original_price - b.sale_price) - (a.original_price - a.sale_price))
    // 'newest' already sorted by server

    return result
  }, [bikes, category, condition, sortBy, priceMaxInput, priceMax])

  const activeFilters = [category, condition, (priceMaxInput > 0 && priceMaxInput < priceMax) ? 'price' : ''].filter(Boolean).length

  function resetFilters() {
    setCategory('')
    setCondition('')
    setSortBy('newest')
    setPriceMaxInput(priceMax)
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section style={{
        position: 'relative',
        background: '#111111',
        padding: 'clamp(5.5rem, 10vw, 7rem) 2rem clamp(2.5rem, 5vw, 3.5rem)',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: '11px', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem',
          }}>
            Outlet · Bemutató · Használt
          </div>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 7vw, 4.5rem)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: '#ffffff', lineHeight: 1.05, margin: 0,
          }}>
            Összes <span style={{ color: '#e8c547' }}>kerékpár</span>
          </h1>
        </div>
      </section>

      {/* Content */}
      <section style={{ background: '#fafaf8', minHeight: '60vh' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>

          {/* Filter bar */}
          <div style={{
            background: '#ffffff', border: '1px solid #E8E4DC',
            borderRadius: '12px', padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center',
          }}>
            {/* Category pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flex: 1 }}>
              <button
                onClick={() => setCategory('')}
                style={pillStyle(category === '')}
              >
                Összes
              </button>
              {CATEGORIES.map(c => (
                <button key={c.key} onClick={() => setCategory(c.key === category ? '' : c.key)} style={pillStyle(category === c.key)}>
                  {c.label}
                </button>
              ))}
            </div>

            {/* Advanced filters toggle */}
            <button
              onClick={() => setFiltersOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '8px', border: '1px solid #E8E4DC',
                background: filtersOpen ? '#111111' : '#ffffff',
                color: filtersOpen ? '#ffffff' : '#111111',
                fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                flexShrink: 0, transition: 'all 0.15s',
              }}
            >
              <SlidersHorizontal size={14} />
              Szűrők
              {activeFilters > 0 && (
                <span style={{
                  background: '#e8c547', color: '#111111',
                  borderRadius: '50%', width: '18px', height: '18px',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: 800,
                }}>{activeFilters}</span>
              )}
            </button>
          </div>

          {/* Expanded filters */}
          {filtersOpen && (
            <div style={{
              background: '#ffffff', border: '1px solid #E8E4DC',
              borderRadius: '12px', padding: '1.25rem 1.5rem',
              marginBottom: '1.5rem',
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem', alignItems: 'end',
            }}>
              {/* Condition */}
              <div>
                <div style={filterLabel}>Állapot</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[{ key: '' as const, label: 'Mindkettő' }, { key: 'outlet' as const, label: 'Outlet' }, { key: 'hasznalt' as const, label: 'Használt' }].map(o => (
                    <button key={o.key} onClick={() => setCondition(o.key)} style={pillStyle(condition === o.key)}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={filterLabel}>Max. ár</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111111' }}>
                    {priceMaxInput.toLocaleString('hu-HU')} Ft
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={priceMax}
                  step={10000}
                  value={priceMaxInput}
                  onChange={e => setPriceMaxInput(Number(e.target.value))}
                  disabled={priceMax === 0}
                  style={{ width: '100%', accentColor: '#e8c547', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(17,17,17,0.4)', marginTop: '4px' }}>
                  <span>0 Ft</span>
                  <span>{priceMax.toLocaleString('hu-HU')} Ft</span>
                </div>
              </div>

              {/* Sort */}
              <div>
                <div style={filterLabel}>Rendezés</div>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{
                    width: '100%', padding: '9px 12px',
                    border: '1px solid #E8E4DC', borderRadius: '8px',
                    fontSize: '13px', fontWeight: 500, color: '#111111',
                    background: '#ffffff', cursor: 'pointer', outline: 'none',
                  }}
                >
                  {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
                </select>
              </div>

              {/* Reset */}
              {activeFilters > 0 && (
                <div>
                  <button onClick={resetFilters} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '9px 16px', borderRadius: '8px',
                    border: '1px solid #E8E4DC', background: '#fafaf8',
                    color: 'rgba(17,17,17,0.6)', fontWeight: 600, fontSize: '13px',
                    cursor: 'pointer',
                  }}>
                    <X size={13} /> Szűrők törlése
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Sort bar (always visible, compact) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '13px', color: 'rgba(17,17,17,0.45)', fontWeight: 500 }}>
              {loading ? 'Betöltés…' : `${filtered.length} kerékpár`}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {SORT_OPTIONS.map(o => (
                <button key={o.key} onClick={() => setSortBy(o.key)} style={{
                  padding: '6px 12px', borderRadius: '6px', border: '1px solid',
                  fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  borderColor: sortBy === o.key ? '#111111' : '#E8E4DC',
                  background: sortBy === o.key ? '#111111' : 'transparent',
                  color: sortBy === o.key ? '#ffffff' : 'rgba(17,17,17,0.5)',
                  transition: 'all 0.15s',
                }}>{o.label}</button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'rgba(17,17,17,0.3)', fontSize: '14px' }}>
              Betöltés…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
              <div style={{ fontSize: '40px', marginBottom: '1.25rem' }}>🚲</div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: '#111111', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                Nincs találat a megadott szűrőkre.
              </div>
              <button onClick={resetFilters} style={{
                marginTop: '1rem', background: '#111111', color: '#ffffff',
                border: 'none', padding: '12px 24px', borderRadius: '8px',
                fontWeight: 700, fontSize: '14px', cursor: 'pointer',
              }}>Szűrők törlése</button>
            </div>
          ) : (
            <>
              <div style={{
                fontSize: '12px', color: 'rgba(17,17,17,0.4)',
                marginBottom: '1.25rem', fontWeight: 500,
              }}>{filtered.length} kerékpár elérhető</div>
              <div className="bikes-grid">
                {filtered.map(bike => (
                  <BikeCard key={bike.id} bike={bike} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <a href="tel:+36308897559" className="mobile-cta" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: '#e8c547', color: '#111111',
        alignItems: 'center', justifyContent: 'center',
        gap: '10px', padding: '16px',
        fontSize: '15px', fontWeight: 700,
        letterSpacing: '-0.01em', textDecoration: 'none',
      }}>
        <Phone size={17} />
        Hívj most · +36 30 889 7559
      </a>
    </>
  )
}

const filterLabel: React.CSSProperties = {
  fontSize: '11px', fontWeight: 600,
  letterSpacing: '0.07em', textTransform: 'uppercase',
  color: 'rgba(17,17,17,0.4)', marginBottom: '8px',
}

function pillStyle(active: boolean): React.CSSProperties {
  return {
    padding: '6px 13px', borderRadius: '20px', border: '1px solid',
    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
    transition: 'all 0.15s',
    borderColor: active ? '#111111' : '#E8E4DC',
    background: active ? '#111111' : 'transparent',
    color: active ? '#ffffff' : 'rgba(17,17,17,0.6)',
  }
}
