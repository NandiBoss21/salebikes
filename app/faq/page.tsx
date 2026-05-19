'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { ChevronDown } from 'lucide-react'

const FAQ_ITEMS = [
  {
    q: 'Mennyi a garancia?',
    a: 'Adásvételi szerződéssel ellátott garanciát vállalunk minden kerékpárunkra. A pontos feltételeket a Garancia oldalon olvashatod.',
  },
  {
    q: 'Lehet-e személyesen megnézni a kerékpárt?',
    a: 'Igen, személyes megtekintésre előzetes időpont egyeztetés alapján van lehetőség. Hívj minket a +36 30 889 7559 számon, és megbeszéljük a megfelelő időpontot. Helyszín: Kápolnásnyék, Tó utca 6.',
  },
  {
    q: 'Van-e szállítás?',
    a: 'Igen, szállítás Magyar Posta mindenkori díjszabása szerint lehetséges. A szállítási díjról érdeklődj telefonon.',
  },
  {
    q: 'Mi a különbség outlet és használt között?',
    a: 'Az outlet kerékpárok új, 0 km-es bemutatódarabok – soha nem lettek forgalomban. A használt kerékpárokat előző tulajdonos már használta, de minden darabot átvizsgálunk érkezés után.',
  },
  {
    q: 'Hogyan zajlik a vásárlás?',
    a: 'Telefonon vagy emailen érdeklődsz → egyeztetünk személyes megtekintési időpontot → helyszínen megnézed és kipróbálod a kerékpárt → megegyezés esetén adásvételi szerződést kötünk → elviszed a kerékpárt.',
  },
  {
    q: 'Milyen fizetési módok érhetők el?',
    a: 'Készpénzes fizetés lehetséges. Átutalásos fizetésről előzetesen egyeztetni kell. Részletekért hívj minket: +36 30 889 7559.',
  },
  {
    q: 'Mit jelent az adásvételi szerződés?',
    a: 'Minden vásárláshoz adásvételi szerződést kötünk, amelyben rögzítjük a kerékpár alvázszámát, állapotát, vételárát és a garancia feltételeit. Ez védi mind a vevőt, mind az eladót.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #E8E4DC',
      borderRadius: '10px',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left',
          padding: '18px 20px',
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '12px',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <span style={{
          fontSize: '15px', fontWeight: 700,
          color: '#111111', letterSpacing: '-0.02em',
          lineHeight: 1.3,
        }}>{q}</span>
        <span style={{
          flexShrink: 0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '28px', height: '28px',
          borderRadius: '50%',
          background: open ? '#e8c547' : '#f0ede8',
          transition: 'background 0.2s',
        }}>
          <ChevronDown
            size={16}
            color="#111111"
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          />
        </span>
      </button>
      {open && (
        <div style={{
          padding: '0 20px 18px',
          fontSize: '14px', lineHeight: 1.75,
          color: 'rgba(17,17,17,0.65)',
        }}>{a}</div>
      )}
    </div>
  )
}

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <section style={{
        padding: 'clamp(3.5rem, 7vw, 6rem) clamp(1.5rem, 4vw, 3rem) clamp(2rem, 4vw, 3rem)',
        background: 'var(--bg-primary)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{
            fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(17,17,17,0.35)', marginBottom: '0.75rem',
          }}>Tudnivalók</div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: '#111111', lineHeight: 1.05,
            marginBottom: '1.25rem',
          }}>Gyakori kérdések</h1>
          <p style={{
            fontSize: '16px', lineHeight: 1.75,
            color: 'rgba(17,17,17,0.6)', maxWidth: '600px',
          }}>
            A leggyakrabban feltett kérdések és válaszok. Ha nem találod amit keresel, hívj minket!
          </p>
        </div>
      </section>

      <section style={{
        background: 'var(--bg-primary)',
        padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)',
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} />
          ))}
        </div>

        <div style={{
          maxWidth: '760px', margin: '2.5rem auto 0',
          background: '#ffffff',
          border: '1px solid #E8E4DC',
          borderRadius: '12px',
          padding: '1.75rem 2rem',
          display: 'flex', flexDirection: 'column', gap: '0.75rem',
        }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111111', letterSpacing: '-0.02em' }}>
            Nem találtad meg a választ?
          </div>
          <div style={{ fontSize: '13.5px', color: 'rgba(17,17,17,0.55)', lineHeight: 1.6 }}>
            Hívj minket, szívesen segítünk!
          </div>
          <a href="tel:+36308897559" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#e8c547', color: '#111111',
            padding: '12px 22px', borderRadius: '8px',
            fontSize: '14px', fontWeight: 700,
            letterSpacing: '-0.02em', textDecoration: 'none',
            alignSelf: 'flex-start',
          }}>
            +36 30 889 7559
          </a>
        </div>
      </section>
    </>
  )
}
