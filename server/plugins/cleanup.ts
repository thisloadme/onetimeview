import { SharedLinkModel } from '../models/SharedLink'

export default defineNitroPlugin(async () => {
  // Run initial cleanup on startup
  try {
    const removed = await SharedLinkModel.cleanupExpired()
    if (removed > 0) {
      console.log(`🧹 Cleaned up ${removed} expired shared links on startup`)
    }
  } catch (error) {
    console.error('❌ Initial cleanup failed:', error)
  }

  // Schedule periodic cleanup every 30 minutes
  const CLEANUP_INTERVAL = 30 * 60 * 1000 // 30 minutes
  setInterval(async () => {
    try {
      const removed = await SharedLinkModel.cleanupExpired()
      if (removed > 0) {
        console.log(`🧹 Cleaned up ${removed} expired shared links`)
      }
    } catch (error) {
      console.error('❌ Scheduled cleanup failed:', error)
    }
  }, CLEANUP_INTERVAL)

  console.log(`⏰ Shared link cleanup scheduled every 30 minutes`)
})
