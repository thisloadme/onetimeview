import { SharedLinkModel } from '~/server/models/SharedLink'

/**
 * External cron endpoint for cleanup.
 * Call this from cron-job.org, GitHub Actions, or other schedulers.
 * As a fallback, the cleanup plugin also runs every 30 minutes internally.
 */
export default defineEventHandler(async (event) => {
  const removed = await SharedLinkModel.cleanupExpired()

  return {
    success: true,
    cleaned: removed,
    message: `Cleaned up ${removed} expired shared links`,
    timestamp: new Date().toISOString()
  }
})
