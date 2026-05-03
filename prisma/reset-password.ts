import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const newPassword = 'admin123'
  const hashed = await bcrypt.hash(newPassword, 12)
  
  const admin = await prisma.admin.findFirst()
  if (!admin) { console.log('No admin found!'); return }
  
  await prisma.admin.update({
    where: { id: admin.id },
    data: { password: hashed },
  })
  
  console.log(`Password reset to: ${newPassword}`)
  console.log(`Username: ${admin.username}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())