export function optimizeImage(url: string, width: number = 800, quality: number = 75): string {
  if (!url || !url.includes('supabase.co/storage')) return url
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}width=${width}&quality=${quality}&resize=contain`
}
