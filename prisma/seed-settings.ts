import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.siteSetting.upsert({
    where: { key: 'hero_image' },
    update: {},
    create: { key: 'hero_image', value: '/both.jpeg' },
  })
  await prisma.siteSetting.upsert({
    where: { key: 'hero_title' },
    update: {},
    create: { key: 'hero_title', value: 'Your destination for the best in business storytelling' },
  })
  await prisma.siteSetting.upsert({
    where: { key: 'hero_subtitle' },
    update: {},
    create: { key: 'hero_subtitle', value: 'Deep conversations about culture, leadership, and the people who build companies that matter.' },
  })

  await prisma.hostProfile.upsert({
    where: { id: 'host-1' },
    update: {},
    create: {
      id: 'host-1',
      name: 'Host Name 1',
      role: 'Co-Host & Producer',
      bio: 'Write your bio here. This is editable from the admin panel.',
      image: '/both.jpeg',
      order: 1,
    },
  })
  await prisma.hostProfile.upsert({
    where: { id: 'host-2' },
    update: {},
    create: {
      id: 'host-2',
      name: 'Host Name 2',
      role: 'Co-Host & Creator',
      bio: 'Write your bio here. This is editable from the admin panel.',
      image: '/both.jpeg',
      order: 2,
    },
  })
  console.log('Settings seeded!')
}

main().catch(console.error).finally(() => prisma.$disconnect())