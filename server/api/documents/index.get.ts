import { getDb } from '~/server/utils/fileStore'
import { getCurrentUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  
  const db = getDb()
  
  const userDocuments = db.documents.filter(d => d.author_id === user.id)
  
  const result = userDocuments.map(doc => {
    const views = db.document_accesses.filter(da => da.document_id === doc.id).length
    
    // In SQL it was COUNT(DISTINCT sl.id) which equivalent to length of unique links
    const sharedLinks = db.shared_links.filter(sl => sl.document_id === doc.id && sl.is_active === true)
    
    return {
      ...doc,
      total_views: views,
      shared_links_count: sharedLinks.length
    }
  })
  
  result.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
  
  return { documents: result }
})
