import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAdminFromCookie } from '@/lib/auth'

const db = new PrismaClient()

export async function GET() {
  try {
    const settings = await db.siteSetting.findMany()
    const map: Record<string, string> = {}
    settings.forEach(s => { map[s.key] = s.value })
    return NextResponse.json(map)
  } catch (err) {
    console.error('GET settings error:', err)
    return NextResponse.json({})
  }
}

export async function POST(req: NextRequest) {
  const admin = getAdminFromCookie()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const results: Record<string, string> = {}
    for (const [key, value] of Object.entries(body)) {
      const setting = await db.siteSetting.upsert({
        where: { key },
        update: { value: value as string },
        create: { key, value: value as string },
      })
      results[setting.key] = setting.value
    }
    return NextResponse.json(results)
  } catch (err) {
    console.error('POST settings error:', err)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
