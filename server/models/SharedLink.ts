import crypto from 'crypto'
import prisma from '../utils/prisma'

export interface CreateSharedLinkData {
  document_id: number
  token?: string
  passphrase_hash?: string | null
  max_accesses: number
  expires_at: Date
  current_accesses?: number
  is_active?: boolean
}

export class SharedLinkModel {
  static async create(linkData: CreateSharedLinkData) {
    const link = await prisma.sharedLink.create({
      data: {
        document_id: linkData.document_id,
        token: linkData.token || crypto.randomBytes(32).toString('hex'),
        passphrase_hash: linkData.passphrase_hash ?? null,
        max_accesses: linkData.max_accesses,
        current_accesses: linkData.current_accesses ?? 0,
        is_active: linkData.is_active ?? true,
        expires_at: linkData.expires_at
      }
    })

    return link
  }

  static async findByToken(token: string) {
    const link = await prisma.sharedLink.findUnique({
      where: { token }
    })
    return link
  }

  static async findByDocumentId(documentId: number) {
    const links = await prisma.sharedLink.findMany({
      where: { document_id: documentId },
      orderBy: { created_at: 'desc' }
    })
    return links
  }

  static async deactivateForDocument(id: number, documentId: number) {
    const result = await prisma.sharedLink.updateMany({
      where: { id, document_id: documentId, is_active: true },
      data: { is_active: false }
    })
    return result.count > 0
  }

  static async incrementAccessIfAvailable(id: number, maxAccesses: number) {
    const result = await prisma.sharedLink.updateMany({
      where: {
        id,
        is_active: true,
        current_accesses: { lt: maxAccesses },
        expires_at: { gt: new Date() }
      },
      data: { current_accesses: { increment: 1 } }
    })
    return result.count > 0
  }

  static async findActiveByToken(token: string) {
    const now = new Date()
    const link = await prisma.sharedLink.findFirst({
      where: {
        token,
        is_active: true,
        expires_at: { gt: now }
      }
    })
    return link
  }

  static async delete(id: number) {
    try {
      await prisma.sharedLink.delete({ where: { id } })
      return true
    } catch (e: any) {
      if (e.code === 'P2025') return false
      throw e
    }
  }

  static async cleanupExpired() {
    const now = new Date()
    let totalRemoved = 0

    // Delete expired links (by time)
    const expiredResult = await prisma.sharedLink.deleteMany({
      where: { expires_at: { lte: now } }
    })
    totalRemoved += expiredResult.count

    // Delete links that have exhausted their max access count
    // Using raw SQL because Prisma can't compare two columns in deleteMany
    const exhaustedResult = await prisma.$executeRawUnsafe(
      `DELETE FROM "SharedLink" WHERE current_accesses >= max_accesses AND is_active = true`
    )
    totalRemoved += exhaustedResult

    await prisma.sharedLinkPassphraseAttempt.deleteMany({
      where: {
        OR: [
          {
            window_started_at: { lt: new Date(now.getTime() - 5 * 60 * 1000) },
            in_flight_attempts: 0
          },
          { updated_at: { lt: new Date(now.getTime() - 30 * 60 * 1000) } }
        ]
      }
    })

    return totalRemoved
  }
}
