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

  // ⚠️ FIX P0.3: Verify ownership before delete
  const existing = await DocumentModel.findByAuthorAndId(user.id, parseInt(documentId))
  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Document not found or you do not have permission to delete it'
    })
  }

  const deleted = await DocumentModel.delete(parseInt(documentId))

  if (!deleted) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Document not found'
    })
  }

  return { message: 'Document deleted successfully' }
})
