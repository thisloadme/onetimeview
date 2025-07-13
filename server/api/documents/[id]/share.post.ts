import { Document } from '~/server/models/Document'
import { SharedLink } from '~/server/models/SharedLink'
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
  
  const document = await Document.findOne({ _id: documentId, author: user._id })
  
  if (!document) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Document not found'
    })
  }
  
  // Generate unique token
  const token = crypto.randomBytes(32).toString('hex')
  
  // Calculate expiration date
  const expiresAt = new Date()
  expiresAt.setTime(expiresAt.getTime() + (expiresIn * 60 * 60 * 1000)) // Convert hours to milliseconds
  
  // Create shared link
  const sharedLink = await SharedLink.create({
    document: documentId,
    token,
    maxAccesses,
    expiresAt
  })
  
  // Mark document as published
  await Document.findByIdAndUpdate(documentId, { isPublished: true })
  
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