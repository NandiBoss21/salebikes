import Navbar from '@/components/Navbar'
import Link from 'next/link'

export const metadata = {
  title: 'Adatkezelési tájékoztató | SaleBikes – Bringabarát',
  description: 'SaleBikes adatkezelési tájékoztató. GDPR-megfelelő tájékoztatás a kezelt személyes adatokról.',
}

const SECTIONS = [
  {
    id: 'adatkerzelo',
    title: '1. Az adatkezelő adatai',
    content: `Adatkezelő neve: Házi Nándor (SaleBikes)
Székhely: 2475 Kápolnásnyék, Tó utca 6
Telefonszám: +36 30 889 7559
Email: bringabarat@hotmail.com
Weboldal: salebikes.hu`,
  },
  {
    id: 'adatok',
    title: '2. Kezelt adatok köre és célja',
    content: `Kapcsolatfelvételi adatok (név, telefonszám, email-cím, üzenet szövege):
– Cél: kapcsolatfelvétel, ajánlatadás, vásárlás lebonyolítása
– Megőrzési idő: a kapcsolat lezárásától számított 1 év, adásvételi szerződés esetén 8 év (számviteli kötelezettség)
– Jogalap: az érintett hozzájárulása (GDPR 6. cikk (1) a), illetve szerződés teljesítése (GDPR 6. cikk (1) b)

Adásvételi szerződés adatai (név, cím, alvázszám, vételár):
– Cél: jogi bizonyítás, garanciakezelés, számvitel
– Megőrzési idő: 8 év (2000. évi C. tv. alapján)
– Jogalap: jogi kötelezettség teljesítése (GDPR 6. cikk (1) c)`,
  },
  {
    id: 'megorzes',
    title: '3. Adatmegőrzési idők',
    content: `Kapcsolati adatok (amelyekből nem lett vásárlás): 1 év
Adásvételi szerződés mellékletei: 8 év
Számlázási adatok: 8 év

Az adatmegőrzési idő elteltével az adatokat biztonságosan töröljük.`,
  },
  {
    id: 'adattovabbitas',
    title: '4. Adattovábbítás',
    content: `Adatait harmadik félnek nem adjuk el. Kizárólag az alábbi esetekben kerülhet sor adattovábbításra:

– Magyar Posta Zrt.: szállítás esetén a kézbesítéshez szükséges adatok (név, cím)
– Hatósági megkeresés esetén jogszabályi kötelezettség alapján

Adatfeldolgozóink az EU/EGT területén működnek.`,
  },
  {
    id: 'jogok',
    title: '5. Az érintett jogai',
    content: `A GDPR alapján Önt az alábbi jogok illetik meg személyes adataival kapcsolatban:

Hozzáférés joga – kérheti, hogy tájékoztassuk az Önről kezelt adatokról.
Helyesbítés joga – kérheti pontatlan adatai kijavítását.
Törlés joga – kérheti adatai törlését, ha az adatkezelés jogalapja megszűnt.
Adatkezelés korlátozása – kérheti az adatkezelés felfüggesztését.
Adathordozhatóság – kérheti adatai strukturált, géppel olvasható formátumban való átadását.
Tiltakozás joga – tiltakozhat az adatkezelés ellen jogos érdeken alapuló adatkezelés esetén.

Kérelmét az bringabarat@hotmail.com emailre vagy a fenti postai címre küldheti. A kérelemre 30 napon belül válaszolunk.`,
  },
  {
    id: 'jogorvoslat',
    title: '6. Jogorvoslat',
    content: `Amennyiben úgy véli, hogy adatkezelésünk jogszabályt sért, panasszal élhet a Nemzeti Adatvédelmi és Információszabadság Hatóságnál:

NAIH – Nemzeti Adatvédelmi és Információszabadság Hatóság
Székhely: 1055 Budapest, Falk Miksa utca 9-11.
Postacím: 1374 Budapest, Pf. 603.
Telefon: +36 1 391 1400
Email: ugyfelszolgalat@naih.hu
Weboldal: naih.hu`,
  },
  {
    id: 'sutik',
    title: '7. Sütik (cookies)',
    content: `Weboldalunk kizárólag a működéshez elengedhetetlen technikai sütiket alkalmaz. Hirdetési célú vagy nyomkövető sütiket nem használunk, marketing platformokhoz (pl. Meta Pixel, Google Analytics) nem csatlakozunk.

A Google Maps beágyazás esetén a Google saját adatkezelési szabályzata érvényes (policies.google.com/privacy).`,
  },
  {
    id: 'modositas',
    title: '8. Tájékoztató módosítása',
    content: `Adatkezelési tájékoztatónkat szükség esetén módosíthatjuk. A módosítás a weboldalon való közzétételkor lép hatályba. Javasoljuk, hogy rendszeresen tekintse át ezt az oldalt.

Jelen tájékoztató 2024. január 1. napjától hatályos.`,
  },
]

export default function AdatkezelesPage() {
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
          }}>Adatkezelési tájékoztató</h1>
          <p style={{
            fontSize: '13px', color: 'rgba(17,17,17,0.4)',
          }}>GDPR-megfelelő tájékoztató · Hatályos: 2024. január 1-től</p>
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
                }}>{s.content}</div>
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
            <Link href="/aszf" style={{ fontSize: '13.5px', fontWeight: 600, color: 'rgba(17,17,17,0.5)', textDecoration: 'none' }}>
              Általános Szerződési Feltételek →
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
