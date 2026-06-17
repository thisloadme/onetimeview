import { DocumentModel } from '~/server/models/Document'
import { SharedLinkModel } from '~/server/models/SharedLink'
import crypto from 'crypto'

const MAX_TITLE_LENGTH = 200
const MAX_CONTENT_LENGTH = 50 * 1024 // 50KB

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

  // ⚠️ P1.8: Content length validation
  if (title.trim().length > MAX_TITLE_LENGTH) {
    throw createError({
      statusCode: 400,
      statusMessage: `Title must be ${MAX_TITLE_LENGTH} characters or less`
    })
  }

  if (content.trim().length > MAX_CONTENT_LENGTH) {
    throw createError({
      statusCode: 400,
      statusMessage: `Content must be ${MAX_CONTENT_LENGTH / 1024}KB or less`
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
  expiresAt.setTime(expiresAt.getTime() + (expiresIn * 60 * 60 * 1000))

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
  const config = useRuntimeConfig()
  const baseUrl = process.env.NODE_ENV === 'production'
    ? config.public.baseUrl
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
