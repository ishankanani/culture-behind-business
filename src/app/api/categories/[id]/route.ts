import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAdminFromCookie } from '@/lib/auth'

const db = new PrismaClient()
type P = { params: { id: string } }

export async function DELETE(_: NextRequest, { params }: P) {
  const admin = getAdminFromCookie()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await db.category.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
