import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAdminFromCookie } from '@/lib/auth'

const db = new PrismaClient()

export async function GET() {
  const categories = await db.category.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  const admin = getAdminFromCookie()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 })
  const existing = await db.category.findUnique({ where: { name: name.trim() } })
  if (existing) return NextResponse.json({ error: 'Category already exists' }, { status: 400 })
  const category = await db.category.create({ data: { name: name.trim() } })
  return NextResponse.json(category, { status: 201 })
}
