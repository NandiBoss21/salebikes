'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import type { Bike } from '@/lib/supabase'
import { Plus, Trash2, Edit, Eye, EyeOff, Star, Upload, X, LogOut, Check, ShoppingBag, BarChart2, Search, GripVertical, Copy, Settings } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

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
  specs: [], images: [], available: true, featured: false, sold: false, condition_detail: 'uj', kilometers: 0,
  size: '', year: new Date().getFullYear(), color: '',
}

type PageViewRow = { created_at: string; bike_id: string | null; referrer: string | null }
type InquiryRow = { id: string; created_at: string; bike_name: string; source: string }

function normalizeReferrer(ref: string | null): string {
  if (!ref) return 'Közvetlen'
  try {
    const host = new URL(ref).hostname.replace('www.', '')
    if (host.includes('google')) return 'Google'
    if (host.includes('facebook') || host.includes('fb.com')) return 'Facebook'
    if (host.includes('instagram')) return 'Instagram'
    if (host.includes('bringapiac')) return 'Bringapiac'
    return host
  } catch { return 'Közvetlen' }
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
  const [view, setView] = useState<'list' | 'form' | 'stats' | 'categories' | 'settings'>('list')
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Agent 4 — Search / Filter / Sort
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  // Agent 5 — Bulk
  const [selected, setSelected] = useState<string[]>([])

  // Agent 6 — Stats
  const [pageViews, setPageViews] = useState<PageViewRow[]>([])
  const [inquiries, setInquiries] = useState<InquiryRow[]>([])
  const [statsLoading, setStatsLoading] = useState(false)

  type Category = { id: string; name: string; slug: string; visible: boolean; display_order: number }
  const [categories, setCategories] = useState<Category[]>([])
  const [catLoading, setCatLoading] = useState(false)
  const [catDragIdx, setCatDragIdx] = useState<number | null>(null)

  const [exportOpen, setExportOpen] = useState(false)
  const exportRef = useRef<HTMLDivElement>(null)
  const [editingPrice, setEditingPrice] = useState<{ id: string; value: string } | null>(null)
  const [flashIds, setFlashIds] = useState<string[]>([])

  type NotifSettings = { newInquiry: boolean; unsoldAfter7: boolean; email: string }
  const [notifSettings, setNotifSettings] = useState<NotifSettings>({ newInquiry: true, unsoldAfter7: false, email: 'ht.bike@hotmail.com' })

  useEffect(() => { if (authed) loadBikes() }, [authed])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bb_admin_notif')
      if (saved) setNotifSettings(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    if (!exportOpen) return
    function handleClick(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [exportOpen])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function loadBikes() {
    const { data } = await supabase.from('bikes').select('*').order('created_at', { ascending: false })
    setBikes((data || []) as Bike[])
  }

  async function loadStats() {
    setStatsLoading(true)
    try {
      const [viewsRes, inqRes] = await Promise.all([
        supabase.from('page_views').select('created_at,bike_id,referrer').order('created_at', { ascending: false }).limit(2000),
        supabase.from('inquiries').select('id,created_at,bike_name,source').order('created_at', { ascending: false }).limit(200),
      ])
      setPageViews((viewsRes.data || []) as PageViewRow[])
      setInquiries((inqRes.data || []) as InquiryRow[])
    } catch {
      showToast('Statisztikák betöltése sikertelen')
    }
    setStatsLoading(false)
  }

  async function loadCategories() {
    setCatLoading(true)
    const { data } = await supabase.from('categories').select('*').order('display_order')
    setCategories((data || []) as Category[])
    setCatLoading(false)
  }

  async function toggleCatVisible(cat: Category) {
    await supabase.from('categories').update({ visible: !cat.visible }).eq('id', cat.id)
    setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, visible: !c.visible } : c))
    showToast(`${cat.name} ${!cat.visible ? 'megjelenítve' : 'elrejtve'}`)
  }

  function onCatDragStart(i: number) { setCatDragIdx(i) }
  function onCatDragOver(e: React.DragEvent, i: number) {
    e.preventDefault()
    if (catDragIdx === null || catDragIdx === i) return
    setCategories(prev => {
      const cats = [...prev]; const [moved] = cats.splice(catDragIdx, 1); cats.splice(i, 0, moved)
      setCatDragIdx(i); return cats
    })
  }
  async function onCatDragEnd() {
    setCatDragIdx(null)
    await Promise.all(categories.map((c, i) =>
      supabase.from('categories').update({ display_order: i + 1 }).eq('id', c.id)
    ))
  }

  async function exportPDF() {
    const { default: jsPDF } = await import('jspdf')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { default: autoTable } = await import('jspdf-autotable') as { default: (doc: any, opts: any) => void }
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Bringabarat - Arlista', 14, 16)
    doc.setFontSize(10)
    doc.text(new Date().toLocaleDateString('hu-HU'), 14, 23)
    const exportBikes = bikes.filter(b => b.available && !b.sold)
    autoTable(doc, {
      head: [['Marka', 'Modell', 'Kategoria', 'Allapot', 'Bolti ar', 'Eladasi ar', 'Megtakaritas']],
      body: exportBikes.map(b => [
        b.brand, b.model,
        CATEGORIES.find(c => c.key === b.category)?.label || b.category,
        b.condition === 'outlet' ? 'Outlet' : 'Hasznalt',
        b.original_price.toLocaleString('hu-HU') + ' Ft',
        b.sale_price.toLocaleString('hu-HU') + ' Ft',
        (b.original_price - b.sale_price).toLocaleString('hu-HU') + ' Ft',
      ]),
      startY: 28,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [232, 197, 71], textColor: [17, 17, 17] },
    })
    doc.save(`bringabarat-arlista-${new Date().toISOString().split('T')[0]}.pdf`)
    setExportOpen(false)
  }

  async function exportExcel() {
    const XLSX = await import('xlsx')
    const exportBikes = bikes.filter(b => b.available && !b.sold)
    const data = exportBikes.map(b => ({
      'Márka': b.brand,
      'Modell': b.model,
      'Kategória': CATEGORIES.find(c => c.key === b.category)?.label || b.category,
      'Állapot': b.condition === 'outlet' ? 'Outlet' : 'Használt',
      'Bolti ár (Ft)': b.original_price,
      'Eladási ár (Ft)': b.sale_price,
      'Megtakarítás (Ft)': b.original_price - b.sale_price,
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Árlista')
    XLSX.writeFile(wb, `bringabarat-arlista-${new Date().toISOString().split('T')[0]}.xlsx`)
    setExportOpen(false)
  }

  function showFlash(id: string) {
    setFlashIds(prev => [...prev, id])
    setTimeout(() => setFlashIds(prev => prev.filter(x => x !== id)), 1200)
  }

  async function savePriceEdit(bikeId: string, currentPrice: number) {
    if (!editingPrice || editingPrice.id !== bikeId) return
    const newPrice = parseInt(editingPrice.value.replace(/\D/g, ''))
    setEditingPrice(null)
    if (!newPrice || newPrice === currentPrice) return
    await supabase.from('bikes').update({ sale_price: newPrice }).eq('id', bikeId)
    setBikes(prev => prev.map(b => b.id === bikeId ? { ...b, sale_price: newPrice } : b))
    showFlash(bikeId)
    showToast('Ár frissítve')
  }

  async function duplicateBike(bike: Bike) {
    const copy: Record<string, unknown> = { ...bike }
    delete copy.id
    delete copy.created_at
    copy.model = `${bike.model} – Másolat`
    copy.available = false; copy.featured = false; copy.sold = false
    const { data } = await supabase.from('bikes').insert(copy).select().single()
    if (data) { await loadBikes(); editBike(data as Bike); showToast('Kerékpár másolva') }
  }

  function saveNotifSettings() {
    localStorage.setItem('bb_admin_notif', JSON.stringify(notifSettings))
    showToast('Beállítások mentve')
  }

  // Filtered + sorted bikes
  const filteredBikes = useMemo(() => {
    let result = [...bikes]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(b =>
        b.brand.toLowerCase().includes(q) || b.model.toLowerCase().includes(q)
      )
    }
    if (filterCat) result = result.filter(b => b.category === filterCat)
    if (sortBy === 'oldest') result.sort((a, b) => a.created_at.localeCompare(b.created_at))
    else if (sortBy === 'price_asc') result.sort((a, b) => a.sale_price - b.sale_price)
    else if (sortBy === 'price_desc') result.sort((a, b) => b.sale_price - a.sale_price)
    else result.sort((a, b) => b.created_at.localeCompare(a.created_at))
    return result
  }, [bikes, search, filterCat, sortBy])

  // Bulk helpers
  function toggleSelect(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }
  function selectAll() {
    setSelected(selected.length === filteredBikes.length ? [] : filteredBikes.map(b => b.id))
  }
  async function bulkHide() {
    await supabase.from('bikes').update({ available: false }).in('id', selected)
    setSelected([]); loadBikes(); showToast(`${selected.length} kerékpár elrejtve`)
  }
  async function bulkShow() {
    await supabase.from('bikes').update({ available: true }).in('id', selected)
    setSelected([]); loadBikes(); showToast(`${selected.length} kerékpár megjelenítve`)
  }
  async function bulkDelete() {
    if (!confirm(`Biztosan törlöd ezt a(z) ${selected.length} kerékpárt?`)) return
    await supabase.from('bikes').delete().in('id', selected)
    setSelected([]); loadBikes(); showToast(`${selected.length} kerékpár törölve`)
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
    if (!form.brand || !form.model || !form.sale_price) { showToast('Márka, modell és ár kötelező!'); return }
    setSaving(true)
    const dataToSave = {
      ...form,
      condition_detail: form.condition_detail || 'uj',
      kilometers: form.kilometers ?? 0,
    }
    if (editing) {
      await supabase.from('bikes').update(dataToSave).eq('id', editing)
      showToast('Kerékpár frissítve')
    } else {
      await supabase.from('bikes').insert(dataToSave)
      showToast('Kerékpár hozzáadva')
    }
    setSaving(false); setForm({ ...empty }); setEditing(null); setView('list'); loadBikes()
  }

  async function deleteBike(id: string) {
    if (!confirm('Biztosan törlöd ezt a kerékpárt?')) return
    await supabase.from('bikes').delete().eq('id', id)
    showToast('Kerékpár törölve'); loadBikes()
  }

  async function toggleField(id: string, field: 'available' | 'featured', val: boolean) {
    await supabase.from('bikes').update({ [field]: !val }).eq('id', id)
    loadBikes()
  }

  async function toggleSold(id: string, val: boolean) {
    await supabase.from('bikes').update({ sold: !val }).eq('id', id)
    loadBikes()
  }

  function editBike(bike: Bike) { setForm({ ...bike }); setEditing(bike.id); setView('form'); window.scrollTo(0, 0) }
  function newBike() { setForm({ ...empty }); setEditing(null); setView('form'); window.scrollTo(0, 0) }
  function addSpec() { if (!specInput.trim()) return; setForm(f => ({ ...f, specs: [...(f.specs || []), specInput.trim()] })); setSpecInput('') }
  function removeSpec(i: number) { setForm(f => ({ ...f, specs: f.specs?.filter((_, idx) => idx !== i) })) }
  function removeImage(i: number) { setForm(f => ({ ...f, images: f.images?.filter((_, idx) => idx !== i) })) }

  function onDragStart(i: number) { setDragIdx(i) }
  function onDragOver(e: React.DragEvent, i: number) {
    e.preventDefault()
    if (dragIdx === null || dragIdx === i) return
    setForm(f => {
      const imgs = [...(f.images || [])]; const [moved] = imgs.splice(dragIdx, 1); imgs.splice(i, 0, moved)
      setDragIdx(i); return { ...f, images: imgs }
    })
  }
  function onDragEnd() { setDragIdx(null) }

  // Stats computed
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const todayViews = pageViews.filter(v => v.created_at >= todayStart).length
  const weekViews = pageViews.filter(v => v.created_at >= weekStart).length

  const topBikes = Object.entries(
    pageViews.filter(v => v.bike_id).reduce((acc, v) => {
      acc[v.bike_id!] = (acc[v.bike_id!] || 0) + 1; return acc
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([bikeId, count]) => ({
    bikeId, count, bike: bikes.find(b => b.id === bikeId),
  }))

  const referrers = Object.entries(
    pageViews.reduce((acc, v) => {
      const key = normalizeReferrer(v.referrer)
      acc[key] = (acc[key] || 0) + 1; return acc
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1])

  const dailyViewsData = (() => {
    const result: { date: string; views: number }[] = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const iso = d.toISOString().split('T')[0]
      result.push({ date: (d.getMonth() + 1) + '.' + d.getDate() + '.', views: pageViews.filter(v => v.created_at.startsWith(iso)).length })
    }
    return result
  })()

  const topBikesBarData = topBikes.map(item => ({
    name: item.bike ? `${item.bike.brand} ${item.bike.model}`.slice(0, 15) : item.bikeId.slice(0, 8),
    views: item.count,
  }))

  const PIE_COLORS = ['#e8c547', '#111111', '#4CAF50', '#2196F3', '#FF5722', '#9C27B0', '#FF9800', '#00BCD4']
  const catPieData = CATEGORIES
    .map(c => ({ name: c.label, value: bikes.filter(b => b.category === c.key && b.available && !b.sold).length }))
    .filter(c => c.value > 0)

  // Admin stats (top bar)
  const totalBikes = bikes.length
  const availableBikes = bikes.filter(b => b.available && !b.sold).length
  const soldBikes = bikes.filter(b => b.sold).length
  const avgSavings = bikes.length > 0
    ? Math.round(bikes.reduce((sum, b) => sum + Math.max(0, b.original_price - b.sale_price), 0) / bikes.length) : 0

  // ─── Login screen ───────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafaf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ background: '#ffffff', border: '1px solid #E8E4DC', borderRadius: '12px', padding: '2.5rem', width: '360px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight: 900, fontSize: '22px', letterSpacing: '-0.04em', marginBottom: '1.75rem', textAlign: 'center', color: '#111111' }}>
            Bringabarát <span style={{ color: '#e8c547' }}>Admin</span>
          </div>
          <label style={labelStyle}>Jelszó</label>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && pw === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'salebikes2024') && setAuthed(true)}
            style={inputStyle} placeholder="••••••••" />
          <button onClick={() => pw === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'salebikes2024') && setAuthed(true)}
            style={{ width: '100%', padding: '13px', background: '#111111', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '14px', letterSpacing: '-0.01em', marginTop: '0.75rem' }}>
            Belépés
          </button>
        </div>
      </div>
    )
  }

  // ─── Main layout ─────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#fafaf8', paddingBottom: '4rem', fontFamily: 'Inter, system-ui, sans-serif', color: '#111111' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '1rem', right: '1rem', background: '#111111', color: '#ffffff', padding: '12px 20px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', zIndex: 999, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>{toast}</div>
      )}

      {/* Nav */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #E8E4DC', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, height: '60px' }}>
        <div style={{ fontWeight: 900, fontSize: '18px', letterSpacing: '-0.04em', color: '#111111' }}>
          Bringabarát <span style={{ color: '#e8c547' }}>·</span>{' '}
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(17,17,17,0.4)', letterSpacing: 0 }}>Admin</span>
        </div>

        {/* Tab buttons */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            { label: 'Kerékpárok', val: 'list' as const, icon: undefined as React.ReactNode },
            { label: 'Statisztikák', val: 'stats' as const, icon: <BarChart2 size={14} /> as React.ReactNode },
            { label: 'Kategóriák', val: 'categories' as const, icon: undefined as React.ReactNode },
            { label: 'Beállítások', val: 'settings' as const, icon: <Settings size={14} /> as React.ReactNode },
          ].map(tab => (
            <button key={tab.val} onClick={() => {
              if (tab.val === 'stats') { setView('stats'); loadStats() }
              else if (tab.val === 'categories') { setView('categories'); loadCategories() }
              else setView(tab.val)
            }}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '7px 14px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: '13px',
                background: view === tab.val ? '#111111' : 'transparent',
                color: view === tab.val ? '#ffffff' : 'rgba(17,17,17,0.5)',
                transition: 'all 0.15s',
              }}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {view === 'list' && (
            <button onClick={newBike} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#111111', color: '#ffffff', border: 'none', padding: '9px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
              <Plus size={15} /> Új kerékpár
            </button>
          )}
          {view === 'form' && (
            <button onClick={() => { setView('list'); setEditing(null); setForm({ ...empty }) }} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', color: '#111111', border: '1px solid #E8E4DC', padding: '9px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
              ← Vissza
            </button>
          )}
          <button onClick={() => setAuthed(false)} style={{ background: 'none', border: 'none', color: 'rgba(17,17,17,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', padding: '8px' }}>
            <LogOut size={15} /> Kilépés
          </button>
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── STATS VIEW ─────────────────────────────────────────── */}
        {view === 'stats' && (
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.04em', marginBottom: '1.5rem' }}>Statisztikák</h2>

            {statsLoading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(17,17,17,0.3)' }}>Betöltés…</div>
            ) : (
              <>
                {/* Stat cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                  {[
                    { label: 'Mai látogatók', value: todayViews },
                    { label: 'Heti látogatók', value: weekViews },
                    { label: 'Összes oldalnézet', value: pageViews.length },
                    { label: 'Összes érdeklődő', value: inquiries.length },
                  ].map(s => (
                    <div key={s.label} style={{ background: '#ffffff', border: '1px solid #E8E4DC', borderRadius: '12px', padding: '1.25rem 1.5rem' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(17,17,17,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>{s.label}</div>
                      <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.04em' }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                {/* Line chart – napi látogatók */}
                <div style={{ background: '#ffffff', border: '1px solid #E8E4DC', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.4)', marginBottom: '1rem' }}>Napi látogatók – elmúlt 30 nap</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={dailyViewsData} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(17,17,17,0.35)' }} tickLine={false} axisLine={false} interval={4} />
                      <YAxis tick={{ fontSize: 10, fill: 'rgba(17,17,17,0.35)' }} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E8E4DC', fontSize: '12px' }} />
                      <Line type="monotone" dataKey="views" stroke="#e8c547" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#e8c547' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                  {/* Top 5 bikes – bar chart */}
                  <div style={{ background: '#ffffff', border: '1px solid #E8E4DC', borderRadius: '12px', padding: '1.25rem' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.4)', marginBottom: '1rem' }}>Top 5 megtekintett kerékpár</div>
                    {topBikesBarData.length === 0 ? (
                      <div style={{ fontSize: '13px', color: 'rgba(17,17,17,0.35)', padding: '1rem 0' }}>Még nincs adat</div>
                    ) : (
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={topBikesBarData} margin={{ top: 4, right: 8, bottom: 48, left: -20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'rgba(17,17,17,0.5)' }} tickLine={false} axisLine={false} angle={-35} textAnchor="end" interval={0} />
                          <YAxis tick={{ fontSize: 10, fill: 'rgba(17,17,17,0.35)' }} tickLine={false} axisLine={false} allowDecimals={false} />
                          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E8E4DC', fontSize: '12px' }} />
                          <Bar dataKey="views" fill="#111111" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Referrers */}
                  <div style={{ background: '#ffffff', border: '1px solid #E8E4DC', borderRadius: '12px', padding: '1.25rem' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.4)', marginBottom: '1rem' }}>Honnan jönnek</div>
                    {referrers.length === 0 ? (
                      <div style={{ fontSize: '13px', color: 'rgba(17,17,17,0.35)', padding: '1rem 0' }}>Még nincs adat</div>
                    ) : referrers.map(([ref, count], i) => {
                      const pct = pageViews.length > 0 ? Math.round(count / pageViews.length * 100) : 0
                      return (
                        <div key={ref} style={{ marginBottom: i < referrers.length - 1 ? '12px' : 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
                            <span>{ref}</span><span style={{ fontWeight: 700 }}>{count} ({pct}%)</span>
                          </div>
                          <div style={{ height: '4px', borderRadius: '2px', background: '#f0ede8', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: '#e8c547', borderRadius: '2px', transition: 'width 0.5s ease' }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Categories pie chart */}
                <div style={{ background: '#ffffff', border: '1px solid #E8E4DC', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.4)', marginBottom: '1rem' }}>Kategória megoszlás</div>
                    {catPieData.length === 0 ? (
                      <div style={{ fontSize: '13px', color: 'rgba(17,17,17,0.35)' }}>Még nincs adat</div>
                    ) : (
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie data={catPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={false}>
                            {catPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E8E4DC', fontSize: '12px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(() => {
                      const total = catPieData.reduce((s, c) => s + c.value, 0)
                      return catPieData.map((item, i) => (
                        <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                          <span style={{ fontSize: '12px', color: 'rgba(17,17,17,0.7)', flex: 1 }}>{item.name}</span>
                          <span style={{ fontSize: '11px', color: 'rgba(17,17,17,0.4)', marginRight: '4px' }}>{total > 0 ? Math.round(item.value / total * 100) : 0}%</span>
                          <span style={{ fontSize: '12px', fontWeight: 700 }}>{item.value} db</span>
                        </div>
                      ))
                    })()}
                  </div>
                </div>

                {/* Inquiries list */}
                <div style={{ background: '#ffffff', border: '1px solid #E8E4DC', borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.4)', marginBottom: '1rem' }}>
                    Érdeklődők ({inquiries.length})
                  </div>
                  {inquiries.length === 0 ? (
                    <div style={{ fontSize: '13px', color: 'rgba(17,17,17,0.35)', padding: '1rem 0' }}>Még nincs érdeklődő rögzítve</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                      {inquiries.map((inq, i) => {
                        const d = new Date(inq.created_at)
                        const dateStr = d.toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' })
                        const timeStr = d.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })
                        return (
                          <div key={inq.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < inquiries.length - 1 ? '1px solid #f0ede8' : 'none' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                            <div style={{ flex: 1, fontSize: '13px', fontWeight: 600, color: '#111111' }}>{inq.bike_name || '—'}</div>
                            <div style={{ fontSize: '11px', color: 'rgba(17,17,17,0.4)', background: '#f5f5f5', padding: '3px 8px', borderRadius: '5px' }}>{inq.source}</div>
                            <div style={{ fontSize: '12px', color: 'rgba(17,17,17,0.45)', flexShrink: 0 }}>{dateStr} {timeStr}</div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── FORM VIEW ──────────────────────────────────────────── */}
        {view === 'form' && (
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.6rem', letterSpacing: '-0.04em', marginBottom: '2rem' }}>
              {editing ? 'Kerékpár szerkesztése' : 'Új kerékpár hozzáadása'}
            </h2>

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
                    <label style={labelStyle}>Típus</label>
                    <select value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value as 'outlet' | 'hasznalt' }))} style={inputStyle}>
                      <option value="outlet">Outlet / Bemutató</option>
                      <option value="hasznalt">Használt</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Állapot részletesen</label>
                  <select value={form.condition_detail ?? ''} onChange={e => setForm(f => ({ ...f, condition_detail: (e.target.value as Bike['condition_detail']) || 'uj' }))} style={inputStyle}>
                    <option value="">— Nem megadott —</option>
                    <option value="uj">Új – Bemutató darab, 0 km, karcmentes</option>
                    <option value="kivalo">Kiváló – Alig használt, 1–2 szezon</option>
                    <option value="jo">Jó – Normálisan használt</option>
                    <option value="megfelelo">Megfelelő – Rendszeres használat nyomai</option>
                  </select>
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
                  <div style={{ background: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.3)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', fontWeight: 600 }}>
                    Megtakarítás: {(form.original_price - form.sale_price).toLocaleString('hu-HU')} Ft
                    <span style={{ color: 'rgba(17,17,17,0.5)', fontWeight: 400 }}> ({Math.round((1 - form.sale_price / form.original_price) * 100)}%)</span>
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
                  <div><label style={labelStyle}>Futott kilométerek</label><input type="number" value={form.kilometers ?? 0} onChange={e => setForm(f => ({ ...f, kilometers: parseInt(e.target.value) || 0 }))} style={inputStyle} placeholder="0" /></div>
                  <div><label style={labelStyle}>Méret</label><input value={form.size || ''} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} style={inputStyle} placeholder="L, 54cm..." /></div>
                  <div><label style={labelStyle}>Év</label><input type="number" value={form.year || ''} onChange={e => setForm(f => ({ ...f, year: parseInt(e.target.value) }))} style={inputStyle} placeholder="2024" /></div>
                  <div><label style={labelStyle}>Szín</label><input value={form.color || ''} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} style={inputStyle} placeholder="Fekete" /></div>
                </div>
                <div>
                  <label style={labelStyle}>Leírás</label>
                  <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }} placeholder="Rövid leírás..." />
                </div>
                <div>
                  <label style={labelStyle}>Komponensek / Specifikációk</label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input value={specInput} onChange={e => setSpecInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSpec()} style={{ ...inputStyle, flex: 1 }} placeholder="pl. Shimano XT..." />
                    <button onClick={addSpec} style={{ background: '#111111', color: '#ffffff', border: 'none', padding: '0 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '18px' }}>+</button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {form.specs?.map((sp, i) => (
                      <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', padding: '5px 10px', background: '#f5f5f5', border: '1px solid #E8E4DC', borderRadius: '6px' }}>
                        {sp}
                        <button onClick={() => removeSpec(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(17,17,17,0.4)', padding: '0 2px', display: 'flex', alignItems: 'center' }}><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[{ label: 'Elérhető', field: 'available' as keyof Bike }, { label: 'Kiemelt', field: 'featured' as keyof Bike }, { label: 'Eladott', field: 'sold' as keyof Bike }].map(({ label, field }) => (
                    <button key={field} onClick={() => setForm(f => ({ ...f, [field]: !f[field] }))} style={{
                      display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', border: '1px solid', transition: 'all 0.15s',
                      ...(form[field] ? field === 'sold' ? { background: 'rgba(220,38,38,0.08)', borderColor: '#dc2626', color: '#dc2626' } : { background: 'rgba(232,197,71,0.1)', borderColor: '#e8c547', color: '#111111' } : { background: '#ffffff', borderColor: '#E8E4DC', color: 'rgba(17,17,17,0.4)' }),
                    }}><Check size={13} /> {label}</button>
                  ))}
                </div>
              </div>

              {/* RIGHT – Images */}
              <div>
                <label style={labelStyle}>Képek</label>
                <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed #E8E4DC', borderRadius: '12px', padding: '2rem', textAlign: 'center', cursor: 'pointer', marginBottom: '1rem', background: '#ffffff', transition: 'border-color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#111111')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#E8E4DC')}>
                  <Upload size={28} style={{ color: '#111111', margin: '0 auto 10px', display: 'block' }} />
                  <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{uploading ? 'Feltöltés...' : 'Kattints a képek feltöltéséhez'}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(17,17,17,0.4)' }}>JPG, PNG · Húzással átrendezhető</div>
                  <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files && uploadImages(e.target.files)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {form.images?.map((url, i) => (
                    <div key={url} draggable onDragStart={() => onDragStart(i)} onDragOver={e => onDragOver(e, i)} onDragEnd={onDragEnd}
                      style={{ position: 'relative', aspectRatio: '4/3', cursor: 'grab', borderRadius: '8px', overflow: 'hidden', border: dragIdx === i ? '2px solid #e8c547' : '2px solid transparent', opacity: dragIdx !== null && dragIdx !== i ? 0.7 : 1 }}>
                      <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {i === 0 && <span style={{ position: 'absolute', top: '7px', left: '7px', background: '#e8c547', color: '#111111', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '5px', textTransform: 'uppercase' }}>Főkép</span>}
                      <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: '7px', right: '7px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button onClick={save} disabled={saving} style={{ background: '#111111', color: '#ffffff', border: 'none', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Mentés...' : editing ? 'Módosítások mentése' : 'Kerékpár hozzáadása'}
              </button>
              <button onClick={() => { setView('list'); setEditing(null); setForm({ ...empty }) }} style={{ background: 'transparent', color: '#111111', border: '1px solid #E8E4DC', padding: '14px 24px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>Mégse</button>
            </div>
          </div>
        )}

        {/* ── CATEGORIES VIEW ────────────────────────────────────── */}
        {view === 'categories' && (
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>Kategória kezelés</h2>
            <p style={{ fontSize: '13px', color: 'rgba(17,17,17,0.45)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Húzd át a sorrendhez. A rejtett kategóriák nem jelennek meg a főoldalon és a navigációban.
            </p>

            {catLoading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(17,17,17,0.3)' }}>Betöltés…</div>
            ) : categories.length === 0 ? (
              <div style={{ background: '#ffffff', border: '1px solid #E8E4DC', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', color: 'rgba(17,17,17,0.45)', marginBottom: '8px' }}>
                  A categories tábla még nem létezik az adatbázisban.
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(17,17,17,0.35)', fontFamily: 'monospace' }}>
                  Futtasd le: supabase/categories.sql
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '640px' }}>
                {categories.map((cat, i) => (
                  <div
                    key={cat.id}
                    draggable
                    onDragStart={() => onCatDragStart(i)}
                    onDragOver={e => onCatDragOver(e, i)}
                    onDragEnd={onCatDragEnd}
                    style={{
                      background: '#ffffff',
                      border: `1px solid ${catDragIdx === i ? '#e8c547' : '#E8E4DC'}`,
                      borderRadius: '10px', padding: '12px 16px',
                      display: 'flex', alignItems: 'center', gap: '12px',
                      cursor: 'grab',
                      opacity: catDragIdx !== null && catDragIdx !== i ? 0.55 : 1,
                      transition: 'opacity 0.15s, border-color 0.15s',
                    }}
                  >
                    <GripVertical size={16} style={{ color: 'rgba(17,17,17,0.25)', flexShrink: 0 }} />
                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#f0ede8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'rgba(17,17,17,0.5)', flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ flex: 1, fontSize: '14px', fontWeight: 600, color: '#111111' }}>{cat.name}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(17,17,17,0.35)', fontFamily: 'monospace', background: '#f5f5f5', padding: '3px 8px', borderRadius: '4px' }}>/{cat.slug}</div>
                    <button onClick={() => toggleCatVisible(cat)} style={{
                      padding: '7px 14px', borderRadius: '7px', border: '1px solid', cursor: 'pointer',
                      fontSize: '12px', fontWeight: 600, transition: 'all 0.15s',
                      background: cat.visible ? 'rgba(34,197,94,0.08)' : 'rgba(220,38,38,0.06)',
                      borderColor: cat.visible ? '#22c55e' : '#dc2626',
                      color: cat.visible ? '#15803d' : '#dc2626',
                    }}>
                      {cat.visible ? 'Látható' : 'Rejtett'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SETTINGS VIEW ──────────────────────────────────────── */}
        {view === 'settings' && (
          <div style={{ maxWidth: '560px' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>Beállítások</h2>
            <p style={{ fontSize: '13px', color: 'rgba(17,17,17,0.45)', marginBottom: '2rem', lineHeight: 1.6 }}>
              Az értesítési beállítások a böngészőben tárolódnak (localStorage).
            </p>
            <div style={{ background: '#ffffff', border: '1px solid #E8E4DC', borderRadius: '12px', padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Értesítési e-mail cím</label>
                <input value={notifSettings.email} onChange={e => setNotifSettings(p => ({ ...p, email: e.target.value }))} style={inputStyle} placeholder="ht.bike@hotmail.com" />
              </div>
              {([
                { key: 'newInquiry' as const, label: 'E-mail értesítés új érdeklődőnél' },
                { key: 'unsoldAfter7' as const, label: 'E-mail értesítés ha kerékpár 7 napja nem kelt el' },
              ] as const).map(({ key, label }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#111111', lineHeight: 1.4 }}>{label}</span>
                  <button onClick={() => setNotifSettings(p => ({ ...p, [key]: !p[key] }))} style={{ width: '46px', height: '26px', borderRadius: '13px', border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0, background: notifSettings[key] ? '#22c55e' : '#D1D5DB', transition: 'background 0.2s' }}>
                    <div style={{ position: 'absolute', top: '3px', left: notifSettings[key] ? '23px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: '#ffffff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                  </button>
                </div>
              ))}
              <button onClick={saveNotifSettings} style={{ alignSelf: 'flex-start', background: '#111111', color: '#ffffff', border: 'none', padding: '11px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                Mentés
              </button>
            </div>
          </div>
        )}

        {/* ── LIST VIEW ──────────────────────────────────────────── */}
        {view === 'list' && (
          <div>
            {/* Stats bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
              {[
                { label: 'Összes', value: totalBikes, unit: 'db' },
                { label: 'Elérhető', value: availableBikes, unit: 'db' },
                { label: 'Eladott', value: soldBikes, unit: 'db' },
                { label: 'Átl. megtakarítás', value: avgSavings.toLocaleString('hu-HU'), unit: 'Ft' },
              ].map(s => (
                <div key={s.label} style={{ background: '#ffffff', border: '1px solid #E8E4DC', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(17,17,17,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '5px' }}>{s.label}</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>{s.value} <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(17,17,17,0.4)' }}>{s.unit}</span></div>
                </div>
              ))}
            </div>

            {/* Search / Filter / Sort toolbar */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(17,17,17,0.35)' }} />
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Keresés márka / modell..."
                  style={{ ...inputStyle, paddingLeft: '36px' }}
                />
              </div>
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: '160px' }}>
                <option value="">Összes kategória</option>
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: '160px' }}>
                <option value="newest">Legújabb</option>
                <option value="oldest">Legrégebbi</option>
                <option value="price_asc">Ár: növekvő</option>
                <option value="price_desc">Ár: csökkenő</option>
              </select>
            </div>

            {/* Bulk action bar */}
            {selected.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#111111', color: '#ffffff', padding: '12px 16px', borderRadius: '10px', marginBottom: '1rem' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, flex: 1 }}>{selected.length} kijelölve</span>
                <button onClick={bulkShow} style={{ background: '#ffffff', color: '#111111', border: 'none', padding: '7px 14px', borderRadius: '6px', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>Megjelenítés</button>
                <button onClick={bulkHide} style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: 'none', padding: '7px 14px', borderRadius: '6px', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>Elrejtés</button>
                <button onClick={bulkDelete} style={{ background: '#dc2626', color: '#ffffff', border: 'none', padding: '7px 14px', borderRadius: '6px', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>Törlés</button>
                <button onClick={() => setSelected([])} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '4px' }}><X size={16} /></button>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.04em' }}>
                Kerékpárok <span style={{ color: 'rgba(17,17,17,0.3)', fontWeight: 500 }}>({filteredBikes.length})</span>
              </h2>
              <div ref={exportRef} style={{ position: 'relative' }}>
                <button onClick={() => setExportOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #E8E4DC', background: '#ffffff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  Export ↓
                </button>
                {exportOpen && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: '#ffffff', border: '1px solid #E8E4DC', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 50, minWidth: '160px', padding: '6px' }}>
                    {[{ label: 'PDF letöltés', fn: exportPDF }, { label: 'Excel letöltés', fn: exportExcel }].map(item => (
                      <button key={item.label} onClick={item.fn}
                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px', borderRadius: '6px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#111111' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f5')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {filteredBikes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem', background: '#ffffff', border: '1px solid #E8E4DC', borderRadius: '12px' }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🚲</div>
                <div style={{ fontSize: '15px', color: 'rgba(17,17,17,0.5)', marginBottom: '1.5rem' }}>
                  {bikes.length === 0 ? 'Még nincs kerékpár feltöltve.' : 'Nincs találat a szűrési feltételekre.'}
                </div>
                {bikes.length === 0 && (
                  <button onClick={newBike} style={{ background: '#111111', color: '#ffffff', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}>
                    + Első kerékpár hozzáadása
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Header checkbox row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '8px 1.25rem', marginBottom: '4px' }}>
                  <input type="checkbox" checked={selected.length === filteredBikes.length && filteredBikes.length > 0} onChange={selectAll}
                    style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#111111' }} />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(17,17,17,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Összes kijelölése</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {filteredBikes.map(bike => (
                    <div key={bike.id} style={{ background: '#ffffff', border: `1px solid ${selected.includes(bike.id) ? '#111111' : '#E8E4DC'}`, borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', opacity: bike.sold ? 0.6 : 1, transition: 'border-color 0.15s, opacity 0.2s' }}>
                      {/* Checkbox */}
                      <input type="checkbox" checked={selected.includes(bike.id)} onChange={() => toggleSelect(bike.id)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0, accentColor: '#111111' }} />

                      {/* Thumb */}
                      <div style={{ width: '72px', height: '54px', flexShrink: 0, background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                        {bike.images?.[0] && <img src={bike.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        {bike.sold && <div style={{ position: 'absolute', inset: 0, background: 'rgba(220,38,38,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 800, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase' }}>ELADVA</div>}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#e8c547', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>{bike.brand}</div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textDecoration: bike.sold ? 'line-through' : 'none', letterSpacing: '-0.02em' }}>{bike.model}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(17,17,17,0.4)', marginTop: '2px' }}>
                          {bike.condition === 'outlet' ? 'Outlet' : 'Használt'} · {CATEGORIES.find(c => c.key === bike.category)?.label}
                          {bike.sold && <span style={{ color: '#dc2626', fontWeight: 600, marginLeft: '6px' }}>· ELADVA</span>}
                        </div>
                      </div>

                      {/* Price – inline editable */}
                      <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '110px' }}>
                        <div style={{ fontSize: '11px', color: 'rgba(17,17,17,0.35)', textDecoration: 'line-through', marginBottom: '2px' }}>{bike.original_price.toLocaleString('hu-HU')} Ft</div>
                        {editingPrice?.id === bike.id ? (
                          <input autoFocus value={editingPrice.value}
                            onChange={e => setEditingPrice({ id: bike.id, value: e.target.value })}
                            onKeyDown={e => { if (e.key === 'Enter') savePriceEdit(bike.id, bike.sale_price); if (e.key === 'Escape') setEditingPrice(null) }}
                            onBlur={() => savePriceEdit(bike.id, bike.sale_price)}
                            style={{ width: '100px', padding: '3px 8px', border: '2px solid #e8c547', borderRadius: '6px', fontSize: '13px', fontWeight: 700, textAlign: 'right', outline: 'none', fontFamily: 'Inter, system-ui, sans-serif' }}
                          />
                        ) : (
                          <div onClick={() => setEditingPrice({ id: bike.id, value: bike.sale_price.toString() })}
                            title="Kattints az ár módosításához"
                            style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.03em', cursor: 'pointer', padding: '2px 4px', borderRadius: '4px', transition: 'background 0.4s, color 0.4s', background: flashIds.includes(bike.id) ? 'rgba(34,197,94,0.15)' : 'transparent', color: flashIds.includes(bike.id) ? '#15803d' : '#111111' }}>
                            {bike.sale_price.toLocaleString('hu-HU')} Ft
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                        <button onClick={() => toggleField(bike.id, 'available', bike.available)} title={bike.available ? 'Elrejtés' : 'Megjelenítés'} style={iconBtn(bike.available ? '#059669' : 'rgba(17,17,17,0.25)')}>
                          {bike.available ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button onClick={() => toggleField(bike.id, 'featured', bike.featured)} title={bike.featured ? 'Kiemelt törlés' : 'Kiemelés'} style={iconBtn(bike.featured ? '#e8c547' : 'rgba(17,17,17,0.25)')}>
                          <Star size={16} fill={bike.featured ? '#e8c547' : 'none'} />
                        </button>
                        <button onClick={() => toggleSold(bike.id, !!bike.sold)} title={bike.sold ? 'Eladott visszavon' : 'Eladottnak jelöl'} style={iconBtn(bike.sold ? '#dc2626' : 'rgba(17,17,17,0.25)')}>
                          <ShoppingBag size={16} />
                        </button>
                        <button onClick={() => duplicateBike(bike)} title="Másolás" style={iconBtn('rgba(17,17,17,0.4)')}><Copy size={16} /></button>
                        <button onClick={() => editBike(bike)} title="Szerkesztés" style={iconBtn('rgba(17,17,17,0.5)')}><Edit size={16} /></button>
                        <button onClick={() => deleteBike(bike.id)} title="Törlés" style={iconBtn('#dc2626')}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '11px', fontWeight: 600,
  letterSpacing: '0.08em', textTransform: 'uppercase',
  color: 'rgba(17,17,17,0.45)', marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px',
  background: '#ffffff', border: '1px solid #E8E4DC',
  borderRadius: '8px', color: '#111111',
  fontSize: '14px', outline: 'none',
  fontFamily: 'Inter, system-ui, sans-serif',
}

function iconBtn(color: string): React.CSSProperties {
  return { background: 'none', border: 'none', color, cursor: 'pointer', padding: '7px', display: 'flex', alignItems: 'center', borderRadius: '6px' }
}
