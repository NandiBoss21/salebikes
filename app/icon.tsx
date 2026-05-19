import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{
        background: '#e8c547',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '6px',
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="6" cy="17" r="4" stroke="#111111" strokeWidth="2"/>
          <circle cx="18" cy="17" r="4" stroke="#111111" strokeWidth="2"/>
          <circle cx="6" cy="17" r="1" fill="#111111"/>
          <circle cx="18" cy="17" r="1" fill="#111111"/>
          <path d="M6 17L10 8L14 10L18 17" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 8L14 8" stroke="#111111" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="14" cy="7" r="1.5" fill="#111111"/>
        </svg>
      </div>
    ),
    { ...size }
  )
}
