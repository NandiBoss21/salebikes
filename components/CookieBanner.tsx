'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

type Consent = 'all' | 'necessary' | { necessary: true; statistics: boolean; marketing: boolean }

function getConsent(): Consent | null {
  try {
    const raw = localStorage.getItem('cookie-consent')
    if (!raw) return null
    return JSON.parse(raw) as Consent
  } catch { return null }
}

function saveConsent(value: Consent) {
  try { localStorage.setItem('cookie-consent', JSON.stringify(value)) } catch {}
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [statistics, setStatistics] = useState(true)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    if (getConsent() === null) setVisible(true)
  }, [])

  function dismiss() {
    setVisible(false)
    setModalOpen(false)
    window.dispatchEvent(new Event('cookie-consent-changed'))
  }

  function acceptAll() { saveConsent('all'); dismiss() }
  function rejectAll()  { saveConsent('necessary'); dismiss() }
  function saveCustom() { saveConsent({ necessary: true, statistics, marketing }); dismiss() }

  if (!visible) return null

  return (
    <>
      {/* ── Modal ──────────────────────────────────────────────── */}
      {modalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1001,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }}
          onClick={e => { if (e.target === e.currentTarget) setModalOpen(false) }}
        >
          <div style={{
            background: '#ffffff', borderRadius: '16px',
            width: '100%', maxWidth: '480px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            {/* Modal header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #E8E4DC',
            }}>
              <div style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '-0.03em', color: '#111111' }}>
                Süti beállítások
              </div>
              <button onClick={() => setModalOpen(false)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(17,17,17,0.4)', padding: '4px',
                display: 'flex', alignItems: 'center',
                borderRadius: '6px',
              }}><X size={18} /></button>
            </div>

            {/* Rows */}
            <div style={{ padding: '0.5rem 0' }}>
              {[
                {
                  label: 'Szükséges sütik',
                  desc: 'Az oldal működéséhez szükséges',
                  enabled: true,
                  locked: true,
                  toggle: () => {},
                },
                {
                  label: 'Statisztikai sütik',
                  desc: 'Segít megérteni hogyan használják az oldalt',
                  enabled: statistics,
                  locked: false,
                  toggle: () => setStatistics(v => !v),
                },
                {
                  label: 'Marketing sütik',
                  desc: 'Személyre szabott tartalmak megjelenítéséhez',
                  enabled: marketing,
                  locked: false,
                  toggle: () => setMarketing(v => !v),
                },
              ].map(row => (
                <div key={row.label} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: '1rem', padding: '1rem 1.5rem',
                  borderBottom: '1px solid #f0ede8',
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#111111', marginBottom: '2px' }}>
                      {row.label}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(17,17,17,0.45)' }}>{row.desc}</div>
                  </div>
                  <button
                    onClick={row.locked ? undefined : row.toggle}
                    style={{
                      position: 'relative', flexShrink: 0,
                      width: '44px', height: '24px',
                      borderRadius: '12px', border: 'none',
                      background: row.enabled ? '#e8c547' : '#E8E4DC',
                      cursor: row.locked ? 'not-allowed' : 'pointer',
                      transition: 'background 0.2s',
                      opacity: row.locked ? 0.6 : 1,
                    }}
                    title={row.locked ? 'Mindig bekapcsolt' : undefined}
                  >
                    <span style={{
                      position: 'absolute',
                      top: '3px',
                      left: row.enabled ? '23px' : '3px',
                      width: '18px', height: '18px',
                      borderRadius: '50%', background: '#ffffff',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                      transition: 'left 0.2s',
                    }} />
                  </button>
                </div>
              ))}
            </div>

            {/* Modal footer */}
            <div style={{
              padding: '1.25rem 1.5rem',
              display: 'flex', gap: '10px', justifyContent: 'flex-end',
            }}>
              <button onClick={rejectAll} style={{
                padding: '10px 18px', borderRadius: '8px',
                border: '1px solid #E8E4DC', background: 'transparent',
                color: '#111111', fontWeight: 600, fontSize: '13px',
                cursor: 'pointer',
              }}>Elutasítom</button>
              <button onClick={saveCustom} style={{
                padding: '10px 20px', borderRadius: '8px',
                border: 'none', background: '#e8c547',
                color: '#111111', fontWeight: 700, fontSize: '13px',
                cursor: 'pointer',
              }}>Mentés</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Banner ─────────────────────────────────────────────── */}
      <div id="cookie-banner" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
        background: '#ffffff',
        borderTop: '1px solid #E8E4DC',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: '1rem 1.5rem',
          display: 'flex', alignItems: 'center',
          gap: '1.25rem', flexWrap: 'wrap',
        }}>
          <p style={{
            flex: 1, minWidth: '240px',
            fontSize: '13px', color: 'rgba(17,17,17,0.65)',
            margin: 0, lineHeight: 1.6,
          }}>
            Ez az oldal sütiket használ a jobb felhasználói élmény érdekében.
            <a href="/adatkezeles" style={{ color: '#111111', fontWeight: 600, marginLeft: '4px' }}>
              Adatvédelmi tájékoztató
            </a>
          </p>

          <div className="cookie-btns" style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
            <button onClick={() => setModalOpen(true)} style={{
              padding: '9px 16px', borderRadius: '8px',
              border: 'none', background: 'none',
              color: 'rgba(17,17,17,0.55)', fontWeight: 600, fontSize: '13px',
              cursor: 'pointer', textDecoration: 'underline',
            }}>Személyre szabás</button>
            <button onClick={rejectAll} style={{
              padding: '9px 18px', borderRadius: '8px',
              border: '1px solid #E8E4DC', background: 'transparent',
              color: '#111111', fontWeight: 600, fontSize: '13px',
              cursor: 'pointer',
            }}>Elutasítom</button>
            <button onClick={acceptAll} style={{
              padding: '9px 20px', borderRadius: '8px',
              border: 'none', background: '#e8c547',
              color: '#111111', fontWeight: 700, fontSize: '13px',
              cursor: 'pointer',
            }}>Elfogadom</button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 540px) {
          .cookie-btns { width: 100%; }
          .cookie-btns button { flex: 1; justify-content: center; }
        }
      `}</style>
    </>
  )
}
