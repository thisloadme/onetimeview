import crypto from 'crypto'
import prisma from '../utils/prisma'

export interface CreateSharedLinkData {
  document_id: number
  token?: string
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

  static async incrementAccess(id: number) {
    try {
      const link = await prisma.sharedLink.update({
        where: { id },
        data: {
          current_accesses: { increment: 1 }
        }
      })
      return link
    } catch (e: any) {
      if (e.code === 'P2025') return null
      throw e
    }
  }

  static async deactivate(id: number) {
    try {
      const link = await prisma.sharedLink.update({
        where: { id },
        data: { is_active: false }
      })
      return link
    } catch (e: any) {
      if (e.code === 'P2025') return null
      throw e
    }
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

    return totalRemoved
  }
}
