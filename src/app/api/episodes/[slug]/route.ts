import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAdminFromCookie } from '@/lib/auth'
import { sendNewEpisodeEmails } from '@/lib/email'

const db = new PrismaClient()
type P = { params: { slug: string } }

export async function GET(_: NextRequest, { params }: P) {
  const ep = await db.episode.findUnique({ where: { slug: params.slug } })
  if (!ep) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(ep)
}

export async function PUT(req: NextRequest, { params }: P) {
  const admin = getAdminFromCookie()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const existing = await db.episode.findUnique({ where: { slug: params.slug } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const wasUnpublished = !existing.published
  const episode = await db.episode.update({ where: { slug: params.slug }, data: body })
  if (wasUnpublished && episode.published) {
    const subscribers = await db.subscriber.findMany({ select: { email: true } })
    await sendNewEpisodeEmails(subscribers.map(s => s.email), episode).catch(console.error)
  }
  return NextResponse.json(episode)
}

export async function DELETE(_: NextRequest, { params }: P) {
  const admin = getAdminFromCookie()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await db.episode.delete({ where: { slug: params.slug } })
  return NextResponse.json({ success: true })
}
