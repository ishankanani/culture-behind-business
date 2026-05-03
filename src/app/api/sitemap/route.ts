import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

export async function GET() {
  const episodes = await db.episode.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } })
  const staticPages = ['', '/about', '/episodes', '/contact', '/legal']
  const urls = [
    ...staticPages.map(p => `<url><loc>${SITE}${p}</loc><changefreq>weekly</changefreq></url>`),
    ...episodes.map(e => `<url><loc>${SITE}/episode/${e.slug}</loc><lastmod>${e.updatedAt.toISOString().split('T')[0]}</lastmod></url>`),
  ]
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
