import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAdminFromCookie } from '@/lib/auth'
import { generateSlug } from '@/lib/slug'
import { sendNewEpisodeEmails } from '@/lib/email'
import { z } from 'zod'

const db = new PrismaClient()

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  type: z.enum(['VIDEO', 'AUDIO']),
  youtubeUrl: z.string().url().optional().nullable().or(z.literal('')),
  audioUrl: z.string().url().optional().nullable().or(z.literal('')),
  guestName: z.string().optional().nullable().or(z.literal('')),
  guestTitle: z.string().optional().nullable().or(z.literal('')),
  guestBio: z.string().optional().nullable().or(z.literal('')),
  guestLinks: z.any().optional().nullable(),
  category: z.string().optional().nullable(),
  score: z.coerce.number().int().min(0).max(100).default(0),
  subtitles: z.string().optional().nullable().or(z.literal('')),
  published: z.boolean().default(false),
})

export async function GET() {
  try {
    const episodes = await db.episode.findMany({ orderBy: [{ score: 'desc' }, { createdAt: 'desc' }] })
    return NextResponse.json(episodes)
  } catch (err) {
    console.error('GET episodes error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const admin = getAdminFromCookie()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const cleaned = {
      ...body,
      youtubeUrl: body.youtubeUrl || null,
      audioUrl: body.audioUrl || null,
      guestName: body.guestName || null,
      guestTitle: body.guestTitle || null,
      guestBio: body.guestBio || null,
      subtitles: body.subtitles || null,
      score: Number(body.score) || 0,
    }
    const parsed = schema.safeParse(cleaned)
    if (!parsed.success) {
      console.error('Validation error:', parsed.error.flatten())
      return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
    }
    const data = parsed.data
    let slug = generateSlug(data.title)
    const existing = await db.episode.findUnique({ where: { slug } })
    if (existing) slug = `${slug}-${Date.now()}`
    const episode = await db.episode.create({
      data: { ...data, slug, youtubeUrl: data.youtubeUrl || null, audioUrl: data.audioUrl || null, guestName: data.guestName || null, guestTitle: data.guestTitle || null, guestBio: data.guestBio || null, subtitles: data.subtitles || null },
    })
    if (episode.published) {
      const subscribers = await db.subscriber.findMany({ select: { email: true } })
      await sendNewEpisodeEmails(subscribers.map(s => s.email), episode).catch(console.error)
    }
    return NextResponse.json(episode, { status: 201 })
  } catch (err) {
    console.error('POST episodes error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
