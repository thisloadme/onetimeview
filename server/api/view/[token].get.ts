import { SharedLinkModel } from '~/server/models/SharedLink'
import { DocumentModel } from '~/server/models/Document'
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
  
  // Increment access count
  await SharedLinkModel.incrementAccess(sharedLink.id)
  
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
  
  return {
    document: {
      title: document.title,
      content: document.content
    },
    accessInfo: {
      currentAccesses: sharedLink.current_accesses + 1,
      maxAccesses: sharedLink.max_accesses,
      remainingAccesses: sharedLink.max_accesses - (sharedLink.current_accesses + 1)
    }
  }
})