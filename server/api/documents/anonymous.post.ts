import { DocumentModel } from '~/server/models/Document'
import { SharedLinkModel } from '~/server/models/SharedLink'
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { title, content, maxAccesses, expiresIn } = body

  // Validate required fields
  if (!title || !title.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title is required'
    })
  }

  if (!content || !content.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Content is required'
    })
  }

  if (!maxAccesses || maxAccesses < 1 || maxAccesses > 100) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Max accesses must be between 1 and 100'
    })
  }

  if (!expiresIn || expiresIn <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Expiration time is required'
    })
  }

  // Create document with author_id set to NULL (anonymous)
  const document = await DocumentModel.create({
    title: title.trim(),
    content: content.trim(),
    author_id: null,
    is_published: true
  })

  // Generate unique token for sharing
  const token = crypto.randomBytes(32).toString('hex')

  // Calculate expiration date
  const expiresAt = new Date()
  expiresAt.setTime(expiresAt.getTime() + (expiresIn * 60 * 60 * 1000)) // Convert hours to milliseconds

  // Create shared link
  const sharedLink = await SharedLinkModel.create({
    document_id: document.id,
    token,
    max_accesses: maxAccesses,
    current_accesses: 0,
    is_active: true,
    expires_at: expiresAt
  })

  // Construct the full URL
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.BASE_URL || 'https://yourdomain.com'
    : 'http://localhost:3000'

  return {
    document: {
      id: document.id,
      title: document.title
    },
    sharedLink: {
      token,
      maxAccesses,
      currentAccesses: 0,
      remainingAccesses: maxAccesses,
      expiresAt,
      url: `${baseUrl}/view/${token}`
    }
  }
})