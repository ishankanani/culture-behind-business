import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAdminFromCookie } from '@/lib/auth'

const db = new PrismaClient()
type P = { params: { id: string } }

export async function PUT(req: NextRequest, { params }: P) {
  const admin = getAdminFromCookie()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const host = await db.hostProfile.update({ where: { id: params.id }, data: body })
    return NextResponse.json(host)
  } catch (err) {
    console.error('PUT /api/hosts error:', err)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: P) {
  const admin = getAdminFromCookie()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await db.hostProfile.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/hosts error:', err)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
