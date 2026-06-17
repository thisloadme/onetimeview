import { getCurrentUser } from '~/server/utils/auth'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  // ⚠️ P2.4: Support pagination
  const query = getQuery(event)
  const page = Math.max(1, parseInt(query.page as string) || 1)
  const limit = Math.min(50, Math.max(1, parseInt(query.limit as string) || 20))
  const skip = (page - 1) * limit

  const [documents, total] = await Promise.all([
    prisma.document.findMany({
      where: { author_id: user.id },
      orderBy: { created_at: 'desc' },
      skip,
      take: limit,
      include: {
        _count: {
          select: {
            document_accesses: true,
            shared_links: {
              where: { is_active: true }
            }
          }
        }
      }
    }),
    prisma.document.count({
      where: { author_id: user.id }
    })
  ])

  const result = documents.map(doc => ({
    id: doc.id,
    title: doc.title,
    content: doc.content,
    author_id: doc.author_id,
    is_published: doc.is_published,
    total_views: doc._count.document_accesses,
    shared_links_count: doc._count.shared_links,
    created_at: doc.created_at,
    updated_at: doc.updated_at
  }))

  return {
    documents: result,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
})
