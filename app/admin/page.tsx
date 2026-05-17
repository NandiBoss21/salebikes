'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { Bike } from '@/lib/supabase'
import { Plus, Trash2, Edit, Eye, EyeOff, Star, Upload, X, LogOut, Check } from 'lucide-react'

const CATEGORIES = [
  { key: 'ebike', label: 'Ebike' },
  { key: 'mtb', label: 'MTB / Mountain Bike' },
  { key: 'trekking', label: 'Trekking / Városi' },
  { key: 'gravel', label: 'Gravel' },
  { key: 'gyerek', label: 'Gyerek' },
  { key: 'orszaguti', label: 'Országúti / Verseny' },
  { key: 'kemping', label: 'Kemping' },
]

const BRANDS = ['Cube', 'Scott', 'Bulls', 'Giant', 'KTM', 'Merida', 'Corratec', 'Genesis', 'Focus', 'Brennabor', 'Hercules', 'Kalkhoff', 'Egyéb']

const empty: Partial<Bike> = {
  brand: '', model: '', category: 'trekking', condition: 'outlet',
  original_price: 0, sale_price: 0, description: '',
  specs: [], images: [], available: true, featured: false,
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
        canvas.width = width
        canvas.height = height
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
      showToast('⚠️ Márka, modell és ár kötelező!')
      return
    }
    setSaving(true)
    if (editing) {
      await supabase.from('bikes').update(form).eq('id', editing)
      showToast('✓ Kerékpár frissítve')
    } else {
      await supabase.from('bikes').insert(form)
      showToast('✓ Kerékpár hozzáadva')
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

  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0a0a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          background: '#111', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '4px', padding: '2.5rem', width: '360px',
        }}>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900, fontSize: '24px',
            textTransform: 'uppercase', marginBottom: '1.5rem',
            textAlign: 'center',
          }}>Sale<span style={{ color: '#e8c547' }}>Bikes</span> Admin</div>

          <label style={{ fontSize: '12px', color: 'rgba(240,237,232,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Jelszó</label>
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && pw === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'salebikes2024') && setAuthed(true)}
            style={{
              width: '100%', padding: '12px', marginTop: '8px',
              background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '2px', color: '#f0ede8', fontSize: '16px',
              outline: 'none', marginBottom: '1rem',
            }}
            placeholder="••••••••"
          />
          <button
            onClick={() => pw === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'salebikes2024') && setAuthed(true)}
            style={{
              width: '100%', padding: '12px',
              background: '#e8c547', color: '#0a0a0a',
              border: 'none', borderRadius: '2px', cursor: 'pointer',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700, fontSize: '15px',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}
          >Belépés</button>
        </div>
      </div>
    )
  }

  const s = (x: React.CSSProperties): React.CSSProperties => x

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', paddingBottom: '4rem' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1rem', right: '1rem',
          background: '#e8c547', color: '#0a0a0a',
          padding: '12px 20px', borderRadius: '4px',
          fontWeight: 600, fontSize: '14px', zIndex: 999,
        }}>{toast}</div>
      )}

      {/* Admin nav */}
      <div style={{
        background: '#111', borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '1rem 2rem', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 900, fontSize: '20px',
          textTransform: 'uppercase',
        }}>Sale<span style={{ color: '#e8c547' }}>Bikes</span>
          <span style={{ fontSize: '13px', fontWeight: 400, color: 'rgba(240,237,232,0.4)', marginLeft: '12px' }}>Admin</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {view === 'list' ? (
            <button onClick={newBike} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: '#e8c547', color: '#0a0a0a',
              border: 'none', padding: '10px 18px', borderRadius: '2px',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700, fontSize: '14px',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: 'pointer',
            }}>
              <Plus size={16} /> Új kerékpár
            </button>
          ) : (
            <button onClick={() => { setView('list'); setEditing(null); setForm({ ...empty }) }} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'transparent', color: 'rgba(240,237,232,0.7)',
              border: '1px solid rgba(255,255,255,0.2)', padding: '10px 18px',
              borderRadius: '2px', cursor: 'pointer',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 600, fontSize: '14px',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              ← Vissza
            </button>
          )}
          <button onClick={() => setAuthed(false)} style={{
            background: 'none', border: 'none',
            color: 'rgba(240,237,232,0.4)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '13px',
          }}>
            <LogOut size={16} /> Kilépés
          </button>
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>

        {/* FORM VIEW */}
        {view === 'form' && (
          <div>
            <h2 style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700, fontSize: '1.8rem',
              textTransform: 'uppercase', marginBottom: '2rem',
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
                  <input value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} style={inputStyle} placeholder="pl. Hyde Race 28&quot;" />
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
                    background: 'rgba(232,197,71,0.1)', border: '1px solid rgba(232,197,71,0.3)',
                    borderRadius: '4px', padding: '10px 14px',
                    fontSize: '13px', color: '#e8c547',
                  }}>
                    Megtakarítás: {(form.original_price - form.sale_price).toLocaleString('hu-HU')} Ft
                    ({Math.round((1 - form.sale_price / form.original_price) * 100)}% kedvezmény)
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
                      style={{ ...inputStyle, flex: 1, margin: 0 }}
                      placeholder="pl. Shimano XT, Gates szíj, Bosch CX..."
                    />
                    <button onClick={addSpec} style={{
                      background: '#e8c547', color: '#0a0a0a',
                      border: 'none', padding: '0 16px', borderRadius: '2px',
                      cursor: 'pointer', fontWeight: 700, fontSize: '18px',
                    }}>+</button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {form.specs?.map((s, i) => (
                      <span key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        fontSize: '11px', padding: '4px 8px',
                        background: 'rgba(232,197,71,0.15)',
                        border: '1px solid rgba(232,197,71,0.3)',
                        borderRadius: '2px', color: '#e8c547',
                      }}>
                        {s}
                        <button onClick={() => removeSpec(i)} style={{
                          background: 'none', border: 'none',
                          cursor: 'pointer', color: '#e8c547', padding: '0 2px',
                        }}><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {[
                    { label: 'Elérhető', field: 'available' as keyof Bike },
                    { label: 'Kiemelt', field: 'featured' as keyof Bike },
                  ].map(({ label, field }) => (
                    <button
                      key={field}
                      onClick={() => setForm(f => ({ ...f, [field]: !f[field] }))}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 16px', borderRadius: '2px', cursor: 'pointer',
                        fontFamily: 'Barlow Condensed, sans-serif',
                        fontWeight: 600, fontSize: '13px',
                        letterSpacing: '0.05em', textTransform: 'uppercase',
                        border: '1px solid',
                        ...(form[field]
                          ? { background: 'rgba(232,197,71,0.15)', borderColor: '#e8c547', color: '#e8c547' }
                          : { background: 'transparent', borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(240,237,232,0.4)' }
                        ),
                      }}
                    >
                      <Check size={14} /> {label}
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
                    border: '2px dashed rgba(232,197,71,0.3)',
                    borderRadius: '4px', padding: '2rem',
                    textAlign: 'center', cursor: 'pointer',
                    marginBottom: '1rem',
                    background: 'rgba(232,197,71,0.03)',
                    transition: 'all 0.15s',
                  }}
                >
                  <Upload size={32} style={{ color: '#e8c547', margin: '0 auto 12px' }} />
                  <div style={{ fontSize: '14px', color: 'rgba(240,237,232,0.6)', marginBottom: '4px' }}>
                    {uploading ? 'Feltöltés...' : 'Kattints a képek feltöltéséhez'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(240,237,232,0.3)' }}>
                    JPG, PNG – eredeti minőségben tároljuk
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

                {/* Image grid */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                }}>
                  {form.images?.map((url, i) => (
                    <div key={i} style={{ position: 'relative', aspectRatio: '4/3' }}>
                      <img src={url} alt="" style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        borderRadius: '2px',
                      }} />
                      {i === 0 && (
                        <span style={{
                          position: 'absolute', top: '6px', left: '6px',
                          background: '#e8c547', color: '#0a0a0a',
                          fontSize: '10px', fontWeight: 700,
                          padding: '2px 6px', borderRadius: '2px',
                          textTransform: 'uppercase', letterSpacing: '0.05em',
                        }}>Főkép</span>
                      )}
                      <button
                        onClick={() => removeImage(i)}
                        style={{
                          position: 'absolute', top: '6px', right: '6px',
                          background: 'rgba(0,0,0,0.7)', color: '#fff',
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
                background: '#e8c547', color: '#0a0a0a',
                border: 'none', padding: '14px 32px', borderRadius: '2px',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700, fontSize: '16px',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
              }}>
                {saving ? 'Mentés...' : editing ? 'Módosítások mentése' : 'Kerékpár hozzáadása'}
              </button>
            </div>
          </div>
        )}

        {/* LIST VIEW */}
        {view === 'list' && (
          <div>
            <div style={{
              display: 'flex', alignItems: 'baseline',
              justifyContent: 'space-between', marginBottom: '1.5rem',
            }}>
              <h2 style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700, fontSize: '1.8rem',
                textTransform: 'uppercase',
              }}>Kerékpárok ({bikes.length})</h2>
            </div>

            {bikes.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '4rem',
                color: 'rgba(240,237,232,0.3)',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🚲</div>
                <div>Még nincs kerékpár feltöltve.</div>
                <button onClick={newBike} style={{
                  marginTop: '1rem', background: '#e8c547', color: '#0a0a0a',
                  border: 'none', padding: '12px 24px', borderRadius: '2px',
                  cursor: 'pointer', fontWeight: 700,
                }}>+ Első kerékpár hozzáadása</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
                {bikes.map(bike => (
                  <div key={bike.id} style={{
                    background: '#111', padding: '1rem 1.25rem',
                    display: 'flex', alignItems: 'center', gap: '1rem',
                  }}>
                    {/* Thumb */}
                    <div style={{
                      width: '72px', height: '54px', flexShrink: 0,
                      background: '#1a1a1a', borderRadius: '2px', overflow: 'hidden',
                    }}>
                      {bike.images?.[0] && (
                        <img src={bike.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '11px', color: '#e8c547', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{bike.brand}</div>
                      <div style={{
                        fontFamily: 'Barlow Condensed, sans-serif',
                        fontWeight: 700, fontSize: '1.05rem',
                        textTransform: 'uppercase', whiteSpace: 'nowrap',
                        overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>{bike.model}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(240,237,232,0.4)' }}>
                        {bike.condition === 'outlet' ? 'Outlet' : 'Használt'} · {CATEGORIES.find(c => c.key === bike.category)?.label}
                      </div>
                    </div>

                    {/* Price */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '11px', color: 'rgba(240,237,232,0.35)', textDecoration: 'line-through' }}>
                        {bike.original_price.toLocaleString('hu-HU')} Ft
                      </div>
                      <div style={{
                        fontFamily: 'Barlow Condensed, sans-serif',
                        fontWeight: 700, fontSize: '1.1rem',
                      }}>{bike.sale_price.toLocaleString('hu-HU')} Ft</div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button
                        onClick={() => toggleField(bike.id, 'available', bike.available)}
                        title={bike.available ? 'Elrejtés' : 'Megjelenítés'}
                        style={iconBtn(bike.available ? '#e8c547' : 'rgba(240,237,232,0.3)')}
                      >
                        {bike.available ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button
                        onClick={() => toggleField(bike.id, 'featured', bike.featured)}
                        title={bike.featured ? 'Kiemelt törlés' : 'Kiemelés'}
                        style={iconBtn(bike.featured ? '#e8c547' : 'rgba(240,237,232,0.3)')}
                      >
                        <Star size={16} fill={bike.featured ? '#e8c547' : 'none'} />
                      </button>
                      <button onClick={() => editBike(bike)} title="Szerkesztés" style={iconBtn('rgba(240,237,232,0.6)')}>
                        <Edit size={16} />
                      </button>
                      <button onClick={() => deleteBike(bike.id)} title="Törlés" style={iconBtn('#c0392b')}>
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
  letterSpacing: '0.12em', textTransform: 'uppercase',
  color: 'rgba(240,237,232,0.5)',
  marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px',
  background: '#1a1a1a',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '2px', color: '#f0ede8',
  fontSize: '14px', outline: 'none',
  fontFamily: 'Barlow, sans-serif',
}

function iconBtn(color: string): React.CSSProperties {
  return {
    background: 'none', border: 'none',
    color, cursor: 'pointer', padding: '6px',
    display: 'flex', alignItems: 'center',
    borderRadius: '2px',
  }
}
