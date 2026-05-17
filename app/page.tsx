'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import BikeCard from '@/components/BikeCard'
import { Phone, Shield, FileText, RotateCcw, MapPin, Star } from 'lucide-react'
import type { Bike } from '@/lib/supabase'

const CATEGORIES = [
  { key: 'all', label: 'Összes' },
  { key: 'ebike', label: 'Ebike' },
  { key: 'mtb', label: 'MTB' },
  { key: 'trekking', label: 'Trekking' },
  { key: 'gravel', label: 'Gravel' },
  { key: 'gyerek', label: 'Gyerek' },
  { key: 'orszaguti', label: 'Országúti' },
]

const BRANDS = ['Cube', 'Scott', 'Bulls', 'Giant', 'KTM', 'Merida', 'Corratec', 'Genesis', 'Focus', 'Brennabor']

export default function Home() {
  const [category, setCategory] = useState('all')
  const [bikes, setBikes] = useState<Bike[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBikes() {
      setLoading(true)
      let query = supabase
        .from('bikes')
        .select('*')
        .eq('available', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (category !== 'all') {
        query = query.eq('category', category)
      }

      const { data } = await query
      setBikes((data || []) as Bike[])
      setLoading(false)
    }
    fetchBikes()
  }, [category])

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section style={{ padding: '5rem 2rem 4rem', maxWidth: '900px' }}>
        <div style={{
          display: 'inline-block',
          fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: '#e8c547',
          border: '1px solid rgba(232,197,71,0.4)',
          padding: '4px 12px', borderRadius: '2px',
          marginBottom: '1.5rem',
        }}>
          Outlet · Bemutató · Használt · Azonnali átvétel
        </div>

        <h1 style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(3rem, 10vw, 5.5rem)',
          lineHeight: 0.95,
          textTransform: 'uppercase',
          letterSpacing: '-0.01em',
          marginBottom: '1.5rem',
        }}>
          Prémium<br />
          bringák <span style={{ color: '#e8c547' }}>félár</span><br />
          alatt
        </h1>

        <p style={{
          fontSize: '17px', fontWeight: 300,
          color: 'rgba(240,237,232,0.65)',
          maxWidth: '520px', lineHeight: 1.6,
          marginBottom: '2.5rem',
        }}>
          Cube, Scott, Bulls, Giant, KTM – bemutatódarabok és outlet kerékpárok 3 hónap garanciával. Kápolnásnyék, személyes megtekintés rugalmasan.
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '3rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {[
            { val: loading ? '…' : `${bikes.length}+`, label: 'Kerékpár raktáron' },
            { val: '3 hó', label: 'Garancia minden bringán' },
            { val: '−50%', label: 'Bolti árhoz képest' },
          ].map(s => (
            <div key={s.label}>
              <div style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700, fontSize: '2.2rem',
                color: '#e8c547', lineHeight: 1,
              }}>{s.val}</div>
              <div style={{
                fontSize: '12px', color: 'rgba(240,237,232,0.5)',
                letterSpacing: '0.05em', textTransform: 'uppercase',
                marginTop: '4px',
              }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="#termekek" style={{
            background: '#e8c547', color: '#0a0a0a',
            padding: '14px 28px', borderRadius: '2px',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700, fontSize: '15px',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            textDecoration: 'none',
          }}>Kerékpárok böngészése</a>

          <a href="tel:+36308897559" style={{
            background: 'transparent', color: '#f0ede8',
            border: '1px solid rgba(240,237,232,0.3)',
            padding: '14px 28px', borderRadius: '2px',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 600, fontSize: '15px',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            textDecoration: 'none',
          }}>+36 30 889 7559</a>
        </div>
      </section>

      {/* TRUST BAR */}
      <div style={{
        display: 'flex', gap: '2rem', padding: '1.5rem 2rem',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        flexWrap: 'wrap',
      }}>
        {[
          { icon: <Shield size={16} />, text: '3 hónap garancia' },
          { icon: <FileText size={16} />, text: 'Adásvételi szerződés' },
          { icon: <RotateCcw size={16} />, text: 'Visszavétel ha nem megfelelő' },
          { icon: <MapPin size={16} />, text: 'Kápolnásnyék · Rugalmas időpont' },
          { icon: <Star size={16} />, text: '4.7 ★ Google értékelés' },
        ].map(item => (
          <div key={item.text} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '13px', color: 'rgba(240,237,232,0.6)',
          }}>
            <span style={{ color: '#e8c547' }}>{item.icon}</span>
            {item.text}
          </div>
        ))}
      </div>

      {/* PRODUCTS */}
      <section style={{ padding: '3.5rem 2rem' }} id="termekek">
        <div style={{
          display: 'flex', alignItems: 'baseline',
          justifyContent: 'space-between', marginBottom: '1.5rem',
        }}>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700, fontSize: '1.8rem',
            textTransform: 'uppercase', letterSpacing: '0.03em',
          }}>Elérhető kerékpárok</div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              style={{
                padding: '7px 16px',
                fontSize: '12px', fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                borderRadius: '2px',
                border: '1px solid',
                cursor: 'pointer',
                ...(category === cat.key
                  ? { background: '#e8c547', color: '#0a0a0a', borderColor: '#e8c547' }
                  : { background: 'transparent', color: 'rgba(240,237,232,0.6)', borderColor: 'rgba(240,237,232,0.2)' }
                ),
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{
            textAlign: 'center', padding: '4rem',
            color: 'rgba(240,237,232,0.3)',
            fontSize: '15px',
          }}>
            Kerékpárok betöltése…
          </div>
        ) : bikes.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '4rem',
            color: 'rgba(240,237,232,0.4)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🚲</div>
            <div style={{ fontSize: '18px' }}>Ebben a kategóriában nincs elérhető kerékpár.</div>
            <button
              onClick={() => setCategory('all')}
              style={{
                color: '#e8c547', marginTop: '1rem', display: 'inline-block',
                background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px',
              }}
            >← Összes kerékpár</button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5px',
            background: 'rgba(255,255,255,0.06)',
          }}>
            {bikes.map(bike => (
              <BikeCard key={bike.id} bike={bike} />
            ))}
          </div>
        )}
      </section>

      {/* WHY US */}
      <section style={{ background: '#0f0f0f', padding: '3.5rem 2rem' }}>
        <div style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 700, fontSize: '1.8rem',
          textTransform: 'uppercase', letterSpacing: '0.03em',
          marginBottom: '2rem',
        }}>Miért minket válassz?</div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '2rem',
        }}>
          {[
            { title: '3 hónap garancia', desc: 'Minden kerékpárra. Rendeltetésszerű használat mellett javítjuk vagy visszaváltjuk.' },
            { title: 'Adásvételi szerződés', desc: 'Alvázszámmal ellátott szerződés minden vásárláshoz. Biztonságos és átlátható.' },
            { title: 'Outlet és bemutatók', desc: '0 km-es, karcmentes darabok bolti ár töredékéért. Nem használt – csak kiállított.' },
            { title: 'Rugalmas megtekintés', desc: 'Kápolnásnyék – időpont egyeztetés alapján, a neked megfelelő időben.' },
            { title: 'Prémium márkák', desc: 'Cube, Scott, Bulls, Giant, KTM, Merida – csak megbízható, minőségi gyártók.' },
            { title: 'Visszavételi garancia', desc: 'Ha nem felel meg, visszaváltjuk. Nincs kockázat a vásárlásnál.' },
          ].map(item => (
            <div key={item.title} style={{
              borderLeft: '2px solid #e8c547',
              paddingLeft: '1.25rem',
            }}>
              <div style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700, fontSize: '1.05rem',
                textTransform: 'uppercase', letterSpacing: '0.05em',
                marginBottom: '6px',
              }}>{item.title}</div>
              <div style={{
                fontSize: '13px', fontWeight: 300,
                color: 'rgba(240,237,232,0.55)', lineHeight: 1.6,
              }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BRANDS */}
      <section style={{
        padding: '2.5rem 2rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(240,237,232,0.3)', marginBottom: '1.2rem',
        }}>Elérhető márkák</div>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {BRANDS.map(b => (
            <span key={b} style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700, fontSize: '1.1rem',
              letterSpacing: '0.05em', textTransform: 'uppercase',
              color: 'rgba(240,237,232,0.25)',
            }}>{b}</span>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '2rem 2rem 6rem',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900, fontSize: '18px',
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>Sale<span style={{ color: '#e8c547' }}>Bikes</span></div>
          <div style={{ fontSize: '12px', color: 'rgba(240,237,232,0.3)', marginTop: '4px' }}>
            Bringabarát Tesztbike · Kápolnásnyék, Tó utca 6 · 2475
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(240,237,232,0.3)', marginTop: '2px' }}>
            +36 30 889 7559 · salebikes.hu
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <a href="mailto:ht.bike@hotmail.com" style={{ fontSize: '13px', color: 'rgba(240,237,232,0.5)', textDecoration: 'none' }}>ht.bike@hotmail.com</a>
          <a href="/garancia" style={{ fontSize: '13px', color: 'rgba(240,237,232,0.5)', textDecoration: 'none' }}>Garancia</a>
          <a href="/aszf" style={{ fontSize: '13px', color: 'rgba(240,237,232,0.5)', textDecoration: 'none' }}>ÁSZF</a>
        </div>
      </footer>

      {/* STICKY CALL CTA */}
      <a href="tel:+36308897559" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#e8c547', color: '#0a0a0a',
        textAlign: 'center', padding: '16px',
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 700, fontSize: '16px',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: '12px',
        textDecoration: 'none', zIndex: 200,
      }}>
        <Phone size={18} />
        Hívj most és egyeztessünk időpontot
        <span style={{
          background: '#0a0a0a', color: '#e8c547',
          fontSize: '13px', padding: '3px 10px',
          borderRadius: '20px', fontWeight: 700,
        }}>+36 30 889 7559</span>
      </a>
    </>
  )
}
