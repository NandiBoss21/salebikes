import Navbar from '@/components/Navbar'

export default function KapcsolatPage() {
  return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, color: '#111111', marginBottom: '1rem' }}>
          Vedd fel velünk a kapcsolatot
        </h2>
        <p style={{ fontSize: '15px', color: 'rgba(17,17,17,0.6)', marginBottom: '2rem' }}>
          Hívj minket és segítünk megtalálni a számodra tökéletes kerékpárt!
        </p>
        <a href="tel:+36308897559" style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          background: '#e8c547', color: '#111111',
          padding: '16px 32px', borderRadius: '8px',
          fontSize: '18px', fontWeight: 700, textDecoration: 'none',
          marginBottom: '2rem'
        }}>
          📞 +36 30 889 7559
        </a>
        <p style={{ fontSize: '13px', color: 'rgba(17,17,17,0.4)' }}>
          bringabarat@hotmail.com · 2475 Kápolnásnyék, Tó utca 6.
        </p>
      </div>
    </>
  )
}
