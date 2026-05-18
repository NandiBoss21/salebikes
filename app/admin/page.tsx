'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { Bike } from '@/lib/supabase'
import { Plus, Trash2, Edit, Eye, EyeOff, Star, Upload, X, LogOut, Check, ShoppingBag } from 'lucide-react'

const CATEGORIES = [
  { key: 'ebike', label: 'Ebike' },
  { key: 'mtb', label: 'MTB / Mountain Bike' },
  { key: 'trekking', label: 'Trekking / Városi' },
  { key: 'gravel', label: 'Gravel' },
  { key: 'gyerek', label: 'Gyerek' },
  { key: 'orszaguti', label: 'Országúti / Verseny' },
  { key: 'kemping', label: 'Kemping' },
  { key: 'alkatreszek', label: 'Alkatrészek' },
  { key: 'ruhazat', label: 'Ruházat' },
]

const BRANDS = ['Cube', 'Scott', 'Bulls', 'Giant', 'KTM', 'Merida', 'Corratec', 'Genesis', 'Focus', 'Brennabor', 'Hercules', 'Kalkhoff', 'Egyéb']

const empty: Partial<Bike> = {
  brand: '', model: '', category: 'trekking', condition: 'outlet',
  original_price: 0, sale_price: 0, description: '',
  specs: [], images: [], available: true, featured: false, sold: false,
  size: '', year: new Date().getFullYear(), color: '',
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [bikes, setBikes] = useState<Bike[]>([])
  const [form, setForm] = useState<Partial<Bike>>({ ...empty })
  const [editing, setEditing] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [specInput, setSpecInput] = useState('')
  const [toast, setToast] = useState('')
  const [view, setView] = useState<'list' | 'form'>('list')
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (authed) loadBikes()
  }, [authed])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function loadBikes() {
    const { data } = await supabase.from('bikes').select('*').order('created_at', { ascending: false })
    setBikes((data || []) as Bike[])
  }

  async function compressImage(file: File): Promise<Blob> {
    return new Promise((resolve) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        const MAX = 2400
        let { width, height } = img
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round(height * MAX / width); width = MAX }
          else { width = Math.round(width * MAX / height); height = MAX }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width; canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)
        URL.revokeObjectURL(url)
        canvas.toBlob(blob => resolve(blob!), 'image/jpeg', 0.88)
      }
      img.src = url
    })
  }

  async function uploadImages(files: FileList) {
    setUploading(true)
    const urls: string[] = []
    for (const file of Array.from(files)) {
      const compressed = await compressImage(file)
      const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
      const { error } = await supabase.storage.from('bike-images').upload(name, compressed, {
        cacheControl: '3600', upsert: false, contentType: 'image/jpeg',
      })
      if (!error) {
        const { data } = supabase.storage.from('bike-images').getPublicUrl(name)
        urls.push(data.publicUrl)
      }
    }
    setForm(f => ({ ...f, images: [...(f.images || []), ...urls] }))
    setUploading(false)
    showToast(`${urls.length} kép feltöltve`)
  }

  async function save() {
    if (!form.brand || !form.model || !form.sale_price) {
      showToast('Márka, modell és ár kötelező!')
      return
    }
    setSaving(true)
    if (editing) {
      await supabase.from('bikes').update(form).eq('id', editing)
      showToast('Kerékpár frissítve')
    } else {
      await supabase.from('bikes').insert(form)
      showToast('Kerékpár hozzáadva')
    }
    setSaving(false)
    setForm({ ...empty })
    setEditing(null)
    setView('list')
    loadBikes()
  }

  async function deleteBike(id: string) {
    if (!confirm('Biztosan törlöd ezt a kerékpárt?')) return
    await supabase.from('bikes').delete().eq('id', id)
    showToast('Kerékpár törölve')
    loadBikes()
  }

  async function toggleField(id: string, field: 'available' | 'featured', val: boolean) {
    await supabase.from('bikes').update({ [field]: !val }).eq('id', id)
    loadBikes()
  }

  async function toggleSold(id: string, val: boolean) {
    await supabase.from('bikes').update({ sold: !val }).eq('id', id)
    loadBikes()
  }

  function editBike(bike: Bike) {
    setForm({ ...bike })
    setEditing(bike.id)
    setView('form')
    window.scrollTo(0, 0)
  }

  function newBike() {
    setForm({ ...empty })
    setEditing(null)
    setView('form')
    window.scrollTo(0, 0)
  }

  function addSpec() {
    if (!specInput.trim()) return
    setForm(f => ({ ...f, specs: [...(f.specs || []), specInput.trim()] }))
    setSpecInput('')
  }

  function removeSpec(i: number) {
    setForm(f => ({ ...f, specs: f.specs?.filter((_, idx) => idx !== i) }))
  }

  function removeImage(i: number) {
    setForm(f => ({ ...f, images: f.images?.filter((_, idx) => idx !== i) }))
  }

  function onDragStart(i: number) { setDragIdx(i) }
  function onDragOver(e: React.DragEvent, i: number) {
    e.preventDefault()
    if (dragIdx === null || dragIdx === i) return
    setForm(f => {
      const imgs = [...(f.images || [])]
      const [moved] = imgs.splice(dragIdx, 1)
      imgs.splice(i, 0, moved)
      setDragIdx(i)
      return { ...f, images: imgs }
    })
  }
  function onDragEnd() { setDragIdx(null) }

  // Stats
  const totalBikes = bikes.length
  const availableBikes = bikes.filter(b => b.available && !b.sold).length
  const soldBikes = bikes.filter(b => b.sold).length
  const avgSavings = bikes.length > 0
    ? Math.round(bikes.reduce((sum, b) => sum + Math.max(0, b.original_price - b.sale_price), 0) / bikes.length)
    : 0

  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', background: '#fafaf8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        <div style={{
          background: '#ffffff', border: '1px solid #E8E4DC',
          borderRadius: '12px', padding: '2.5rem', width: '360px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            fontWeight: 900, fontSize: '22px',
            letterSpacing: '-0.04em',
            marginBottom: '1.75rem', textAlign: 'center', color: '#111111',
          }}>
            Bringabarát <span style={{ color: '#e8c547' }}>Admin</span>
          </div>

          <label style={labelStyle}>Jelszó</label>
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && pw === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'salebikes2024') && setAuthed(true)}
            style={inputStyle}
            placeholder="••••••••"
          />
          <button
            onClick={() => pw === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'salebikes2024') && setAuthed(true)}
            style={{
              width: '100%', padding: '13px',
              background: '#111111', color: '#ffffff',
              border: 'none', borderRadius: '8px', cursor: 'pointer',
              fontWeight: 700, fontSize: '14px', letterSpacing: '-0.01em',
              marginTop: '0.75rem',
            }}
          >Belépés</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#fafaf8', paddingBottom: '4rem',
      fontFamily: 'Inter, system-ui, sans-serif', color: '#111111',
    }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1rem', right: '1rem',
          background: '#111111', color: '#ffffff',
          padding: '12px 20px', borderRadius: '8px',
          fontWeight: 600, fontSize: '14px', zIndex: 999,
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        }}>{toast}</div>
      )}

      {/* Admin nav */}
      <div style={{
        background: '#ffffff', borderBottom: '1px solid #E8E4DC',
        padding: '1rem 2rem', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ fontWeight: 900, fontSize: '18px', letterSpacing: '-0.04em', color: '#111111' }}>
          Bringabarát <span style={{ color: '#e8c547' }}>·</span>{' '}
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(17,17,17,0.4)', letterSpacing: 0 }}>Admin</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {view === 'list' ? (
            <button onClick={newBike} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: '#111111', color: '#ffffff',
              border: 'none', padding: '10px 18px', borderRadius: '8px',
              fontWeight: 700, fontSize: '13px', cursor: 'pointer',
              letterSpacing: '-0.01em',
            }}>
              <Plus size={15} /> Új kerékpár
            </button>
          ) : (
            <button onClick={() => { setView('list'); setEditing(null); setForm({ ...empty }) }} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'transparent', color: '#111111',
              border: '1px solid #E8E4DC', padding: '10px 18px',
              borderRadius: '8px', cursor: 'pointer',
              fontWeight: 600, fontSize: '13px',
            }}>
              ← Vissza
            </button>
          )}
          <button onClick={() => setAuthed(false)} style={{
            background: 'none', border: 'none',
            color: 'rgba(17,17,17,0.4)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '5px',
            fontSize: '13px', padding: '8px',
          }}>
            <LogOut size={15} /> Kilépés
          </button>
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Stats bar — list view only */}
        {view === 'list' && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem', marginBottom: '2rem',
          }}>
            {[
              { label: 'Összes', value: totalBikes, unit: 'db' },
              { label: 'Elérhető', value: availableBikes, unit: 'db' },
              { label: 'Eladott', value: soldBikes, unit: 'db' },
              { label: 'Átl. megtakarítás', value: avgSavings.toLocaleString('hu-HU'), unit: 'Ft' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: '#ffffff', border: '1px solid #E8E4DC',
                borderRadius: '12px', padding: '1.25rem 1.5rem',
              }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(17,17,17,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.04em', color: '#111111', lineHeight: 1 }}>
                  {stat.value} <span style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(17,17,17,0.4)' }}>{stat.unit}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FORM VIEW */}
        {view === 'form' && (
          <div>
            <h2 style={{
              fontWeight: 800, fontSize: '1.6rem',
              letterSpacing: '-0.04em', marginBottom: '2rem', color: '#111111',
            }}>{editing ? 'Kerékpár szerkesztése' : 'Új kerékpár hozzáadása'}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

              {/* LEFT */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                <div>
                  <label style={labelStyle}>Márka</label>
                  <select value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} style={inputStyle}>
                    <option value="">Válassz márkát...</option>
                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Modell neve *</label>
                  <input value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} style={inputStyle} placeholder='pl. Hyde Race 28"' />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Kategória</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Bike['category'] }))} style={inputStyle}>
                      {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Állapot</label>
                    <select value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value as 'outlet' | 'hasznalt' }))} style={inputStyle}>
                      <option value="outlet">Outlet / Bemutató (Új)</option>
                      <option value="hasznalt">Használt</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Bolti ár (Ft) *</label>
                    <input type="number" value={form.original_price || ''} onChange={e => setForm(f => ({ ...f, original_price: parseInt(e.target.value) || 0 }))} style={inputStyle} placeholder="499990" />
                  </div>
                  <div>
                    <label style={labelStyle}>Eladási ár (Ft) *</label>
                    <input type="number" value={form.sale_price || ''} onChange={e => setForm(f => ({ ...f, sale_price: parseInt(e.target.value) || 0 }))} style={inputStyle} placeholder="320000" />
                  </div>
                </div>

                {form.original_price && form.sale_price && form.original_price > form.sale_price && (
                  <div style={{
                    background: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.3)',
                    borderRadius: '8px', padding: '10px 14px',
                    fontSize: '13px', color: '#111111', fontWeight: 600,
                  }}>
                    Megtakarítás: {(form.original_price - form.sale_price).toLocaleString('hu-HU')} Ft
                    <span style={{ color: 'rgba(17,17,17,0.5)', fontWeight: 400 }}> ({Math.round((1 - form.sale_price / form.original_price) * 100)}% kedvezmény)</span>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Méret</label>
                    <input value={form.size || ''} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} style={inputStyle} placeholder="L, 54cm..." />
                  </div>
                  <div>
                    <label style={labelStyle}>Év</label>
                    <input type="number" value={form.year || ''} onChange={e => setForm(f => ({ ...f, year: parseInt(e.target.value) }))} style={inputStyle} placeholder="2024" />
                  </div>
                  <div>
                    <label style={labelStyle}>Szín</label>
                    <input value={form.color || ''} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} style={inputStyle} placeholder="Fekete" />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Leírás</label>
                  <textarea
                    value={form.description || ''}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                    placeholder="Rövid leírás a kerékpárról..."
                  />
                </div>

                {/* Specs */}
                <div>
                  <label style={labelStyle}>Komponensek / Specifikációk</label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      value={specInput}
                      onChange={e => setSpecInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addSpec()}
                      style={{ ...inputStyle, flex: 1 }}
                      placeholder="pl. Shimano XT, Gates szíj, Bosch CX..."
                    />
                    <button onClick={addSpec} style={{
                      background: '#111111', color: '#ffffff',
                      border: 'none', padding: '0 16px', borderRadius: '8px',
                      cursor: 'pointer', fontWeight: 700, fontSize: '18px',
                    }}>+</button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {form.specs?.map((sp, i) => (
                      <span key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        fontSize: '12px', padding: '5px 10px',
                        background: '#f5f5f5', border: '1px solid #E8E4DC',
                        borderRadius: '6px', color: '#111111',
                      }}>
                        {sp}
                        <button onClick={() => removeSpec(i)} style={{
                          background: 'none', border: 'none',
                          cursor: 'pointer', color: 'rgba(17,17,17,0.4)', padding: '0 2px',
                          display: 'flex', alignItems: 'center',
                        }}><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Elérhető', field: 'available' as keyof Bike },
                    { label: 'Kiemelt', field: 'featured' as keyof Bike },
                    { label: 'Eladott', field: 'sold' as keyof Bike },
                  ].map(({ label, field }) => (
                    <button
                      key={field}
                      onClick={() => setForm(f => ({ ...f, [field]: !f[field] }))}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '7px',
                        padding: '10px 16px', borderRadius: '8px', cursor: 'pointer',
                        fontWeight: 600, fontSize: '13px',
                        border: '1px solid',
                        transition: 'all 0.15s',
                        ...(form[field]
                          ? field === 'sold'
                            ? { background: 'rgba(220,38,38,0.08)', borderColor: '#dc2626', color: '#dc2626' }
                            : { background: 'rgba(232,197,71,0.1)', borderColor: '#e8c547', color: '#111111' }
                          : { background: '#ffffff', borderColor: '#E8E4DC', color: 'rgba(17,17,17,0.4)' }
                        ),
                      }}
                    >
                      <Check size={13} /> {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* RIGHT – Images */}
              <div>
                <label style={labelStyle}>Képek</label>

                <div
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: '2px dashed #E8E4DC',
                    borderRadius: '12px', padding: '2rem',
                    textAlign: 'center', cursor: 'pointer',
                    marginBottom: '1rem',
                    background: '#ffffff',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#111111')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#E8E4DC')}
                >
                  <Upload size={28} style={{ color: '#111111', margin: '0 auto 10px', display: 'block' }} />
                  <div style={{ fontSize: '14px', color: '#111111', fontWeight: 500, marginBottom: '4px' }}>
                    {uploading ? 'Feltöltés...' : 'Kattints a képek feltöltéséhez'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(17,17,17,0.4)' }}>
                    JPG, PNG · Húzással átrendezhető a sorrend
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => e.target.files && uploadImages(e.target.files)}
                  />
                </div>

                {/* Image grid — drag & drop */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                }}>
                  {form.images?.map((url, i) => (
                    <div
                      key={url}
                      draggable
                      onDragStart={() => onDragStart(i)}
                      onDragOver={e => onDragOver(e, i)}
                      onDragEnd={onDragEnd}
                      style={{
                        position: 'relative', aspectRatio: '4/3',
                        cursor: 'grab', borderRadius: '8px', overflow: 'hidden',
                        border: dragIdx === i ? '2px solid #e8c547' : '2px solid transparent',
                        transition: 'border-color 0.15s, opacity 0.15s',
                        opacity: dragIdx !== null && dragIdx !== i ? 0.7 : 1,
                      }}
                    >
                      <img src={url} alt="" style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                      }} />
                      {i === 0 && (
                        <span style={{
                          position: 'absolute', top: '7px', left: '7px',
                          background: '#e8c547', color: '#111111',
                          fontSize: '10px', fontWeight: 700,
                          padding: '3px 8px', borderRadius: '5px',
                          textTransform: 'uppercase', letterSpacing: '0.04em',
                        }}>Főkép</span>
                      )}
                      <button
                        onClick={() => removeImage(i)}
                        style={{
                          position: 'absolute', top: '7px', right: '7px',
                          background: 'rgba(0,0,0,0.6)', color: '#fff',
                          border: 'none', borderRadius: '50%',
                          width: '24px', height: '24px',
                          cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                        }}
                      ><X size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Save button */}
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button onClick={save} disabled={saving} style={{
                background: '#111111', color: '#ffffff',
                border: 'none', padding: '14px 32px', borderRadius: '8px',
                fontWeight: 700, fontSize: '14px', letterSpacing: '-0.01em',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1,
              }}>
                {saving ? 'Mentés...' : editing ? 'Módosítások mentése' : 'Kerékpár hozzáadása'}
              </button>
              <button onClick={() => { setView('list'); setEditing(null); setForm({ ...empty }) }} style={{
                background: 'transparent', color: '#111111',
                border: '1px solid #E8E4DC', padding: '14px 24px', borderRadius: '8px',
                fontWeight: 600, fontSize: '14px', cursor: 'pointer',
              }}>
                Mégse
              </button>
            </div>
          </div>
        )}

        {/* LIST VIEW */}
        {view === 'list' && (
          <div>
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: '1.25rem',
            }}>
              <h2 style={{
                fontWeight: 800, fontSize: '1.5rem',
                letterSpacing: '-0.04em', color: '#111111',
              }}>Kerékpárok <span style={{ color: 'rgba(17,17,17,0.3)', fontWeight: 500 }}>({bikes.length})</span></h2>
            </div>

            {bikes.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '5rem',
                background: '#ffffff', border: '1px solid #E8E4DC',
                borderRadius: '12px',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🚲</div>
                <div style={{ fontSize: '15px', color: 'rgba(17,17,17,0.5)', marginBottom: '1.5rem' }}>Még nincs kerékpár feltöltve.</div>
                <button onClick={newBike} style={{
                  background: '#111111', color: '#ffffff',
                  border: 'none', padding: '12px 24px', borderRadius: '8px',
                  cursor: 'pointer', fontWeight: 700, fontSize: '14px',
                }}>+ Első kerékpár hozzáadása</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {bikes.map(bike => (
                  <div key={bike.id} style={{
                    background: '#ffffff', border: '1px solid #E8E4DC',
                    borderRadius: '12px', padding: '1rem 1.25rem',
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    opacity: bike.sold ? 0.6 : 1,
                    transition: 'opacity 0.2s',
                  }}>
                    {/* Thumb */}
                    <div style={{
                      width: '72px', height: '54px', flexShrink: 0,
                      background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden',
                      position: 'relative',
                    }}>
                      {bike.images?.[0] && (
                        <img src={bike.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                      {bike.sold && (
                        <div style={{
                          position: 'absolute', inset: 0, background: 'rgba(220,38,38,0.75)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '8px', fontWeight: 800, color: '#fff',
                          letterSpacing: '0.06em', textTransform: 'uppercase',
                        }}>ELADVA</div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#e8c547', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>{bike.brand}</div>
                      <div style={{
                        fontWeight: 700, fontSize: '0.95rem',
                        color: '#111111', whiteSpace: 'nowrap',
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        textDecoration: bike.sold ? 'line-through' : 'none',
                        letterSpacing: '-0.02em',
                      }}>{bike.model}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(17,17,17,0.4)', marginTop: '2px' }}>
                        {bike.condition === 'outlet' ? 'Outlet' : 'Használt'} · {CATEGORIES.find(c => c.key === bike.category)?.label}
                        {bike.sold && <span style={{ color: '#dc2626', fontWeight: 600, marginLeft: '6px' }}>· ELADVA</span>}
                      </div>
                    </div>

                    {/* Price */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '11px', color: 'rgba(17,17,17,0.35)', textDecoration: 'line-through', marginBottom: '2px' }}>
                        {bike.original_price.toLocaleString('hu-HU')} Ft
                      </div>
                      <div style={{
                        fontWeight: 800, fontSize: '1rem',
                        color: '#111111', letterSpacing: '-0.03em',
                      }}>{bike.sale_price.toLocaleString('hu-HU')} Ft</div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                      <button
                        onClick={() => toggleField(bike.id, 'available', bike.available)}
                        title={bike.available ? 'Elrejtés' : 'Megjelenítés'}
                        style={iconBtn(bike.available ? '#059669' : 'rgba(17,17,17,0.25)')}
                      >
                        {bike.available ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button
                        onClick={() => toggleField(bike.id, 'featured', bike.featured)}
                        title={bike.featured ? 'Kiemelt törlés' : 'Kiemelés'}
                        style={iconBtn(bike.featured ? '#e8c547' : 'rgba(17,17,17,0.25)')}
                      >
                        <Star size={16} fill={bike.featured ? '#e8c547' : 'none'} />
                      </button>
                      <button
                        onClick={() => toggleSold(bike.id, !!bike.sold)}
                        title={bike.sold ? 'Eladott jelölés visszavon' : 'Eladottnak jelöl'}
                        style={iconBtn(bike.sold ? '#dc2626' : 'rgba(17,17,17,0.25)')}
                      >
                        <ShoppingBag size={16} />
                      </button>
                      <button onClick={() => editBike(bike)} title="Szerkesztés" style={iconBtn('rgba(17,17,17,0.5)')}>
                        <Edit size={16} />
                      </button>
                      <button onClick={() => deleteBike(bike.id)} title="Törlés" style={iconBtn('#dc2626')}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px', fontWeight: 600,
  letterSpacing: '0.08em', textTransform: 'uppercase',
  color: 'rgba(17,17,17,0.45)',
  marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px',
  background: '#ffffff',
  border: '1px solid #E8E4DC',
  borderRadius: '8px', color: '#111111',
  fontSize: '14px', outline: 'none',
  fontFamily: 'Inter, system-ui, sans-serif',
  marginBottom: '0',
}

function iconBtn(color: string): React.CSSProperties {
  return {
    background: 'none', border: 'none',
    color, cursor: 'pointer', padding: '7px',
    display: 'flex', alignItems: 'center',
    borderRadius: '6px',
    transition: 'background 0.12s',
  }
}
