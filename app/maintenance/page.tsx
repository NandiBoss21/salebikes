export default function Maintenance() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#111111',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '1.5rem' }}>🚲</div>
      <h1 style={{
        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
        fontWeight: 900,
        color: '#ffffff',
        letterSpacing: '-0.04em',
        marginBottom: '1rem'
      }}>
        Weboldalunk átmenetileg karbantartás alatt áll
      </h1>
      <p style={{
        fontSize: '15px',
        color: 'rgba(255,255,255,0.55)',
        lineHeight: 1.8,
        maxWidth: '520px',
        marginBottom: '2rem'
      }}>
        Köszönjük türelmedet! Weboldalunk jelenleg technikai fejlesztés alatt áll.
        Addig is keresd fel korábbi oldalunkat, ahol teljes kínálatunkat megtalálod:
      </p>
      <a href="https://www.salebikes.hu" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: '#e8c547',
        color: '#111111',
        padding: '14px 28px',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: 700,
        textDecoration: 'none',
        marginBottom: '1rem'
      }}>
        👉 www.salebikes.hu
      </a>
      <p style={{
        fontSize: '13px',
        color: 'rgba(255,255,255,0.3)',
        marginTop: '1rem'
      }}>
        Telefon: <a href="tel:+36308897559" style={{ color: '#e8c547', textDecoration: 'none' }}>+36 30 889 7559</a>
      </p>
    </div>
  )
}
