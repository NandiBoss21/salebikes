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

      <section style={{ padding: '5rem 2rem 3rem', maxWidth: '860px' }}>
        <div style={{
          display: 'inline-block',
          fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: '#e8c547',
          border: '1px solid rgba(232,197,71,0.4)',
          padding: '4px 12px', borderRadius: '2px',
          marginBottom: '1.5rem',
        }}>
          Rólunk
        </div>

        <h1 style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
          lineHeight: 0.95,
          textTransform: 'uppercase',
          letterSpacing: '-0.01em',
          marginBottom: '2rem',
        }}>
          Bringabarát<br />
          <span style={{ color: '#e8c547' }}>Tesztbike</span>
        </h1>

        <p style={{
          fontSize: '17px', fontWeight: 300,
          color: 'rgba(240,237,232,0.65)',
          maxWidth: '620px', lineHeight: 1.7,
          marginBottom: '1.5rem',
        }}>
          Kerékpár-rajongókként tudjuk, hogy egy jó bringa életeket változtat meg – de a bolti árak sokszor elérhetetlenné teszik a prémium márkákat. Ezért indítottuk el a SaleBikes-t: hogy Cube, Scott, Bulls, Giant és KTM kerékpárokat kínáljunk mindenki számára elérhető áron.
        </p>

        <p style={{
          fontSize: '17px', fontWeight: 300,
          color: 'rgba(240,237,232,0.65)',
          maxWidth: '620px', lineHeight: 1.7,
          marginBottom: '3rem',
        }}>
          Készletünk outlet (kiállított, 0 km-es) és gondosan válogatott használt kerékpárokból áll, mindegyik 3 hónap garanciával és adásvételi szerződéssel. Személyes megtekintés, próbaút, rugalmas időpontok – nálunk nincs nyomás, csak bringaszeretet.
        </p>
      </section>

      {/* Garanciák */}
      <section style={{ background: '#0f0f0f', padding: '3.5rem 2rem' }}>
        <div style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 700, fontSize: '1.8rem',
          textTransform: 'uppercase', letterSpacing: '0.03em',
          marginBottom: '2rem',
        }}>Amit nálunk kapsz</div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '2rem',
        }}>
          {[
            { icon: <Shield size={20} />, title: '3 hónap garancia', desc: 'Minden kerékpárra. Rendeltetésszerű használat mellett javítjuk vagy visszaváltjuk.' },
            { icon: <FileText size={20} />, title: 'Adásvételi szerződés', desc: 'Alvázszámmal ellátott szerződés minden vásárláshoz. Biztonságos, átlátható.' },
            { icon: <RotateCcw size={20} />, title: 'Visszavételi garancia', desc: 'Ha nem felel meg, visszaváltjuk. Nincs kockázat a vásárlásnál.' },
            { icon: <Star size={20} />, title: '4.7 ★ Google értékelés', desc: 'Vevőink elégedettsége mindennél fontosabb számunkra.' },
          ].map(item => (
            <div key={item.title} style={{
              borderLeft: '2px solid #e8c547',
              paddingLeft: '1.25rem',
            }}>
              <div style={{ color: '#e8c547', marginBottom: '8px' }}>{item.icon}</div>
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

      {/* Elérhetőség */}
      <section style={{ padding: '3.5rem 2rem' }}>
        <div style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 700, fontSize: '1.8rem',
          textTransform: 'uppercase', letterSpacing: '0.03em',
          marginBottom: '2rem',
        }}>Elérhetőség</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {[
            { icon: <MapPin size={18} />, label: 'Cím', value: 'Kápolnásnyék, Tó utca 6 · 2475' },
            { icon: <Phone size={18} />, label: 'Telefon', value: '+36 30 889 7559', href: 'tel:+36308897559' },
            { icon: <Mail size={18} />, label: 'Email', value: 'ht.bike@hotmail.com', href: 'mailto:ht.bike@hotmail.com' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ color: '#e8c547', flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,237,232,0.35)', marginBottom: '2px' }}>{item.label}</div>
                {item.href ? (
                  <a href={item.href} style={{ fontSize: '16px', color: '#f0ede8', textDecoration: 'none' }}>{item.value}</a>
                ) : (
                  <div style={{ fontSize: '16px', color: '#f0ede8' }}>{item.value}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <a href="tel:+36308897559" style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          marginTop: '2.5rem',
          background: '#e8c547', color: '#0a0a0a',
          padding: '14px 28px', borderRadius: '2px',
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 700, fontSize: '15px',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          textDecoration: 'none',
        }}>
          <Phone size={18} />
          Időpontot kérek
        </a>
      </section>
    </>
  )
}
