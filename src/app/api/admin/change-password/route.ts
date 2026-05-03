import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAdminFromCookie } from '@/lib/auth'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

export async function POST(req: NextRequest) {
  const admin = getAdminFromCookie()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { current, newPassword } = await req.json()
    if (!current || !newPassword) return NextResponse.json({ error: 'Both fields required' }, { status: 400 })
    if (newPassword.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    const user = await db.admin.findUnique({ where: { id: admin.id } })
    if (!user) return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    const match = await bcrypt.compare(current, user.password)
    if (!match) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    const hashed = await bcrypt.hash(newPassword, 12)
    await db.admin.update({ where: { id: admin.id }, data: { password: hashed } })
    return NextResponse.json({ message: 'Password updated successfully.' })
  } catch (err) {
    console.error('Change password error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
