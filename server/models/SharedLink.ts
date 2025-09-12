import { getDB } from '../plugins/database'

export interface SharedLink {
  id: number
  document_id: number
  token: string
  max_accesses: number
  current_accesses: number
  is_active: boolean
  expires_at: Date
  created_at: Date
  updated_at: Date
}

export interface CreateSharedLinkData {
  document_id: number
  token: string
  max_accesses: number
  expires_at: Date
  current_accesses?: number
  is_active?: boolean
}

export class SharedLinkModel {
  static async create(linkData: CreateSharedLinkData): Promise<SharedLink> {
    const db = getDB()
    
    const result = await db.query(
      'INSERT INTO shared_links (document_id, token, max_accesses, current_accesses, is_active, expires_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        linkData.document_id,
        linkData.token,
        linkData.max_accesses,
        linkData.current_accesses || 0,
        linkData.is_active !== undefined ? linkData.is_active : true,
        linkData.expires_at
      ]
    )
    
    return result.rows[0]
  }
  
  static async findByToken(token: string): Promise<SharedLink | null> {
    const db = getDB()
    const result = await db.query(
      'SELECT * FROM shared_links WHERE token = $1',
      [token]
    )
    
    return result.rows[0] || null
  }
  
  static async findByDocumentId(documentId: number): Promise<SharedLink[]> {
    const db = getDB()
    const result = await db.query(
      'SELECT * FROM shared_links WHERE document_id = $1 ORDER BY created_at DESC',
      [documentId]
    )
    
    return result.rows
  }
  
  static async incrementAccess(id: number): Promise<SharedLink | null> {
    const db = getDB()
    const result = await db.query(
      'UPDATE shared_links SET current_accesses = current_accesses + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    )
    
    return result.rows[0] || null
  }
  
  static async deactivate(id: number): Promise<SharedLink | null> {
    const db = getDB()
    const result = await db.query(
      'UPDATE shared_links SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    )
    
    return result.rows[0] || null
  }
  
  static async findActiveByToken(token: string): Promise<SharedLink | null> {
    const db = getDB()
    const result = await db.query(
      'SELECT * FROM shared_links WHERE token = $1 AND is_active = true AND expires_at > NOW()',
      [token]
    )
    
    return result.rows[0] || null
  }
  
  static async delete(id: number): Promise<boolean> {
    const db = getDB()
    const result = await db.query(
      'DELETE FROM shared_links WHERE id = $1',
      [id]
    )
    
    return result.rowCount !== null && result.rowCount > 0
  }
  
  static async cleanupExpired(): Promise<number> {
    const db = getDB()
    const result = await db.query(
      'DELETE FROM shared_links WHERE expires_at <= NOW()'
    )
    
    return result.rowCount !== null ? result.rowCount : 0
  }
}