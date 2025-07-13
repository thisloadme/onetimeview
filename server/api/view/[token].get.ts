import { SharedLink } from '~/server/models/SharedLink'
import { Document } from '~/server/models/Document'

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')
  
  const sharedLink = await SharedLink.findOne({ 
    token,
    isActive: true,
    expiresAt: { $gt: new Date() }
  }).populate({
    path: 'document',
    select: 'title content'
  })
  
  if (!sharedLink) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Link not found or expired'
    })
  }
  
  if (sharedLink.currentAccesses >= sharedLink.maxAccesses) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Maximum access limit reached'
    })
  }
  
  // Increment access count
  sharedLink.currentAccesses += 1
  
  // Deactivate if max accesses reached
  if (sharedLink.currentAccesses >= sharedLink.maxAccesses) {
    sharedLink.isActive = false
  }
  
  await sharedLink.save()
  
  return {
    document: sharedLink.document,
    accessInfo: {
      currentAccesses: sharedLink.currentAccesses,
      maxAccesses: sharedLink.maxAccesses,
      remainingAccesses: sharedLink.maxAccesses - sharedLink.currentAccesses
    }
  }
})