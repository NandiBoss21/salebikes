import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://salebikes.hu'

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,                              lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${baseUrl}/osszes-kerekpar`,         lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/ebike`,                   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${baseUrl}/mtb`,                     lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${baseUrl}/trekking`,                lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${baseUrl}/gravel`,                  lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${baseUrl}/orszaguti`,               lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${baseUrl}/gyerek`,                  lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${baseUrl}/kemping`,                 lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${baseUrl}/alkatreszek`,             lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${baseUrl}/ruhazat`,                 lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${baseUrl}/rolunk`,                  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/kapcsolat`,               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/garancia`,                lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/faq`,                     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/aszf`,                    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.2 },
    { url: `${baseUrl}/adatkezeles`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.2 },
  ]

  const { data: bikes } = await supabase
    .from('bikes')
    .select('id, updated_at')
    .eq('is_active', true)

  const bikePages: MetadataRoute.Sitemap = (bikes ?? []).map((bike) => ({
    url: `${baseUrl}/kerekpar/${bike.id}`,
    lastModified: new Date(bike.updated_at ?? new Date()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticPages, ...bikePages]
}
