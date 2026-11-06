import { DocumentModel } from '~/server/models/Document'
import { SharedLinkModel } from '~/server/models/SharedLink'
import { getCurrentUser } from '~/server/utils/auth'
import { hashOptionalPassphrase } from '~/server/utils/passphrase'
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
  const { maxAccesses, expiresIn, passphrase } = await readBody(event)

  if (!Number.isInteger(maxAccesses) || maxAccesses < 1 || maxAccesses > 1000 ||
      !Number.isInteger(expiresIn) || expiresIn < 1 || expiresIn > 720) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Choose 1 to 1000 views and an expiration between 1 hour and 30 days'
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
  const passphraseHash = await hashOptionalPassphrase(passphrase)

  // Create shared link
  const sharedLink = await SharedLinkModel.create({
    document_id: parseInt(documentId),
    token,
    max_accesses: maxAccesses,
    expires_at: expiresAt,
    passphrase_hash: passphraseHash
  })

  // Mark document as published
  await DocumentModel.update(parseInt(documentId), { is_published: true })

  return {
    sharedLink: {
      token,
      requiresPassphrase: Boolean(passphraseHash),
      maxAccesses,
      currentAccesses: 0,
      expiresAt,
      url: `/view/${token}`
    }
  }
})
