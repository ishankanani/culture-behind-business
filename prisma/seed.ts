import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin
  const hashed = await bcrypt.hash('admin123', 12)
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: hashed },
  })

  // Default site settings
  const defaultSettings = [
    { key: 'hero_title', value: 'Your destination for the best in business storytelling' },
    { key: 'hero_subtitle', value: 'Deep conversations about culture, leadership, and the people who build companies that matter.' },
    { key: 'hero_image', value: '/both.jpeg' },
  ]
  for (const s of defaultSettings) {
    await prisma.siteSetting.upsert({ where: { key: s.key }, update: {}, create: s })
  }

  // Default host profiles
  await prisma.hostProfile.upsert({
    where: { id: 'host-1' },
    update: {},
    create: { id: 'host-1', name: 'Host One', role: 'Co-Host & Producer', bio: 'Update this bio from Admin → Site Settings.', image: '/both.jpeg', order: 1 },
  })
  await prisma.hostProfile.upsert({
    where: { id: 'host-2' },
    update: {},
    create: { id: 'host-2', name: 'Host Two', role: 'Co-Host & Creator', bio: 'Update this bio from Admin → Site Settings.', image: '/both.jpeg', order: 2 },
  })

  // Default categories
  const cats = ['Leadership', 'Culture', 'Startups', 'Marketing', 'Finance', 'Technology']
  for (const name of cats) {
    await prisma.category.upsert({ where: { name }, update: {}, create: { name } })
  }

  console.log('✅ Seed complete!')
  console.log('Login: admin / admin123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
