import { NextResponse } from 'next/server'

export async function GET() {
  // Generate dynamic sitemap dengan bookmark terbaru
  const baseUrl = 'https://bookmark-manager.vercel.app'
  
  // TODO: Fetch bookmarks dari Supabase untuk dynamic URLs
  // const { data: bookmarks } = await supabase
  //   .from('bookmarks')
  //   .select('id, updated_at')
  //   .order('created_at', { ascending: false })
  //   .limit(1000)

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/bookmarks</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/bookmarks/table</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/auth/login</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
