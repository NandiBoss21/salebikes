'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function BikeGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxVisible, setLightboxVisible] = useState(false)

  const openLightbox = () => {
    setLightboxOpen(true)
    // Double RAF: first frame mounts the element, second triggers the transition
    requestAnimationFrame(() => requestAnimationFrame(() => setLightboxVisible(true)))
  }

  const closeLightbox = useCallback(() => {
    setLightboxVisible(false)
    setTimeout(() => setLightboxOpen(false), 280)
  }, [])

  const prev = useCallback(() =>
    setActive(a => (a - 1 + images.length) % images.length),
    [images.length]
  )

  const next = useCallback(() =>
    setActive(a => (a + 1) % images.length),
    [images.length]
  )

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape')     closeLightbox()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen, prev, next, closeLightbox])

  // Prevent body scroll while lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  if (!images?.length) {
    return (
      <div style={{
        aspectRatio: '4/3', background: '#f5f5f5', borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '64px', color: 'rgba(0,0,0,0.12)',
      }}>🚲</div>
    )
  }

  const btnStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.13)',
    border: 'none', cursor: 'pointer',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#ffffff', flexShrink: 0,
    transition: 'background 0.15s',
  }

  return (
    <>
      {/* Main image */}
      <div
        onClick={openLightbox}
        style={{
          position: 'relative', aspectRatio: '4/3',
          background: '#f5f5f5', borderRadius: '10px',
          overflow: 'hidden', marginBottom: '10px',
          cursor: 'zoom-in',
        }}
      >
        <Image
          src={images[active]}
          alt={alt}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(images.length, 5)}, 1fr)`,
          gap: '8px',
        }}>
          {images.map((img, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              position: 'relative', aspectRatio: '4/3',
              background: '#f5f5f5', borderRadius: '6px',
              overflow: 'hidden', border: 'none', cursor: 'pointer',
              padding: 0,
              outline: i === active ? '2.5px solid #e8c547' : '2.5px solid transparent',
              outlineOffset: '1px',
              transition: 'outline-color 0.15s',
            }}>
              <Image src={img} alt="" fill style={{ objectFit: 'cover' }} sizes="15vw" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: lightboxVisible ? 1 : 0,
            transition: 'opacity 0.25s ease',
          }}
        >
          {/* Close */}
          <button
            aria-label="Bezárás"
            onClick={e => { e.stopPropagation(); closeLightbox() }}
            style={{ ...btnStyle, position: 'absolute', top: '1.25rem', right: '1.25rem', width: '48px', height: '48px', zIndex: 1 }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.24)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.13)')}
          ><X size={22} /></button>

          {/* Left arrow */}
          {images.length > 1 && (
            <button
              aria-label="Előző kép"
              onClick={e => { e.stopPropagation(); prev() }}
              style={{ ...btnStyle, position: 'absolute', left: '1.25rem', width: '52px', height: '52px', zIndex: 1 }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.24)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.13)')}
            ><ChevronLeft size={30} /></button>
          )}

          {/* Right arrow */}
          {images.length > 1 && (
            <button
              aria-label="Következő kép"
              onClick={e => { e.stopPropagation(); next() }}
              style={{ ...btnStyle, position: 'absolute', right: '1.25rem', width: '52px', height: '52px', zIndex: 1 }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.24)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.13)')}
            ><ChevronRight size={30} /></button>
          )}

          {/* Counter */}
          {images.length > 1 && (
            <div style={{
              position: 'absolute', bottom: '1.5rem',
              fontSize: '13px', fontWeight: 500,
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: '0.04em', userSelect: 'none',
            }}>
              {active + 1} / {images.length}
            </div>
          )}

          {/* Image — scale + fade on open */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: 'min(88vw, 1100px)',
              aspectRatio: '4/3',
              transform: lightboxVisible ? 'scale(1)' : 'scale(0.95)',
              opacity: lightboxVisible ? 1 : 0,
              transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.25s ease',
            }}
          >
            <Image
              src={images[active]}
              alt={alt}
              fill
              style={{ objectFit: 'contain' }}
              sizes="88vw"
            />
          </div>
        </div>
      )}
    </>
  )
}
