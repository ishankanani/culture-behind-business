import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAdminFromCookie } from '@/lib/auth'
import { sendCustomNewsletter } from '@/lib/email'

const db = new PrismaClient()

export async function POST(req: NextRequest) {
  const admin = getAdminFromCookie()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { subject, body } = await req.json()
    if (!subject || !body) return NextResponse.json({ error: 'Subject and body required' }, { status: 400 })
    const subscribers = await db.subscriber.findMany({ select: { email: true } })
    console.log('Sending newsletter to:', subscribers.length, 'subscribers')
    if (subscribers.length === 0) return NextResponse.json({ error: 'No subscribers found' }, { status: 400 })
    await sendCustomNewsletter(subscribers.map(s => s.email), subject, body)
    return NextResponse.json({ message: `Newsletter sent to ${subscribers.length} subscriber(s).` })
  } catch (err) {
    console.error('Newsletter error:', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
