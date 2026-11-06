import { DocumentModel } from '~/server/models/Document'
import { SharedLinkModel } from '~/server/models/SharedLink'
import { getCurrentUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const documentId = Number(getRouterParam(event, 'id'))
  const linkId = Number(getRouterParam(event, 'linkId'))
  if (!Number.isInteger(documentId) || documentId < 1 || !Number.isInteger(linkId) || linkId < 1) {
    throw createError({ statusCode: 400, statusMessage: 'Document and link IDs are required' })
  }

  const document = await DocumentModel.findByAuthorAndId(user.id, documentId)
  if (!document) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found or you do not have permission to manage its links' })
  }

  const revoked = await SharedLinkModel.deactivateForDocument(linkId, documentId)
  if (!revoked) {
    throw createError({ statusCode: 404, statusMessage: 'Active link not found' })
  }

  return { success: true }
})
