'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function BikeGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0)

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
    <div>
      {/* Main image */}
      <div style={{
        position: 'relative', aspectRatio: '4/3',
        background: '#f5f5f5', borderRadius: '10px',
        overflow: 'hidden', marginBottom: '10px',
      }}>
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
    </div>
  )
}
