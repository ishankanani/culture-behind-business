import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { signToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()
    if (!username || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    const admin = await db.admin.findUnique({ where: { username } })
    if (!admin || !(await bcrypt.compare(password, admin.password)))
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    const token = signToken({ id: admin.id, username: admin.username })
    const res = NextResponse.json({ success: true })
    res.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })
    return res
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
