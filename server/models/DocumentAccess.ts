import prisma from '../utils/prisma'

export interface CreateDocumentAccessData {
  document_id: number
  shared_link_id?: number | null
  ip_address?: string | null
  user_agent?: string | null
  access_type?: 'shared_link' | 'direct'
}

export class DocumentAccessModel {
  static async create(accessData: CreateDocumentAccessData) {
    const access = await prisma.documentAccess.create({
      data: {
        document_id: accessData.document_id,
        shared_link_id: accessData.shared_link_id ?? null,
        ip_address: accessData.ip_address ?? null,
        user_agent: accessData.user_agent ?? null,
        access_type: accessData.access_type ?? 'shared_link'
      }
    })

    return access
  }

  static async findByDocumentId(documentId: number, limit: number = 50, offset?: number) {
    const accesses = await prisma.documentAccess.findMany({
      where: { document_id: documentId },
      orderBy: { accessed_at: 'desc' },
      take: limit,
      skip: offset ?? 0
    })
    return accesses
  }

  static async findBySharedLinkId(sharedLinkId: number, limit: number = 50) {
    const accesses = await prisma.documentAccess.findMany({
      where: { shared_link_id: sharedLinkId },
      orderBy: { accessed_at: 'desc' },
      take: limit
    })
    return accesses
  }

  static async countByDocumentId(documentId: number) {
    return prisma.documentAccess.count({
      where: { document_id: documentId }
    })
  }

  static async countBySharedLinkId(sharedLinkId: number) {
    return prisma.documentAccess.count({
      where: { shared_link_id: sharedLinkId }
    })
  }

  static async getAccessStats(documentId: number) {
    const [total, sharedLinkAccesses, directAccesses, uniqueIps] = await Promise.all([
      prisma.documentAccess.count({ where: { document_id: documentId } }),
      prisma.documentAccess.count({
        where: { document_id: documentId, access_type: 'shared_link' }
      }),
      prisma.documentAccess.count({
        where: { document_id: documentId, access_type: 'direct' }
      }),
      prisma.documentAccess.findMany({
        where: { document_id: documentId, ip_address: { not: null } },
        select: { ip_address: true },
        distinct: ['ip_address']
      })
    ])

    return {
      total_accesses: total,
      shared_link_accesses: sharedLinkAccesses,
      direct_accesses: directAccesses,
      unique_ips: uniqueIps.length
    }
  }
}
