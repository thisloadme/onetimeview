import { getDB } from '../plugins/database'

export interface DocumentAccess {
  id: number
  document_id: number
  shared_link_id: number | null
  accessed_at: Date
  ip_address: string | null
  user_agent: string | null
  access_type: 'shared_link' | 'direct'
  created_at: Date
  updated_at: Date
}

export interface CreateDocumentAccessData {
  document_id: number
  shared_link_id?: number | null
  ip_address?: string | null
  user_agent?: string | null
  access_type?: 'shared_link' | 'direct'
}

export class DocumentAccessModel {
  static async create(accessData: CreateDocumentAccessData): Promise<DocumentAccess> {
    const db = getDB()
    
    const result = await db.query(
      'INSERT INTO document_accesses (document_id, shared_link_id, ip_address, user_agent, access_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [
        accessData.document_id,
        accessData.shared_link_id || null,
        accessData.ip_address || null,
        accessData.user_agent || null,
        accessData.access_type || 'shared_link'
      ]
    )
    
    return result.rows[0]
  }
  
  static async findByDocumentId(documentId: number, limit: number = 50, offset: number|null = null): Promise<DocumentAccess[]> {
    const db = getDB()
    const result = await db.query(
      'SELECT * FROM document_accesses WHERE document_id = $1 ORDER BY accessed_at DESC LIMIT $2 OFFSET $3',
      [documentId, limit, offset || 0]
    )
    
    return result.rows
  }
  
  static async findBySharedLinkId(sharedLinkId: number, limit: number = 50): Promise<DocumentAccess[]> {
    const db = getDB()
    const result = await db.query(
      'SELECT * FROM document_accesses WHERE shared_link_id = $1 ORDER BY accessed_at DESC LIMIT $2',
      [sharedLinkId, limit]
    )
    
    return result.rows
  }
  
  static async countByDocumentId(documentId: number): Promise<number> {
    const db = getDB()
    const result = await db.query(
      'SELECT COUNT(*) as count FROM document_accesses WHERE document_id = $1',
      [documentId]
    )
    
    return parseInt(result.rows[0].count)
  }
  
  static async countBySharedLinkId(sharedLinkId: number): Promise<number> {
    const db = getDB()
    const result = await db.query(
      'SELECT COUNT(*) as count FROM document_accesses WHERE shared_link_id = $1',
      [sharedLinkId]
    )
    
    return parseInt(result.rows[0].count)
  }
  
  static async getAccessStats(documentId: number): Promise<{
    total_accesses: number
    shared_link_accesses: number
    direct_accesses: number
    unique_ips: number
  }> {
    const db = getDB()
    const result = await db.query(`
      SELECT 
        COUNT(*) as total_accesses,
        COUNT(CASE WHEN access_type = 'shared_link' THEN 1 END) as shared_link_accesses,
        COUNT(CASE WHEN access_type = 'direct' THEN 1 END) as direct_accesses,
        COUNT(DISTINCT ip_address) as unique_ips
      FROM document_accesses 
      WHERE document_id = $1
    `, [documentId])
    
    const row = result.rows[0]
    return {
      total_accesses: parseInt(row.total_accesses),
      shared_link_accesses: parseInt(row.shared_link_accesses),
      direct_accesses: parseInt(row.direct_accesses),
      unique_ips: parseInt(row.unique_ips)
    }
  }
}