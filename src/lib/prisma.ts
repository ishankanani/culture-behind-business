import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  _prismaClient: PrismaClient | undefined
}

export const prisma =
  globalForPrisma._prismaClient ??
  new PrismaClient({ log: ['error'] })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma._prismaClient = prisma
}

export default prisma
