import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const db = new PrismaClient()
const schema = z.object({ name: z.string().min(2), email: z.string().email(), subject: z.string().optional(), message: z.string().min(5) })

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Please fill all required fields' }, { status: 400 })
  await db.contact.create({ data: parsed.data })
  return NextResponse.json({ message: 'Message received! We will get back to you soon.' }, { status: 201 })
}
