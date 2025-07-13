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
  
  const documents = await Document.find({ author: user._id })
    .sort({ updatedAt: -1 })
    .select('title content isPublished createdAt updatedAt')
  
  return { documents }
})