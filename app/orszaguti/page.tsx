import CategoryPage from '@/components/CategoryPage'
import type { Metadata } from 'next'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Országúti kerékpárok | Bringabarát – Kápolnásnyék',
  description: 'Outlet és használt országúti kerékpárok garanciával. Prémium road bike-ok kedvező áron. Kápolnásnyék, Velence, személyes megtekintés.',
  alternates: { canonical: 'https://testbikevelence.hu/orszaguti' },
}

const categoryData = {
  label: 'Kápolnásnyék · Velence · 50 km Budapesttől',
  h2line1: 'Országúti kerékpárok.',
  h2line2: 'Könnyű, gyors road bike-ok,',
  h2line3: 'garanciával.',
  p1: 'Könnyű, gyors országúti kerékpárok prémium márkáktól, outlet és használt állapotban garanciával. Minden kerékpár személyesen ellenőrzött, dokumentált.',
  p2: 'Megtekinthető Kápolnásnyéken és Velencén, Budapesttől 50 km-re. Adásvételi szerződéssel. Kápolnásnyék és Velence Fejér és Pest megye határán helyezkedik el – könnyen elérhető Székesfehérvárról, Érdről, Budaörsről és Budapest déli kerületeiből egyaránt.',
}

const STATS = [
  { szam: '1000+', cimke: 'Eladott kerékpár 2008 óta', leiras: 'Tapasztalat, amit nem lehet megvásárolni.' },
  { szam: '~300 000 Ft', cimke: 'Átlagos megtakarítás vásárlónként', leiras: 'A bolti árhoz képest, garanciával együtt.' },
  { szam: '4.9 ★', cimke: 'Google értékelés', leiras: 'Valódi vásárlói visszajelzések alapján.' },
  { szam: '50 km', cimke: 'Budapesttől', leiras: 'Kápolnásnyék · Velence, személyes megtekintés.' },
]

export default function OrszagutiPage() {
  return (
    <>
      <CategoryPage category="orszaguti" label="Országúti" />
      <section style={{
        background: '#111111',
        padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem)',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div className="seo-text-grid" style={{ maxWidth: '1360px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#e8c547', marginBottom: '1.25rem' }}>
              {categoryData.label}
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)', fontWeight: 900, letterSpacing: '-0.04em', color: '#ffffff', lineHeight: 1.1, marginBottom: '1.75rem' }}>
              {categoryData.h2line1}<br />{categoryData.h2line2}<br />{categoryData.h2line3}
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'rgba(255,255,255,0.55)', marginBottom: '1.25rem' }}>
              {categoryData.p1}
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'rgba(255,255,255,0.55)', marginBottom: '2rem' }}>
              {categoryData.p2}
            </p>
            <a href="tel:+36308897559" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#e8c547', color: '#111111',
              padding: '13px 24px', borderRadius: '6px',
              fontSize: '13.5px', fontWeight: 700,
              textDecoration: 'none', letterSpacing: '-0.01em'
            }}>
              Hívj most – +36 30 889 7559
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            {STATS.map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)',
                padding: '1.5rem 2rem',
                display: 'flex', alignItems: 'center', gap: '1.5rem',
                borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none'
              }}>
                <div style={{ minWidth: '110px' }}>
                  <div style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', fontWeight: 900, color: '#e8c547', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {item.szam}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', marginBottom: '3px' }}>{item.cimke}</div>
                  <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{item.leiras}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
