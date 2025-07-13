import { DocumentAccess } from '~/server/models/DocumentAccess'
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
  
  const documentId = getRouterParam(event, 'id')
  
  if (!documentId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Document ID is required'
    })
  }
  
  // Check if user owns the document
  const document = await Document.findById(documentId)
  
  if (!document) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Document not found'
    })
  }
  
  if (document.author.toString() !== user._id.toString()) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You do not have permission to view this document\'s access history'
    })
  }
  
  // Get access history with pagination
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 20
  const skip = (page - 1) * limit
  
  const accessHistory = await DocumentAccess.find({ document: documentId })
    .populate('sharedLink', 'token maxAccesses currentAccesses')
    .sort({ accessedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
  
  const total = await DocumentAccess.countDocuments({ document: documentId })
  
  return {
    accessHistory,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}) 