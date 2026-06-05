import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'bb-admin-session',
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
})

export type Bike = {
  id: string
  created_at: string
  brand: string
  model: string
  category: 'ebike' | 'mtb' | 'trekking' | 'gravel' | 'gyerek' | 'orszaguti' | 'kemping' | 'alkatreszek' | 'ruhazat'
  condition: 'outlet' | 'hasznalt'
  original_price: number
  sale_price: number
  description: string
  specs: string[]
  images: string[]
  available: boolean
  featured: boolean
  size?: string
  year?: number
  color?: string
  sold?: boolean
  is_deleted?: boolean
  condition_detail: 'uj' | 'kivalo' | 'jo' | 'megfelelo'
  kilometers: number
}
