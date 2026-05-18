import Navbar from '@/components/Navbar'
import Link from 'next/link'

export const metadata = {
  title: 'ÁSZF | SaleBikes – Bringabarát',
  description: 'SaleBikes Általános Szerződési Feltételek. Vásárlás, garancia, panaszkezelés.',
}

const SECTIONS = [
  {
    id: 'altalanos',
    title: '1. Általános rendelkezések',
    content: `Jelen Általános Szerződési Feltételek (ÁSZF) a SaleBikes (üzemeltető: Házi Nándor, székhely: 2475 Kápolnásnyék, Tó utca 6) és a vásárló közötti jogviszonyt szabályozzák.

A weboldal (salebikes.hu) böngészésével és a vásárlással a vásárló elfogadja jelen ÁSZF rendelkezéseit. Az ÁSZF folyamatosan elérhető a salebikes.hu/aszf oldalon.`,
  },
  {
    id: 'szolgaltato',
    title: '2. Szolgáltató adatai',
    content: `Név: Házi Nándor
Székhely: 2475 Kápolnásnyék, Tó utca 6
Telefonszám: +36 30 889 7559
Email: ht.bike@hotmail.com
Weboldal: salebikes.hu`,
  },
  {
    id: 'targy',
    title: '3. A szerződés tárgya',
    content: `A SaleBikes platformon keresztül kerékpárok értékesítése történik. A kínálat outlet (bemutatódarab, 0 km-es) és használt kerékpárokból áll. Minden terméket személyesen vizsgálunk át, és az állapotát hűen mutatjuk be a terméklapon.

A vásárlás személyesen, előzetes egyeztetés alapján lehetséges a Kápolnásnyéki székhelyen, vagy postai szállítással.`,
  },
  {
    id: 'arak',
    title: '4. Termékek és árak',
    content: `Az oldalon feltüntetett árak forintban (HUF) értendők és tartalmazzák az ÁFÁ-t. A feltüntetett árak tájékoztató jellegűek; a végleges vételárat az adásvételi szerződés tartalmazza.

Az eredeti (bolti) ár tájékoztató jellegű, a gyártói ajánlott fogyasztói árat vagy egy ismert hazai kiskereskedő árát jelöli. A megtakarítás mértéke ehhez képest kerül megjelenítésre.`,
  },
  {
    id: 'fizetes',
    title: '5. Fizetés és átvétel',
    content: `Fizetési módok:
– Készpénz személyes átvételkor
– Banki átutalás (szállítás esetén előre)

Átvételi módok:
– Személyes átvétel a Kápolnásnyéki telephelyen, előzetes egyeztetés alapján
– Postai szállítás: Magyar Posta mindenkori díjszabása szerint

Postai szállítás esetén a kerékpárt csomagolva, szállítható állapotban adjuk fel. Az esetleges szállítási sérülés esetén haladéktalanul értesítse a futárszolgálatot és vegye fel velünk is a kapcsolatot.`,
  },
  {
    id: 'garancia',
    title: '6. Garancia',
    content: `A SaleBikes minden értékesített kerékpárra garanciát vállal rendeltetésszerű használat esetén. A garancia részletes feltételeit a Garancia oldalon olvashatja el.

A garancia nem vonatkozik normál kopásra (gumi, fékbetét, lánc), balesetre, szakszerűtlen használatra, esztétikai sérülésekre, illetve saját módosítást követően keletkező hibákra.`,
  },
  {
    id: 'panasz',
    title: '7. Panaszkezelés',
    content: `Panasz esetén elsősorban telefonon (+36 30 889 7559) vagy emailen (ht.bike@hotmail.com) forduljon hozzánk. Panaszát 30 napon belül megvizsgáljuk és írásban válaszolunk.

Amennyiben a panasz kezelése nem vezet eredményre, a vásárló a fogyasztóvédelmi hatósághoz (Budapest Főváros Kormányhivatala, illetékes járási hivatal) vagy az online vitarendezési platformhoz (https://ec.europa.eu/consumers/odr/) fordulhat.`,
  },
  {
    id: 'zaro',
    title: '8. Záró rendelkezések',
    content: `A jelen ÁSZF-ben nem szabályozott kérdésekben a Polgári Törvénykönyvről szóló 2013. évi V. törvény és az egyéb vonatkozó jogszabályok rendelkezései irányadók.

Jelen ÁSZF 2024. január 1. napjától érvényes és hatályos. A SaleBikes fenntartja a jogot az ÁSZF egyoldalú módosítására. A módosítások az oldalon való közzétételük napján lépnek hatályba.`,
  },
]

export default function AszfPage() {
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
          }}>Jogi dokumentum</div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: '#111111', lineHeight: 1.05,
            marginBottom: '1rem',
          }}>Általános Szerződési Feltételek</h1>
          <p style={{
            fontSize: '13px', color: 'rgba(17,17,17,0.4)',
          }}>Hatályos: 2024. január 1-től</p>
        </div>
      </section>

      {/* Content */}
      <section style={{
        background: 'var(--bg-primary)',
        padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)',
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>

          {/* TOC */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #E8E4DC',
            borderRadius: '10px',
            padding: '1.5rem',
            marginBottom: '3rem',
          }}>
            <div style={{
              fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.07em', textTransform: 'uppercase',
              color: 'rgba(17,17,17,0.35)', marginBottom: '1rem',
            }}>Tartalomjegyzék</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {SECTIONS.map(s => (
                <a key={s.id} href={`#${s.id}`} style={{
                  fontSize: '13.5px', fontWeight: 500,
                  color: '#111111', textDecoration: 'none',
                  padding: '4px 0',
                }}>{s.title}</a>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {SECTIONS.map(s => (
              <div key={s.id} id={s.id}>
                <h2 style={{
                  fontSize: '1.1rem', fontWeight: 800,
                  letterSpacing: '-0.02em', color: '#111111',
                  marginBottom: '1rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid rgba(0,0,0,0.07)',
                }}>{s.title}</h2>
                <div style={{
                  fontSize: '14px', lineHeight: 1.8,
                  color: 'rgba(17,17,17,0.65)',
                  whiteSpace: 'pre-line',
                }}>
                  {s.id === 'garancia' ? (
                    <>
                      {s.content.split('Garancia oldalon')[0]}
                      <Link href="/garancia" style={{ color: '#e8c547', textDecoration: 'none', fontWeight: 600 }}>Garancia oldalon</Link>
                      {s.content.split('Garancia oldalon')[1]}
                    </>
                  ) : s.content}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom nav */}
          <div style={{
            marginTop: '4rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(0,0,0,0.07)',
            display: 'flex', gap: '1.5rem', flexWrap: 'wrap',
          }}>
            <Link href="/adatkezeles" style={{ fontSize: '13.5px', fontWeight: 600, color: 'rgba(17,17,17,0.5)', textDecoration: 'none' }}>
              Adatkezelési tájékoztató →
            </Link>
            <Link href="/garancia" style={{ fontSize: '13.5px', fontWeight: 600, color: 'rgba(17,17,17,0.5)', textDecoration: 'none' }}>
              Garancia feltételek →
            </Link>
            <Link href="/kapcsolat" style={{ fontSize: '13.5px', fontWeight: 600, color: 'rgba(17,17,17,0.5)', textDecoration: 'none' }}>
              Kapcsolat →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
