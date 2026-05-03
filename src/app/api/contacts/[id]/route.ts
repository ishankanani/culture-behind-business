import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAdminFromCookie } from '@/lib/auth'

const db = new PrismaClient()
type P = { params: { id: string } }

export async function PATCH(_: NextRequest, { params }: P) {
  const admin = getAdminFromCookie()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await db.contact.update({ where: { id: params.id }, data: { read: true } })
  return NextResponse.json({ success: true })
}
