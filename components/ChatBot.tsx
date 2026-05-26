'use client'

import { useState, useEffect, useRef } from 'react'
import { X, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Action =
  | { type: 'node'; target: string }
  | { type: 'navigate'; href: string }
  | { type: 'tel' }
  | { type: 'external'; href: string }
  | { type: 'reset' }

type NodeButton = { label: string; action: Action }
type ConvoNode  = { message: string; buttons: NodeButton[] }

const NODES: Record<string, ConvoNode> = {
  start: {
    message: 'Szia! Miben segíthetek? 👋',
    buttons: [
      { label: 'Kerékpárokat nézek',   action: { type: 'node', target: 'browse_type' } },
      { label: 'Árak érdekelnek',       action: { type: 'node', target: 'prices' } },
      { label: 'Garanciáról kérdezek', action: { type: 'node', target: 'guarantee' } },
      { label: 'Időpontot egyeztetnék', action: { type: 'node', target: 'appointment' } },
    ],
  },
  browse_type: {
    message: 'Milyen típusú kerékpár érdekel?',
    buttons: [
      { label: 'Ebike',     action: { type: 'node', target: 'cat_ebike' } },
      { label: 'MTB',       action: { type: 'node', target: 'cat_mtb' } },
      { label: 'Trekking',  action: { type: 'node', target: 'cat_trekking' } },
      { label: 'Gravel',    action: { type: 'node', target: 'cat_gravel' } },
      { label: 'Gyerek',    action: { type: 'node', target: 'cat_gyerek' } },
      { label: 'Országúti', action: { type: 'node', target: 'cat_orszaguti' } },
    ],
  },
  cat_ebike: {
    message: 'Szuper! Ebike kerékpáraink outlet és használt állapotban, garanciával várnak. Jelenleg több modell is raktáron van.',
    buttons: [
      { label: 'Megnézem a kínálatot →', action: { type: 'navigate', href: '/ebike' } },
      { label: 'Árak?',                   action: { type: 'node', target: 'prices' } },
      { label: 'Garancia?',               action: { type: 'node', target: 'guarantee' } },
      { label: 'Időpontot egyeztetek',    action: { type: 'node', target: 'appointment' } },
    ],
  },
  cat_mtb: {
    message: 'Szuper! MTB kerékpáraink outlet és használt állapotban, garanciával várnak. Jelenleg több modell is raktáron van.',
    buttons: [
      { label: 'Megnézem a kínálatot →', action: { type: 'navigate', href: '/mtb' } },
      { label: 'Árak?',                   action: { type: 'node', target: 'prices' } },
      { label: 'Garancia?',               action: { type: 'node', target: 'guarantee' } },
      { label: 'Időpontot egyeztetek',    action: { type: 'node', target: 'appointment' } },
    ],
  },
  cat_trekking: {
    message: 'Szuper! Trekking kerékpáraink outlet és használt állapotban, garanciával várnak. Jelenleg több modell is raktáron van.',
    buttons: [
      { label: 'Megnézem a kínálatot →', action: { type: 'navigate', href: '/trekking' } },
      { label: 'Árak?',                   action: { type: 'node', target: 'prices' } },
      { label: 'Garancia?',               action: { type: 'node', target: 'guarantee' } },
      { label: 'Időpontot egyeztetek',    action: { type: 'node', target: 'appointment' } },
    ],
  },
  cat_gravel: {
    message: 'Szuper! Gravel kerékpáraink outlet és használt állapotban, garanciával várnak. Jelenleg több modell is raktáron van.',
    buttons: [
      { label: 'Megnézem a kínálatot →', action: { type: 'navigate', href: '/gravel' } },
      { label: 'Árak?',                   action: { type: 'node', target: 'prices' } },
      { label: 'Garancia?',               action: { type: 'node', target: 'guarantee' } },
      { label: 'Időpontot egyeztetek',    action: { type: 'node', target: 'appointment' } },
    ],
  },
  cat_gyerek: {
    message: 'Szuper! Gyerek kerékpáraink outlet és használt állapotban, garanciával várnak. Jelenleg több modell is raktáron van.',
    buttons: [
      { label: 'Megnézem a kínálatot →', action: { type: 'navigate', href: '/gyerek' } },
      { label: 'Árak?',                   action: { type: 'node', target: 'prices' } },
      { label: 'Garancia?',               action: { type: 'node', target: 'guarantee' } },
      { label: 'Időpontot egyeztetek',    action: { type: 'node', target: 'appointment' } },
    ],
  },
  cat_orszaguti: {
    message: 'Szuper! Országúti kerékpáraink outlet és használt állapotban, garanciával várnak. Jelenleg több modell is raktáron van.',
    buttons: [
      { label: 'Megnézem a kínálatot →', action: { type: 'navigate', href: '/orszaguti' } },
      { label: 'Árak?',                   action: { type: 'node', target: 'prices' } },
      { label: 'Garancia?',               action: { type: 'node', target: 'guarantee' } },
      { label: 'Időpontot egyeztetek',    action: { type: 'node', target: 'appointment' } },
    ],
  },
  prices: {
    message: 'Kerékpárjaink ára a típustól és állapottól függően változik. Ebike-ok: 150 000–600 000 Ft, MTB-k: 80 000–400 000 Ft, Trekking: 60 000–250 000 Ft. Minden ár tartalmazza a garanciát.',
    buttons: [
      { label: 'Ebike árakat nézem',    action: { type: 'navigate', href: '/ebike' } },
      { label: 'MTB árakat nézem',      action: { type: 'navigate', href: '/mtb' } },
      { label: 'Trekking árakat nézem', action: { type: 'navigate', href: '/trekking' } },
      { label: 'Összes kerékpár',       action: { type: 'navigate', href: '/osszes-kerekpar' } },
    ],
  },
  guarantee: {
    message: 'Minden kerékpárra garanciát adunk és adásvételi szerződést kötünk. 2008 óta több mint 1000 elégedett vásárlónk van.',
    buttons: [
      { label: 'Mennyi a garancia ideje?', action: { type: 'node', target: 'guarantee_duration' } },
      { label: 'Mit fed a garancia?',       action: { type: 'node', target: 'guarantee_coverage' } },
      { label: 'Összes kerékpár',           action: { type: 'navigate', href: '/osszes-kerekpar' } },
      { label: 'Kapcsolat',                 action: { type: 'navigate', href: '/kapcsolat' } },
    ],
  },
  guarantee_duration: {
    message: 'A garancia időtartama kerékpáronként eltérő – személyesen egyeztetjük. Hívj minket és elmondunk mindent!',
    buttons: [
      { label: 'Hívok most',        action: { type: 'tel' } },
      { label: 'Üzenetet küldök',   action: { type: 'navigate', href: '/kapcsolat' } },
      { label: 'Vissza a főoldalra', action: { type: 'reset' } },
    ],
  },
  guarantee_coverage: {
    message: 'A garancia a kerékpár mechanikai részeire terjed ki. Minden kerékpárt személyesen ellenőrzünk átadás előtt.',
    buttons: [
      { label: 'Garancia oldal →', action: { type: 'navigate', href: '/garancia' } },
      { label: 'Hívok most',       action: { type: 'tel' } },
      { label: 'Üzenetet küldök',  action: { type: 'navigate', href: '/kapcsolat' } },
    ],
  },
  appointment: {
    message: 'Személyes megtekintés rugalmasan egyeztethető. Kápolnásnyék, Tó utca 6. – Budapesttől 50 km.',
    buttons: [
      { label: 'Hívok most',       action: { type: 'tel' } },
      { label: 'Üzenetet küldök',  action: { type: 'navigate', href: '/kapcsolat' } },
      { label: 'Térkép →',         action: { type: 'external', href: 'https://maps.google.com/maps?q=2475+K%C3%A1poln%C3%A1sny%C3%A9k%2C+T%C3%B3+utca+6' } },
    ],
  },
}

type Message = { role: 'bot' | 'user'; text: string }

export default function ChatBot() {
  const router = useRouter()
  const [isOpen, setIsOpen]           = useState(false)
  const [visible, setVisible]         = useState(false)
  const [messages, setMessages]       = useState<Message[]>([{ role: 'bot', text: NODES.start.message }])
  const [currentNode, setCurrentNode] = useState('start')
  const [bannerHeight, setBannerHeight] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function measure() {
      const el = document.getElementById('cookie-banner')
      setBannerHeight(el ? el.getBoundingClientRect().height : 0)
    }
    function onConsent() { setBannerHeight(0) }
    const t = setTimeout(measure, 50)
    window.addEventListener('cookie-consent-changed', onConsent)
    return () => { clearTimeout(t); window.removeEventListener('cookie-consent-changed', onConsent) }
  }, [])

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
    }
  }, [isOpen])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleButton(btn: NodeButton) {
    const { action, label } = btn
    if (action.type === 'tel') {
      window.location.href = 'tel:+36308897559'
      return
    }
    if (action.type === 'external') {
      window.open(action.href, '_blank', 'noopener')
      return
    }
    if (action.type === 'navigate') {
      setIsOpen(false)
      router.push(action.href)
      return
    }
    if (action.type === 'reset') {
      setMessages([{ role: 'bot', text: NODES.start.message }])
      setCurrentNode('start')
      return
    }
    // type === 'node'
    const next = NODES[action.target]
    if (!next) return
    setMessages(prev => [
      ...prev,
      { role: 'user', text: label },
      { role: 'bot', text: next.message },
    ])
    setCurrentNode(action.target)
  }

  const node = NODES[currentNode]
  const buttons: NodeButton[] = currentNode === 'start'
    ? node.buttons
    : [...node.buttons, { label: 'Főmenü', action: { type: 'reset' } }]

  return (
    <div style={{
      position: 'fixed',
      bottom: bannerHeight > 0 ? bannerHeight + 16 : 24,
      right: '24px',
      zIndex: 1000,
      transition: 'bottom 0.3s ease',
    }}>

      {/* Chat window */}
      <div style={{
        width: '340px',
        maxHeight: '520px',
        background: '#111111',
        borderRadius: '16px',
        boxShadow: '0 12px 48px rgba(0,0,0,0.35)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        marginBottom: '16px',
        border: '1px solid rgba(255,255,255,0.08)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.97)',
        pointerEvents: isOpen ? 'auto' : 'none',
        transition: 'opacity 0.22s ease, transform 0.22s ease',
        transformOrigin: 'bottom right',
      }}>

        {/* Header */}
        <div style={{
          background: '#1a1a1a',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px', lineHeight: 1 }}>🚲</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '14px', letterSpacing: '-0.03em', color: '#ffffff' }}>
                Bringabarát Segítség
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '1px' }}>
                Gyors választ adunk
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} style={{
            background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: '50%',
            width: '30px', height: '30px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s', flexShrink: 0,
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
          >
            <X size={14} color="rgba(255,255,255,0.7)" />
          </button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '16px',
          display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                maxWidth: '82%',
                padding: '10px 13px',
                borderRadius: msg.role === 'user'
                  ? '14px 14px 4px 14px'
                  : '14px 14px 14px 4px',
                background: msg.role === 'user'
                  ? '#e8c547'
                  : 'rgba(255,255,255,0.08)',
                color: msg.role === 'user' ? '#111111' : '#ffffff',
                fontSize: '13.5px',
                lineHeight: 1.55,
                fontWeight: msg.role === 'user' ? 600 : 400,
              }}>{msg.text}</div>
            </div>
          ))}

          {/* Quick-reply buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
            {buttons.map((btn, i) => {
              const isSecondary = btn.action.type === 'reset' && btn.label === 'Főmenü'
              return (
                <button key={i} onClick={() => handleButton(btn)} style={{
                  padding: '7px 13px',
                  background: isSecondary ? 'transparent' : '#e8c547',
                  border: isSecondary ? '1px solid rgba(255,255,255,0.2)' : 'none',
                  borderRadius: '20px',
                  fontSize: '12px', fontWeight: 600,
                  color: isSecondary ? 'rgba(255,255,255,0.5)' : '#111111',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  letterSpacing: '-0.01em',
                  lineHeight: 1,
                }}
                  onMouseEnter={e => {
                    if (isSecondary) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
                    } else {
                      e.currentTarget.style.background = '#d4b23e'
                    }
                  }}
                  onMouseLeave={e => {
                    if (isSecondary) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
                    } else {
                      e.currentTarget.style.background = '#e8c547'
                    }
                  }}
                >{btn.label}</button>
              )
            })}
          </div>

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        style={{
          width: '56px', height: '56px',
          borderRadius: '50%',
          background: '#e8c547',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(232,197,71,0.5)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          float: 'right',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.08)'
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(232,197,71,0.6)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(232,197,71,0.5)'
        }}
      >
        {isOpen ? <X size={22} color="#111111" /> : <MessageCircle size={22} color="#111111" />}
      </button>
    </div>
  )
}
