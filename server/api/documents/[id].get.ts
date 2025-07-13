import { Document } from '~/server/models/Document'
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
  
  const document = await Document.findById(documentId)
  
  if (!document) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Document not found'
    })
  }
  
  // Check if user is the author of the document
  if (document.author.toString() !== user._id.toString()) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You do not have permission to access this document'
    })
  }
  
  return { document }
}) 