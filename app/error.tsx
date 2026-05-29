'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem', background: '#fafaf8',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '40px', marginBottom: '1rem' }}>🚲</div>
      <h2 style={{
        fontSize: '1.25rem', fontWeight: 800,
        letterSpacing: '-0.03em', color: '#111111',
        marginBottom: '0.5rem',
      }}>Hiba történt</h2>
      <p style={{ fontSize: '14px', color: 'rgba(17,17,17,0.5)', marginBottom: '1.5rem' }}>
        Valami elromlott. Kérjük próbáld újra.
      </p>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={reset} style={{
          background: '#e8c547', color: '#111111',
          border: 'none', borderRadius: '8px',
          padding: '12px 24px', cursor: 'pointer',
          fontSize: '14px', fontWeight: 700,
          letterSpacing: '-0.02em',
        }}>
          Újrapróbálás
        </button>
        <Link href="/" style={{
          background: '#111111', color: '#ffffff',
          borderRadius: '8px', padding: '12px 24px',
          fontSize: '14px', fontWeight: 700,
          letterSpacing: '-0.02em', textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center',
        }}>
          Főoldal
        </Link>
      </div>
    </div>
  )
}
