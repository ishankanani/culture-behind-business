import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAdminFromCookie } from '@/lib/auth'

const db = new PrismaClient()

export async function GET() {
  try {
    const hosts = await db.hostProfile.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(hosts)
  } catch (err) {
    console.error('GET /api/hosts error:', err)
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  const admin = getAdminFromCookie()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const host = await db.hostProfile.create({ data: body })
    return NextResponse.json(host, { status: 201 })
  } catch (err) {
    console.error('POST /api/hosts error:', err)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
