import { DocumentModel } from '~/server/models/Document'
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
      statusMessage: 'Document not found or you do not have permission to access it'
    })
  }
  
  return { document }
})