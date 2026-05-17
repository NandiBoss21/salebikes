import Navbar from '@/components/Navbar'
import { Phone, MapPin, Mail, Shield, RotateCcw, FileText, Star } from 'lucide-react'

export const metadata = {
  title: 'Rólunk | SaleBikes – Bringabarát',
  description: 'Ismerj meg minket! A SaleBikes outlet és használt kerékpárokat árul 3 hónap garanciával, Kápolnásnyéken.',
}

export default function RolunkPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: 'clamp(4rem, 8vw, 7rem) 2rem 3rem', background: '#ffffff', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{
            fontSize: '11px', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'rgba(17,17,17,0.4)', marginBottom: '1rem',
          }}>Rólunk</div>

          <h1 style={{
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: '#111111', lineHeight: 1.05,
            marginBottom: '2rem',
          }}>
            Bringabarát<br />
            <span style={{ color: '#e8c547' }}>Tesztbike</span>
          </h1>

          <p style={{
            fontSize: '16px', lineHeight: 1.75,
            color: 'rgba(17,17,17,0.6)',
            maxWidth: '620px', marginBottom: '1.25rem',
          }}>
            Kerékpár-rajongókként tudjuk, hogy egy jó bringa életeket változtat meg – de a bolti árak sokszor elérhetetlenné teszik a prémium márkákat. Ezért indítottuk el a SaleBikes-t: hogy Cube, Scott, Bulls, Giant és KTM kerékpárokat kínáljunk mindenki számára elérhető áron.
          </p>

          <p style={{
            fontSize: '16px', lineHeight: 1.75,
            color: 'rgba(17,17,17,0.6)',
            maxWidth: '620px',
          }}>
            Készletünk outlet (kiállított, 0 km-es) és gondosan válogatott használt kerékpárokból áll, mindegyik 3 hónap garanciával és adásvételi szerződéssel. Személyes megtekintés, próbaút, rugalmas időpontok – nálunk nincs nyomás, csak bringaszeretet.
          </p>
        </div>
      </section>

      {/* Amit nálunk kapsz */}
      <section style={{ background: '#f9f9f9', padding: '4rem 2rem', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 800, letterSpacing: '-0.03em',
            color: '#111111', marginBottom: '2.5rem',
          }}>Amit nálunk kapsz</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}>
            {[
              { icon: <Shield size={18} />, title: '3 hónap garancia', desc: 'Minden kerékpárra. Rendeltetésszerű használat mellett javítjuk vagy visszaváltjuk.' },
              { icon: <FileText size={18} />, title: 'Adásvételi szerződés', desc: 'Alvázszámmal ellátott szerződés minden vásárláshoz. Biztonságos, átlátható.' },
              { icon: <RotateCcw size={18} />, title: 'Visszavételi garancia', desc: 'Ha nem felel meg, visszaváltjuk. Nincs kockázat a vásárlásnál.' },
              { icon: <Star size={18} />, title: '4.7 ★ Google értékelés', desc: 'Vevőink elégedettsége mindennél fontosabb számunkra.' },
            ].map(item => (
              <div key={item.title} style={{
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.07)',
                borderRadius: '10px',
                padding: '1.5rem',
              }}>
                <div style={{ color: '#e8c547', marginBottom: '12px' }}>{item.icon}</div>
                <div style={{
                  fontSize: '14px', fontWeight: 700,
                  color: '#111111', marginBottom: '8px',
                  letterSpacing: '-0.02em',
                }}>{item.title}</div>
                <div style={{
                  fontSize: '13px', lineHeight: 1.65,
                  color: 'rgba(17,17,17,0.5)',
                }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Elérhetőség */}
      <section style={{ padding: '4rem 2rem', background: '#ffffff' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 800, letterSpacing: '-0.03em',
            color: '#111111', marginBottom: '2.5rem',
          }}>Elérhetőség</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {[
              { icon: <MapPin size={17} />, label: 'Cím',     value: 'Kápolnásnyék, Tó utca 6 · 2475' },
              { icon: <Phone  size={17} />, label: 'Telefon', value: '+36 30 889 7559', href: 'tel:+36308897559' },
              { icon: <Mail   size={17} />, label: 'Email',   value: 'ht.bike@hotmail.com', href: 'mailto:ht.bike@hotmail.com' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ color: '#e8c547', flexShrink: 0, marginTop: '2px' }}>{item.icon}</span>
                <div>
                  <div style={{
                    fontSize: '11px', fontWeight: 600,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: 'rgba(17,17,17,0.35)', marginBottom: '3px',
                  }}>{item.label}</div>
                  {item.href ? (
                    <a href={item.href} style={{
                      fontSize: '16px', fontWeight: 500,
                      color: '#111111', textDecoration: 'none',
                    }}>{item.value}</a>
                  ) : (
                    <div style={{ fontSize: '16px', fontWeight: 500, color: '#111111' }}>{item.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <a href="tel:+36308897559" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: '#e8c547', color: '#111111',
            padding: '14px 28px', borderRadius: '9px',
            fontSize: '15px', fontWeight: 700,
            letterSpacing: '-0.02em', textDecoration: 'none',
          }}>
            <Phone size={17} />
            Időpontot kérek
          </a>
        </div>
      </section>
    </>
  )
}
