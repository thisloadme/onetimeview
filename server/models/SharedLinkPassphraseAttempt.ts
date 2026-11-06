import prisma from '~/server/utils/prisma'
import { verifyPassphrase } from '~/server/utils/passphrase'

const MAX_FAILED_ATTEMPTS = 8
const WINDOW_MS = 5 * 60 * 1000

export class SharedLinkPassphraseAttemptModel {
  static async reserve(sharedLinkId: number, ipHash: string) {
    const now = new Date()
    const where = {
      shared_link_id_ip_hash: {
        shared_link_id: sharedLinkId,
        ip_hash: ipHash
      }
    }

    return prisma.$transaction(async (tx) => {
      await tx.sharedLinkPassphraseAttempt.upsert({
        where,
        create: {
          shared_link_id: sharedLinkId,
          ip_hash: ipHash,
          failed_attempts: 0,
          window_started_at: now
        },
        update: { updated_at: now }
      })

      let attempts = await tx.sharedLinkPassphraseAttempt.findUnique({ where })
      if (!attempts) throw new Error('Passphrase attempt state could not be loaded')

      if (now.getTime() - attempts.window_started_at.getTime() >= WINDOW_MS) {
        attempts = await tx.sharedLinkPassphraseAttempt.update({
          where,
          data: { failed_attempts: 0, in_flight_attempts: 0, window_started_at: now }
        })
      }

      const retryAfter = Math.max(1, Math.ceil(
        (attempts.window_started_at.getTime() + WINDOW_MS - now.getTime()) / 1000
      ))
      if (attempts.failed_attempts >= MAX_FAILED_ATTEMPTS) {
        return { allowed: false as const, retryAfter }
      }
      if (attempts.failed_attempts + attempts.in_flight_attempts >= MAX_FAILED_ATTEMPTS) {
        return { allowed: false as const, retryAfter: 1 }
      }

      await tx.sharedLinkPassphraseAttempt.update({
        where,
        data: { in_flight_attempts: { increment: 1 } }
      })

      return { allowed: true as const, windowStartedAt: attempts.window_started_at }
    })
  }

  static async recordResult(
    sharedLinkId: number,
    ipHash: string,
    windowStartedAt: Date,
    valid: boolean
  ) {
    const where = {
      shared_link_id: sharedLinkId,
      ip_hash: ipHash,
      window_started_at: windowStartedAt,
      in_flight_attempts: { gt: 0 }
    }
    const result = await prisma.sharedLinkPassphraseAttempt.updateMany({
      where,
      data: valid
        ? { in_flight_attempts: { decrement: 1 } }
        : { in_flight_attempts: { decrement: 1 }, failed_attempts: { increment: 1 } }
    })

    return result.count > 0
  }
}
