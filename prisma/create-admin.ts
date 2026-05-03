import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashed = await bcrypt.hash('admin123', 12)
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: { password: hashed },
    create: { username: 'admin', password: hashed },
  })
  console.log('✅ Admin created/updated!')
  console.log('Username:', admin.username)
  console.log('Password: admin123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
