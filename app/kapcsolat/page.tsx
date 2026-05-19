'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { Phone, Mail, MapPin, Clock, Truck } from 'lucide-react'
import type { Metadata } from 'next'

export default function KapcsolatPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const body = `Név: ${name}\nTelefon: ${phone}\nEmail: ${email}\n\nÜzenet:\n${message}`
    window.location.href = `mailto:ht.bike@hotmail.com?subject=${encodeURIComponent(`Érdeklődés – ${name}`)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    fontSize: '13.5px', fontWeight: 400,
    border: '1px solid #E8E4DC',
    borderRadius: '8px',
    background: '#FAFAF8',
    color: '#111111',
    outline: 'none',
    transition: 'border-color 0.15s',
    fontFamily: 'inherit',
  }

  return (
    <>
      <Navbar />

      {/* Header */}
      <section style={{
        padding: 'clamp(3.5rem, 7vw, 6rem) clamp(1.5rem, 4vw, 3rem) clamp(2rem, 4vw, 3rem)',
        background: '#FAFAF8',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{
            fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(17,17,17,0.35)', marginBottom: '0.75rem',
          }}>Elérhetőség</div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: '#111111', lineHeight: 1.05,
          }}>
            Kapcsolat &<br />
            <span style={{ color: '#e8c547' }}>Szállítás</span>
          </h1>
        </div>
      </section>

      {/* Main content */}
      <section style={{
        background: '#FAFAF8',
        padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)',
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: '3rem',
          alignItems: 'start',
        }}>

          {/* Left — info */}
          <div>
            <div style={{
              background: '#ffffff',
              border: '1px solid #E8E4DC',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{
                fontSize: '16px', fontWeight: 800,
                letterSpacing: '-0.03em', color: '#111111',
                marginBottom: '4px',
              }}>Bringabarát Tesztbike</div>
              <div style={{
                fontSize: '13px', color: 'rgba(17,17,17,0.45)',
                marginBottom: '1.75rem',
              }}>Outlet · Bemutató · Használt kerékpárok</div>

              {[
                { icon: <MapPin size={16} />, label: 'Cím', value: '2474 Kápolnásnyék, Tó utca 6.\nMagyarország', href: undefined },
                { icon: <Phone size={16} />, label: 'Telefon', value: '+36-30-889-7559', href: 'tel:+36308897559' },
                { icon: <Mail size={16} />, label: 'Email', value: 'ht.bike@hotmail.com', href: 'mailto:ht.bike@hotmail.com' },
                { icon: <Clock size={16} />, label: 'Nyitvatartás', value: 'Előzetes egyeztetés alapján', href: undefined },
                { icon: <Truck size={16} />, label: 'Szállítás', value: 'Magyar Posta mindenkori díjszabása szerint', href: undefined },
              ].map((item) => (
                <div key={item.label} style={{
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                  marginBottom: '1.25rem',
                }}>
                  <span style={{
                    color: '#e8c547', flexShrink: 0, marginTop: '2px',
                  }}>{item.icon}</span>
                  <div>
                    <div style={{
                      fontSize: '10px', fontWeight: 700,
                      letterSpacing: '0.07em', textTransform: 'uppercase',
                      color: 'rgba(17,17,17,0.35)', marginBottom: '3px',
                    }}>{item.label}</div>
                    {item.href ? (
                      <a href={item.href} style={{
                        fontSize: '14px', fontWeight: 500,
                        color: '#111111', textDecoration: 'none',
                      }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#e8c547')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#111111')}
                      >{item.value}</a>
                    ) : (
                      <div style={{
                        fontSize: '14px', fontWeight: 500,
                        color: '#111111', whiteSpace: 'pre-line',
                      }}>{item.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Google Maps */}
            <div style={{
              borderRadius: '12px', overflow: 'hidden',
              border: '1px solid #E8E4DC',
              height: '280px',
            }}>
              <iframe
                src="https://maps.google.com/maps?q=2475+K%C3%A1poln%C3%A1sny%C3%A9k%2C+T%C3%B3+utca+6&output=embed&z=15"
                width="100%"
                height="280"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bringabarát Tesztbike térkép"
              />
            </div>
          </div>

          {/* Right — form */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #E8E4DC',
            borderRadius: '12px',
            padding: '2rem',
          }}>
            <h2 style={{
              fontSize: '1.35rem', fontWeight: 800,
              letterSpacing: '-0.03em', color: '#111111',
              marginBottom: '0.5rem',
            }}>Üzenet küldése</h2>
            <p style={{
              fontSize: '13px', color: 'rgba(17,17,17,0.45)',
              marginBottom: '1.75rem', lineHeight: 1.6,
            }}>
              Kérdésed van? Írj nekünk és visszahívunk!
            </p>

            {sent ? (
              <div style={{
                padding: '2rem', textAlign: 'center',
                background: '#f0fdf4', borderRadius: '8px',
                border: '1px solid rgba(34,197,94,0.2)',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '0.75rem' }}>✓</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111111', marginBottom: '6px' }}>Köszönjük!</div>
                <div style={{ fontSize: '13px', color: 'rgba(17,17,17,0.5)' }}>
                  Az e-mail kliens megnyílt. Hamarosan jelentkezünk!
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'rgba(17,17,17,0.5)', marginBottom: '6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Név *</label>
                  <input
                    type="text" required
                    value={name} onChange={e => setName(e.target.value)}
                    placeholder="Kovács János"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = '#e8c547')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#E8E4DC')}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'rgba(17,17,17,0.5)', marginBottom: '6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Telefon</label>
                  <input
                    type="tel"
                    value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="+36 30 123 4567"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = '#e8c547')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#E8E4DC')}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'rgba(17,17,17,0.5)', marginBottom: '6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Email</label>
                  <input
                    type="email"
                    value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="pelda@email.hu"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = '#e8c547')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#E8E4DC')}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'rgba(17,17,17,0.5)', marginBottom: '6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Üzenet *</label>
                  <textarea
                    required rows={5}
                    value={message} onChange={e => setMessage(e.target.value)}
                    placeholder="Melyik kerékpár iránt érdeklődsz? Mikor érnél rá megnézni?"
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '110px' }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#e8c547')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#E8E4DC')}
                  />
                </div>
                <button type="submit" style={{
                  background: '#e8c547', color: '#111111',
                  border: 'none', borderRadius: '8px',
                  padding: '14px 24px', cursor: 'pointer',
                  fontSize: '14px', fontWeight: 800,
                  letterSpacing: '-0.02em',
                  transition: 'background 0.15s',
                  fontFamily: 'inherit',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#d4b23e')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#e8c547')}
                >
                  Üzenet küldése →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .kapcsolat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
