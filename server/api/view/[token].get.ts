import { DocumentModel } from '~/server/models/Document'
import { SharedLinkModel } from '~/server/models/SharedLink'
import { DocumentAccessModel } from '~/server/models/DocumentAccess'

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')

  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Token is required'
    })
  }

  const sharedLink = await SharedLinkModel.findActiveByToken(token)

  if (!sharedLink) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Link not found or expired'
    })
  }

  if (sharedLink.current_accesses >= sharedLink.max_accesses) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Maximum access limit reached'
    })
  }

  // Get the document
  const document = await DocumentModel.findById(sharedLink.document_id)

  if (!document) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Document not found'
    })
  }

  // Increment access count on shared link
  await SharedLinkModel.incrementAccess(sharedLink.id)

  // Increment document total_views
  await DocumentModel.incrementViews(sharedLink.document_id)

  // Record the access
  const clientIP = getRequestIP(event) || 'unknown'
  const userAgent = getHeader(event, 'user-agent') || 'unknown'

  await DocumentAccessModel.create({
    document_id: document.id,
    shared_link_id: sharedLink.id,
    ip_address: clientIP,
    user_agent: userAgent,
    access_type: 'shared_link'
  })

  // Get the updated access count
  const updatedLink = await SharedLinkModel.findByToken(token)

  return {
    document: {
      title: document.title,
      content: document.content
    },
    accessInfo: {
      currentAccesses: updatedLink?.current_accesses || sharedLink.current_accesses + 1,
      maxAccesses: sharedLink.max_accesses,
      remainingAccesses: Math.max(0, sharedLink.max_accesses - (updatedLink?.current_accesses || sharedLink.current_accesses + 1))
    }
  }
})
