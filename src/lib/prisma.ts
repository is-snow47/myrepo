import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

// Vercel Serverless Functions have a read-only filesystem, which crashes SQLite.
// So we copy the bundled database to the writable /tmp folder on boot!
if (process.env.VERCEL) {
  const tmpDbPath = '/tmp/dev.db'
  
  if (!fs.existsSync(tmpDbPath)) {
    try {
      // Try finding the DB in the bundled output
      const bundledDbPath = path.join(process.cwd(), 'prisma', 'prisma', 'dev.db')
      const fallbackDbPath = path.join(process.cwd(), 'prisma', 'dev.db')
      
      if (fs.existsSync(bundledDbPath)) {
        fs.copyFileSync(bundledDbPath, tmpDbPath)
      } else if (fs.existsSync(fallbackDbPath)) {
        fs.copyFileSync(fallbackDbPath, tmpDbPath)
      }
    } catch (err) {
      console.error('Failed to copy SQLite DB to /tmp', err)
    }
  }
  
  // Override the environment variable so Prisma connects to the writable /tmp copy
  process.env.DATABASE_URL = `file:${tmpDbPath}`
}

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
