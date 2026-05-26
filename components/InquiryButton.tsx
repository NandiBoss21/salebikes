'use client'
import { supabase } from '@/lib/supabase'

function track(bikeId: string, bikeName: string, source: string) {
  supabase.from('inquiries').insert({ bike_id: bikeId, bike_name: bikeName, source }).then(() => {})
}

export function InquiryButtonDesktop({ bikeId, bikeName, bikeLabel }: { bikeId: string; bikeName: string; bikeLabel: string }) {
  const formHref = `/kapcsolat?bike=${encodeURIComponent(bikeLabel)}`
  return (
    <div className="hide-mobile" style={{ marginBottom: '1.5rem' }}>
      <a
        href="tel:+36308897559"
        onClick={() => track(bikeId, bikeName, 'detail_desktop_call')}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          background: '#e8c547', color: '#111111',
          padding: '14px 24px', borderRadius: '8px',
          fontSize: '15px', fontWeight: 700,
          textDecoration: 'none', width: '100%',
          marginBottom: '10px',
        }}
      >
        📞 Hívj most – +36 30 889 7559
      </a>
      <a
        href={formHref}
        onClick={() => track(bikeId, bikeName, 'detail_desktop_form')}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          background: '#111111', color: '#ffffff',
          border: '1.5px solid rgba(0,0,0,0.12)',
          padding: '14px 24px', borderRadius: '8px',
          fontSize: '15px', fontWeight: 600,
          textDecoration: 'none', width: '100%',
        }}
      >
        ✉️ Kérdésem van erről a kerékpárról
      </a>
    </div>
  )
}

export function InquiryButtonMobile({ bikeId, bikeName, bikeLabel }: { bikeId: string; bikeName: string; bikeLabel: string }) {
  const href = `/kapcsolat?bike=${encodeURIComponent(bikeLabel)}`
  return (
    <a
      href={href}
      className="mobile-cta"
      onClick={() => track(bikeId, bikeName, 'detail_mobile')}
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: '#e8c547', color: '#111111',
        alignItems: 'center', justifyContent: 'center',
        gap: '10px', padding: '16px',
        fontSize: '15px', fontWeight: 800,
        letterSpacing: '-0.01em', textDecoration: 'none',
      }}
    >
      ✉️ Érdeklődöm
    </a>
  )
}
