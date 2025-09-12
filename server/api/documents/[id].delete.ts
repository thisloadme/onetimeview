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
  
  // Delete the document (this will check if user is the author)
  const deleted = await DocumentModel.delete(parseInt(documentId))
  
  if (!deleted) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Document not found or you do not have permission to delete it'
    })
  }
  
  return { message: 'Document deleted successfully' }
})