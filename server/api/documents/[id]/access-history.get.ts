import { DocumentAccessModel } from '~/server/models/DocumentAccess'
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

  // Check if user owns the document
  const document = await DocumentModel.findByAuthorAndId(user.id, parseInt(documentId))

  if (!document) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Document not found or you do not have permission to view its access history'
    })
  }

  // Get access history with pagination
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 20
  const offset = (page - 1) * limit

  const accessHistory = await DocumentAccessModel.findByDocumentId(parseInt(documentId), limit, offset)
  const total = await DocumentAccessModel.countByDocumentId(parseInt(documentId))

  return {
    accessHistory,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
})
