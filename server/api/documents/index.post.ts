import { DocumentModel } from '~/server/models/Document'
import { getCurrentUser } from '~/server/utils/auth'

const MAX_TITLE_LENGTH = 200
const MAX_CONTENT_LENGTH = 50 * 1024 // 50KB

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const { title, content } = await readBody(event)

  if (!title || !content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title and content are required'
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

  const document = await DocumentModel.create({
    title,
    content,
    author_id: user.id
  })

  return { document }
})
