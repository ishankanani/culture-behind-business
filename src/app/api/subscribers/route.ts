import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAdminFromCookie } from '@/lib/auth'

const db = new PrismaClient()

export async function GET() {
  const admin = getAdminFromCookie()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const subs = await db.subscriber.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(subs)
}
