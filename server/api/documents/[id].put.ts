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

  const { title, content } = await readBody(event)

  if (!title || !content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title and content are required'
    })
  }

  // ⚠️ FIX P0.2: Verify ownership before update
  const existing = await DocumentModel.findByAuthorAndId(user.id, parseInt(documentId))
  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Document not found or you do not have permission to edit it'
    })
  }

  const updatedDocument = await DocumentModel.update(
    parseInt(documentId),
    {
      title,
      content
    }
  )

  if (!updatedDocument) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Document not found'
    })
  }

  return { document: updatedDocument }
})
