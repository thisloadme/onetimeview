import { DocumentModel } from '~/server/models/Document'
import { SharedLinkModel } from '~/server/models/SharedLink'
import { getCurrentUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const documentId = getRouterParam(event, 'id')

  if (!documentId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Document ID is required'
    })
  }

  const document = await DocumentModel.findByAuthorAndId(user.id, parseInt(documentId))

  if (!document) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Document not found or you do not have permission to view its links'
    })
  }

  const allLinks = await SharedLinkModel.findByDocumentId(parseInt(documentId))
  const now = new Date()

  // Only return links that are still active and have remaining views
  const activeLinks = allLinks.filter((link) => {
    const hasRemainingViews = link.current_accesses < link.max_accesses
    const notExpired = link.expires_at > now
    return link.is_active && hasRemainingViews && notExpired
  })

  return {
    links: activeLinks.map((link) => ({
      id: link.id,
      token: link.token,
      maxAccesses: link.max_accesses,
      currentAccesses: link.current_accesses,
      expiresAt: link.expires_at,
      url: `/view/${link.token}`
    }))
  }
})
