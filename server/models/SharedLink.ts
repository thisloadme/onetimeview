import { getDb, saveDb, generateId } from '../utils/fileStore'

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
    const db = getDb()
    
    const newLink: SharedLink = {
      id: generateId(db.shared_links),
      document_id: linkData.document_id,
      token: linkData.token,
      max_accesses: linkData.max_accesses,
      current_accesses: linkData.current_accesses || 0,
      is_active: linkData.is_active !== undefined ? linkData.is_active : true,
      expires_at: linkData.expires_at,
      created_at: new Date(),
      updated_at: new Date()
    }
    
    db.shared_links.push(newLink)
    await saveDb()
    
    return newLink
  }
  
  static async findByToken(token: string): Promise<SharedLink | null> {
    const db = getDb()
    const link = db.shared_links.find(l => l.token === token)
    return link || null
  }
  
  static async findByDocumentId(documentId: number): Promise<SharedLink[]> {
    const db = getDb()
    const links = db.shared_links.filter(l => l.document_id === documentId)
    // SQL had ORDER BY created_at DESC
    return links.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }
  
  static async incrementAccess(id: number): Promise<SharedLink | null> {
    const db = getDb()
    const link = db.shared_links.find(l => l.id === id)
    if (!link) return null
    
    link.current_accesses += 1
    link.updated_at = new Date()
    await saveDb()
    
    return link
  }
  
  static async deactivate(id: number): Promise<SharedLink | null> {
    const db = getDb()
    const link = db.shared_links.find(l => l.id === id)
    if (!link) return null
    
    link.is_active = false
    link.updated_at = new Date()
    await saveDb()
    
    return link
  }
  
  static async findActiveByToken(token: string): Promise<SharedLink | null> {
    const db = getDb()
    const now = new Date()
    const link = db.shared_links.find(l => 
      l.token === token && 
      l.is_active === true && 
      new Date(l.expires_at) > now
    )
    return link || null
  }
  
  static async delete(id: number): Promise<boolean> {
    const db = getDb()
    const initialLength = db.shared_links.length
    db.shared_links = db.shared_links.filter(l => l.id !== id)
    
    if (db.shared_links.length !== initialLength) {
      await saveDb()
      return true
    }
    return false
  }
  
  static async cleanupExpired(): Promise<number> {
    const db = getDb()
    const now = new Date()
    const initialLength = db.shared_links.length
    
    db.shared_links = db.shared_links.filter(l => new Date(l.expires_at) > now)
    
    const removedCount = initialLength - db.shared_links.length
    
    if (removedCount > 0) {
      await saveDb()
    }
    
    return removedCount
  }
}