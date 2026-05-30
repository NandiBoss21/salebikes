import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '70vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '2rem', background: '#fafaf8',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '1.25rem' }}>🚲</div>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: 900, letterSpacing: '-0.04em',
          color: '#111111', marginBottom: '0.75rem',
        }}>Az oldal nem található</h1>
        <p style={{
          fontSize: '15px', color: 'rgba(17,17,17,0.5)',
          marginBottom: '2rem', maxWidth: '420px', lineHeight: 1.6,
        }}>
          Ez a kerékpár vagy oldal már nem elérhető. Böngéssz a többi ajánlatunk között!
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/" style={{
            background: '#e8c547', color: '#111111',
            borderRadius: '8px', padding: '13px 26px',
            fontSize: '14px', fontWeight: 700,
            letterSpacing: '-0.02em', textDecoration: 'none',
          }}>
            Vissza a főoldalra
          </Link>
          <Link href="/osszes-kerekpar" style={{
            background: '#111111', color: '#ffffff',
            borderRadius: '8px', padding: '13px 26px',
            fontSize: '14px', fontWeight: 700,
            letterSpacing: '-0.02em', textDecoration: 'none',
          }}>
            Összes kerékpár
          </Link>
        </div>
      </div>
    </>
  )
}
