import { Document } from '~/server/models/Document'
import { getCurrentUser } from '~/server/utils/auth'

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
  
  const document = await Document.create({
    title,
    content,
    author: user._id
  })
  
  return { document }
})