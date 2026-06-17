import { DocumentModel } from '~/server/models/Document'
import { SharedLinkModel } from '~/server/models/SharedLink'
import { getCurrentUser } from '~/server/utils/auth'
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const documentId = getRouterParam(event, 'id')
  const { maxAccesses, expiresIn } = await readBody(event)

  if (!maxAccesses || !expiresIn) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Maximum accesses and expiration time are required'
    })
  }

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
      statusMessage: 'Document not found or you do not have permission to share it'
    })
  }

  // Generate unique token
  const token = crypto.randomBytes(32).toString('hex')

  // Calculate expiration date
  const expiresAt = new Date()
  expiresAt.setTime(expiresAt.getTime() + (expiresIn * 60 * 60 * 1000))

  // Create shared link
  const sharedLink = await SharedLinkModel.create({
    document_id: parseInt(documentId),
    token,
    max_accesses: maxAccesses,
    expires_at: expiresAt
  })

  // Mark document as published
  await DocumentModel.update(parseInt(documentId), { is_published: true })

  return {
    sharedLink: {
      token,
      maxAccesses,
      currentAccesses: 0,
      expiresAt,
      url: `/view/${token}`
    }
  }
})
