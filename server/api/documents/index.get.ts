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
  
  const documents = await DocumentModel.findByAuthor(user.id)
  
  return { documents }
})