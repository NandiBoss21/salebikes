import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { Phone, Mail, MapPin, Wrench, Zap, Package, Star } from 'lucide-react'

export const metadata = {
  title: 'Rólunk | SaleBikes – Bringabarát',
  description: 'Családi vállalkozás 2008 óta. Prémium használt kerékpárok, veterán felújítás, Bosch ebike szakszerviz. Kápolnásnyék.',
}

const STATS = [
  { num: '2008', label: 'óta működünk' },
  { num: '1000+', label: 'eladott kerékpár' },
  { num: '4.9★', label: 'Google értékelés' },
]

const SERVICES = [
  {
    icon: <Package size={20} />,
    title: 'Prémium használt kerékpárok',
    desc: 'Többnyire külföldről érkező, prémium minőségű kerékpárokat forgalmazunk garanciával. Az árukészletünk folyamatosan cserélődik.',
  },
  {
    icon: <Wrench size={20} />,
    title: 'Veterán kerékpár felújítás',
    desc: 'Régi, klasszikus kerékpárok teljes felújítása és restaurálása. Minden alkatrész gondos cseréjével vagy felújításával.',
  },
  {
    icon: <Zap size={20} />,
    title: 'Bosch Ebike szakszerviz',
    desc: 'Bosch rendszerű elektromos kerékpárok javítása, alkatrészek, kiegészítők és akkumulátorok beszerzése.',
  },
  {
    icon: <Star size={20} />,
    title: 'Széles márkaválaszték',
    desc: 'Scott, Cannondale, Focus, Trek, Canyon, Specialized, Merida, KTM, Genesis és még sok más márka elérhető készletünkből.',
  },
]

const BRANDS = ['Scott', 'Ghost', 'Cannondale', 'Focus', 'Trek', 'Canyon', 'Specialized', 'Merida', 'GT', 'Wheeler', 'KTM', 'Genesis', 'Bosch']

export default function RolunkPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section style={{
        background: '#111111',
        padding: 'clamp(5rem, 10vw, 8rem) clamp(1.5rem, 4vw, 3rem) clamp(3rem, 6vw, 5rem)',
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{
            fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)', marginBottom: '1rem',
          }}>Ismerj meg minket</div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 900, letterSpacing: '-0.02em',
            color: '#ffffff', lineHeight: 1.0,
            marginBottom: '0.75rem',
          }}>
            Rólunk
          </h1>
          <div style={{
            width: '60px', height: '4px',
            background: '#e8c547',
            borderRadius: '2px',
            marginBottom: '1.25rem',
          }} />
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            fontWeight: 500, color: 'rgba(255,255,255,0.45)',
            letterSpacing: '-0.01em',
          }}>Családi vállalkozás 2008 óta</p>
        </div>
      </section>

      {/* Story */}
      <section style={{
        background: '#fafaf8',
        padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
            gap: 'clamp(2rem, 5vw, 5rem)',
            alignItems: 'center',
          }} className="rolunk-story-grid">

            <div>
              <div style={{
                fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(17,17,17,0.35)', marginBottom: '0.75rem',
              }}>A mi történetünk</div>
              <h2 style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: 900, letterSpacing: '-0.04em',
                color: '#111111', lineHeight: 1.1,
                marginBottom: '1.5rem',
              }}>
                Kerékpárszeretet,<br />
                <span style={{ color: '#e8c547' }}>két évtizeden át</span>
              </h2>
              <p style={{
                fontSize: '15.5px', lineHeight: 1.8,
                color: 'rgba(17,17,17,0.6)',
                maxWidth: '520px',
              }}>
                2008 óta foglalkozunk kerékpárok, alkatrészek értékesítésével és veterán kerékpárok felújításával. Ami kis műhelyként indult, mára egy megbízható, online is elérhető kerékpár üzletté nőtte ki magát.
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {STATS.map((s) => (
                <div key={s.num} style={{
                  background: '#ffffff',
                  border: '1px solid #E8E4DC',
                  borderRadius: '12px',
                  padding: '1.5rem 2rem',
                  display: 'flex', alignItems: 'center', gap: '1.25rem',
                }}>
                  <div style={{
                    fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                    fontWeight: 900, letterSpacing: '-0.04em',
                    color: '#e8c547', lineHeight: 1, flexShrink: 0,
                  }}>{s.num}</div>
                  <div style={{
                    fontSize: '13.5px', fontWeight: 500,
                    color: 'rgba(17,17,17,0.55)', lineHeight: 1.4,
                  }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{
        background: '#f2f0eb',
        padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{
            fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(17,17,17,0.35)', marginBottom: '0.75rem',
          }}>Amit csinálunk</div>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: '#111111', marginBottom: '2.5rem', lineHeight: 1.1,
          }}>Szolgáltatásaink</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}>
            {SERVICES.map((item) => (
              <div key={item.title} style={{
                background: '#ffffff',
                border: '1px solid #E8E4DC',
                borderRadius: '12px',
                padding: '1.75rem',
              }}>
                <div style={{
                  color: '#e8c547', marginBottom: '1rem',
                  width: '40px', height: '40px',
                  background: 'rgba(232,197,71,0.1)',
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{item.icon}</div>
                <div style={{
                  fontSize: '14px', fontWeight: 700,
                  color: '#111111', marginBottom: '8px',
                  letterSpacing: '-0.02em', lineHeight: 1.3,
                }}>{item.title}</div>
                <div style={{
                  fontSize: '13px', lineHeight: 1.7,
                  color: 'rgba(17,17,17,0.5)',
                }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section style={{
        background: '#fafaf8',
        padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{
            fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(17,17,17,0.35)', marginBottom: '0.75rem',
          }}>Márkák</div>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: '#111111', marginBottom: '2rem', lineHeight: 1.1,
          }}>Velük dolgozunk</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {BRANDS.map(brand => (
              <span key={brand} style={{
                fontSize: '13px', fontWeight: 600,
                padding: '8px 16px',
                border: '1px solid #E8E4DC',
                borderRadius: '6px',
                color: 'rgba(17,17,17,0.7)',
                background: '#ffffff',
                letterSpacing: '-0.01em',
              }}>{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: '#111111',
        padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem)',
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: '#ffffff', lineHeight: 1.1,
            marginBottom: '1rem',
          }}>Keressen minket bizalommal</h2>
          <p style={{
            fontSize: '14px', color: 'rgba(255,255,255,0.4)',
            marginBottom: '2.5rem', lineHeight: 1.7,
          }}>
            2475 Kápolnásnyék, Tó utca 6. · Előzetes egyeztetés alapján
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/kapcsolat" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#e8c547', color: '#111111',
              padding: '14px 28px', borderRadius: '9px',
              fontSize: '14px', fontWeight: 800,
              letterSpacing: '-0.02em', textDecoration: 'none',
            }}>
              Kapcsolatfelvétel →
            </Link>
            <Link href="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#ffffff',
              padding: '14px 28px', borderRadius: '9px',
              fontSize: '14px', fontWeight: 600,
              letterSpacing: '-0.02em', textDecoration: 'none',
            }}>
              Kerékpárok böngészése
            </Link>
          </div>

          {/* Contact details */}
          <div style={{
            marginTop: '3rem', paddingTop: '2.5rem',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', gap: '2rem', justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            {[
              { icon: <Phone size={14} />, value: '+36 30 889 7559', href: 'tel:+36308897559' },
              { icon: <Mail size={14} />, value: 'bringabarat@hotmail.com', href: 'mailto:bringabarat@hotmail.com' },
              { icon: <MapPin size={14} />, value: '2475 Kápolnásnyék, Tó utca 6.', href: undefined },
            ].map(item => (
              <div key={item.value} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.25)' }}>{item.icon}</span>
                {item.href ? (
                  <a href={item.href} style={{
                    fontSize: '13px', fontWeight: 500,
                    color: 'rgba(255,255,255,0.45)', textDecoration: 'none',
                  }}>{item.value}</a>
                ) : (
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.45)' }}>{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 700px) {
          .rolunk-story-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
