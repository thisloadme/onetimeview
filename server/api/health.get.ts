// P3.3: Health-check endpoint
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  const start = Date.now()
  let dbStatus = 'ok'
  let dbError = null

  try {
    await prisma.$queryRaw`SELECT 1`
  } catch (e: any) {
    dbStatus = 'error'
    dbError = e.message
  }

  const responseTime = Date.now() - start

  return {
    status: dbStatus === 'ok' ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: dbStatus,
      responseTime: `${responseTime}ms`,
      error: dbError
    },
    version: '1.0.0'
  }
})
