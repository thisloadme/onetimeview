import { getDB } from '~/server/plugins/database'
import { getCurrentUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  
  const db = getDB()
  
  const result = await db.query(
    `SELECT 
      d.*,
      COALESCE(SUM(da.access_count), 0) as total_views,
      COUNT(DISTINCT sl.id) as shared_links_count
    FROM documents d
    LEFT JOIN document_access da ON d.id = da.document_id
    LEFT JOIN shared_links sl ON d.id = sl.document_id AND sl.is_active = true
    WHERE d.author_id = $1
    GROUP BY d.id
    ORDER BY d.created_at DESC`,
    [user.id]
  )
  
  return { documents: result.rows }
})
