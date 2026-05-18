'use client'
import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

export default function BikeGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  if (!images?.length) {
    return (
      <div style={{
        aspectRatio: '4/3', background: '#f5f5f5', borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '64px', color: 'rgba(0,0,0,0.12)',
      }}>🚲</div>
    )
  }

  return (
    <>
      {/* Main image */}
      <div
        onClick={() => setLightbox(true)}
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
              <Image
                src={img}
                alt=""
                fill
                style={{ objectFit: 'cover' }}
                sizes="15vw"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setLightbox(false)}
            style={{
              position: 'absolute', top: '1.25rem', right: '1.25rem',
              background: 'rgba(255,255,255,0.12)',
              border: 'none', cursor: 'pointer',
              borderRadius: '50%', width: '48px', height: '48px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#ffffff', zIndex: 1,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
          >
            <X size={22} />
          </button>

          {/* Image container — stops click from bubbling to overlay */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: 'min(92vw, 1100px)',
              aspectRatio: '4/3',
            }}
          >
            <Image
              src={images[active]}
              alt={alt}
              fill
              style={{ objectFit: 'contain' }}
              sizes="92vw"
            />
          </div>
        </div>
      )}
    </>
  )
}
