'use client'

import { useState, useRef, useEffect } from 'react'
import { X, MessageCircle, Send } from 'lucide-react'

type Message = { role: 'bot' | 'user'; text: string }

function renderText(text: string) {
  const parts = text.split(/(\[.+?\]\(.+?\))/g)
  return parts.map((part, i) => {
    const match = part.match(/^\[(.+?)\]\((.+?)\)$/)
    if (match) {
      return <a key={i} href={match[2]} style={{ color: '#111111', fontWeight: 700, textDecoration: 'underline' }}>{match[1]}</a>
    }
    return part
  })
}

const WELCOME = 'Szia! Én vagyok a Bringabarát chatbot. Miben segíthetek?'

const QUICK_REPLIES = ['Garancia infók', 'Időpont egyeztetés', 'Szállítás', 'Árak']

function getBotReply(input: string): string {
  const t = input.toLowerCase()
  if (t.includes('ár') || t.includes('mennyibe') || t.includes('kerül')) {
    return 'Tekintse meg kerékpárjainkat! [Kerékpárok böngészése](/) – minden kategóriában megtalálja az árat.'
  }
  if (t.includes('garancia')) {
    return 'Adásvételi szerződéssel ellátott garanciát vállalunk minden kerékpárunkra.'
  }
  if (t.includes('megtekint') || t.includes('megnézni') || t.includes('időpont')) {
    return 'Személyes megtekintés előzetes egyeztetés alapján lehetséges. Hívj: +36 30 889 7559'
  }
  if (t.includes('szállítás')) {
    return 'Szállítás Magyar Posta mindenkori díjszabása szerint lehetséges.'
  }
  if (t.includes('hol') || t.includes('cím') || t.includes('hely')) {
    return 'Kápolnásnyék, Tó utca 6, 2475. Előzetes egyeztetés alapján várunk!'
  }
  if (t.includes('használt') || t.includes('outlet') || t.includes('különbség')) {
    return 'Az outlet kerékpárok új, 0 km-es bemutatódarabok. A használt kerékpárok előzőleg már forgalomban voltak.'
  }
  return 'Ezt a kérdést nem tudom megválaszolni. Hívj minket: +36 30 889 7559'
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ role: 'bot', text: WELCOME }])
  const [input, setInput] = useState('')
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100)
  }, [isOpen])

  function sendMessage(text: string) {
    if (!text.trim()) return
    setShowQuickReplies(false)
    setMessages(prev => [
      ...prev,
      { role: 'user', text },
      { role: 'bot', text: getBotReply(text) },
    ])
    setInput('')
  }

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
      {/* Open panel */}
      {isOpen && (
        <div style={{
          width: '360px', height: '480px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          marginBottom: '16px',
          border: '1px solid rgba(0,0,0,0.06)',
        }}>
          {/* Header */}
          <div style={{
            background: '#e8c547',
            padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '15px', letterSpacing: '-0.03em', color: '#111111' }}>
                Bringabarát Segítség
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(17,17,17,0.55)', marginTop: '2px' }}>
                Általában azonnal válaszolunk
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{
              background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '50%',
              width: '32px', height: '32px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.1)')}
            >
              <X size={16} color="#111111" />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto',
            padding: '16px',
            display: 'flex', flexDirection: 'column', gap: '10px',
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: msg.role === 'user' ? '#e8c547' : '#f0ede8',
                  color: '#111111',
                  fontSize: '13.5px',
                  lineHeight: 1.5,
                  fontWeight: 500,
                }}>{renderText(msg.text)}</div>
              </div>
            ))}

            {/* Quick reply buttons after welcome */}
            {showQuickReplies && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                {QUICK_REPLIES.map(label => (
                  <button key={label} onClick={() => sendMessage(label)} style={{
                    padding: '7px 13px',
                    background: '#ffffff',
                    border: '1.5px solid #e8c547',
                    borderRadius: '20px',
                    fontSize: '12px', fontWeight: 600,
                    color: '#111111', cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#e8c547')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}
                  >{label}</button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid rgba(0,0,0,0.07)',
            display: 'flex', gap: '8px', flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Írj üzenetet..."
              style={{
                flex: 1, padding: '10px 14px',
                border: '1px solid #E8E4DC',
                borderRadius: '10px',
                fontSize: '13.5px', outline: 'none',
                fontFamily: 'Inter, system-ui, sans-serif',
                color: '#111111',
                background: '#fafaf8',
              }}
            />
            <button onClick={() => sendMessage(input)} style={{
              background: '#111111', border: 'none',
              borderRadius: '10px',
              width: '40px', height: '40px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#333333')}
              onMouseLeave={e => (e.currentTarget.style.background = '#111111')}
            >
              <Send size={15} color="#ffffff" />
            </button>
          </div>
        </div>
      )}

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
