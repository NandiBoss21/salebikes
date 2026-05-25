'use client'
import { Phone } from 'lucide-react'
import { supabase } from '@/lib/supabase'

function track(bikeId: string, bikeName: string, source: string) {
  supabase.from('inquiries').insert({ bike_id: bikeId, bike_name: bikeName, source }).then(() => {})
}

export function InquiryButtonDesktop({ bikeId, bikeName }: { bikeId: string; bikeName: string }) {
  return (
    <>
      <a
        href="tel:+36308897559"
        className="bike-cta-btn hide-mobile"
        onClick={() => track(bikeId, bikeName, 'detail_desktop')}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '10px', width: '100%', padding: '16px',
          color: '#111111',
          borderRadius: '9px', textDecoration: 'none',
          fontSize: '16px', fontWeight: 800,
          letterSpacing: '-0.02em',
          marginBottom: '8px',
        }}
      >
        <Phone size={18} />
        Érdeklődöm – +36 30 889 7559
      </a>
      <p style={{ fontSize: '13px', color: '#6B6B6B', textAlign: 'center', marginBottom: '1.5rem' }}>
        📍 Személyes átvétel Kápolnásnyéken, előre egyeztetett időpontban
      </p>
    </>
  )
}

export function InquiryButtonMobile({ bikeId, bikeName }: { bikeId: string; bikeName: string }) {
  return (
    <a
      href="tel:+36308897559"
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
      <Phone size={17} />
      Érdeklődöm – +36 30 889 7559
    </a>
  )
}
