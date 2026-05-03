import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() || ''
  if (q.length < 2) return NextResponse.json([])
  const results = await db.episode.findMany({
    where: { published: true, OR: [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { guestName: { contains: q, mode: 'insensitive' } },
    ]},
    select: { id: true, title: true, slug: true, type: true, guestName: true },
    take: 10,
  })
  return NextResponse.json(results)
}
