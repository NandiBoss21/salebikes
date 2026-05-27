import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { CheckCircle, XCircle, Phone } from 'lucide-react'

export const metadata = {
  title: 'Garancia | SaleBikes – Bringabarát',
  description: 'SaleBikes garancia feltételei. Használt és outlet kerékpárokra vonatkozó garancia, folyamat és tudnivalók.',
}

const COVERED = [
  'Mechanikai meghibásodás normál használat esetén',
  'Váz, villa gyártási hiba',
'Fékezési rendszer meghibásodása',
  'Elektronika (e-bike esetén motor, akkumulátor-töltő csatlakozó)',
]

const NOT_COVERED = [
  'Balesetek, ütések, esések következtében keletkező kár',
  'Normál kopás (gumi, fékbetét, lánc elhasználódás)',
  'Nem rendeltetésszerű vagy szakszerűtlen használat',
  'Saját vagy szakszervizen kívüli harmadik fél által végzett módosítás után keletkező hiba',
  'Esztétikai sérülések (karcolások, festékhibák)',
  'E-bike akkumulátor kapacitáscsökkenése (természetes folyamat)',
]

const STEPS = [
  { title: 'Kapcsolatfelvétel', desc: 'Telefonon vagy emailen jelezd a problémát. Írd le röviden, mi és mikor romlott el.' },
  { title: 'Megvizsgáljuk', desc: 'Személyesen átvizsgáljuk a kerékpárt és átbeszéljük a teendőket.' },
  { title: 'Megoldás', desc: 'Javítjuk a hibás alkatrészt, vagy ha az nem lehetséges, egyéb megoldást keresünk.' },
]

export default function GarantiaPage() {
  return (
    <>
      <Navbar />

      {/* Header */}
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
          }}>Vásárlói védelem</div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: '#111111', lineHeight: 1.05,
            marginBottom: '1.75rem',
          }}>Garancia</h1>
          <p style={{
            fontSize: '16px', lineHeight: 1.75,
            color: 'rgba(17,17,17,0.6)', maxWidth: '640px',
          }}>
            Használt, többnyire külföldről érkező termékeket árulunk – ezért minden kerékpárt átvizsgálunk és szükség esetén szervizelünk értékesítés előtt.
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{
        background: 'var(--bg-primary)',
        padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)',
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>

          {/* What IS covered */}
          <div>
            <h2 style={{
              fontSize: '1.25rem', fontWeight: 800,
              letterSpacing: '-0.03em', color: '#111111',
              marginBottom: '1.25rem',
            }}>Mire vonatkozik a garancia?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {COVERED.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }}>
                    <CheckCircle size={17} />
                  </span>
                  <span style={{ fontSize: '14.5px', lineHeight: 1.65, color: 'rgba(17,17,17,0.75)', fontWeight: 500 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* What is NOT covered */}
          <div>
            <h2 style={{
              fontSize: '1.25rem', fontWeight: 800,
              letterSpacing: '-0.03em', color: '#111111',
              marginBottom: '1.25rem',
            }}>Mire NEM vonatkozik?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {NOT_COVERED.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ color: 'rgba(17,17,17,0.25)', flexShrink: 0, marginTop: '2px' }}>
                    <XCircle size={17} />
                  </span>
                  <span style={{ fontSize: '14.5px', lineHeight: 1.65, color: 'rgba(17,17,17,0.55)', fontWeight: 500 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Process */}
          <div>
            <h2 style={{
              fontSize: '1.25rem', fontWeight: 800,
              letterSpacing: '-0.03em', color: '#111111',
              marginBottom: '1.5rem',
            }}>Hogyan érvényesítheted?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {STEPS.map((step, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '1.25rem', alignItems: 'flex-start',
                  background: '#ffffff',
                  border: '1px solid #E8E4DC',
                  borderRadius: '10px',
                  padding: '1.25rem 1.5rem',
                }}>
                  <div style={{
                    flexShrink: 0,
                    width: '32px', height: '32px',
                    borderRadius: '50%',
                    background: '#e8c547',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 800,
                    color: '#111111',
                  }}>{i + 1}</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#111111', marginBottom: '4px' }}>{step.title}</div>
                    <div style={{ fontSize: '13.5px', lineHeight: 1.65, color: 'rgba(17,17,17,0.55)' }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #E8E4DC',
            borderRadius: '12px',
            padding: '2rem',
            display: 'flex', flexDirection: 'column', gap: '1rem',
            alignItems: 'flex-start',
          }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#111111', letterSpacing: '-0.02em' }}>
              Garanciális igényed van?
            </div>
            <div style={{ fontSize: '13.5px', lineHeight: 1.65, color: 'rgba(17,17,17,0.55)' }}>
              Lépj velünk kapcsolatba és igyekszünk minél hamarabb segíteni.
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/kapcsolat" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#e8c547', color: '#111111',
                padding: '12px 22px', borderRadius: '8px',
                fontSize: '14px', fontWeight: 700,
                letterSpacing: '-0.02em', textDecoration: 'none',
              }}>
                Kapcsolatfelvétel →
              </Link>
              <a href="tel:+36308897559" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'transparent',
                border: '1px solid #E8E4DC',
                color: '#111111',
                padding: '12px 22px', borderRadius: '8px',
                fontSize: '14px', fontWeight: 600,
                letterSpacing: '-0.02em', textDecoration: 'none',
              }}>
                <Phone size={15} />
                +36 30 889 7559
              </a>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
