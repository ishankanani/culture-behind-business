import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { sendWelcomeEmail } from '@/lib/email'
import { z } from 'zod'

const db = new PrismaClient()
const schema = z.object({ email: z.string().email(), name: z.string().optional() })

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  const { email, name } = parsed.data
  const existing = await db.subscriber.findUnique({ where: { email } })
  if (existing) return NextResponse.json({ message: 'You are already subscribed!' })
  await db.subscriber.create({ data: { email, name } })
  await sendWelcomeEmail(email, name).catch(console.error)
  return NextResponse.json({ message: 'Subscribed! Check your email for a welcome message.' }, { status: 201 })
}
