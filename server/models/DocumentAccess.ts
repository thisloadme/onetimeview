import { getDb, saveDb, generateId } from '../utils/fileStore'

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
    const db = getDb()
    
    const newAccess: DocumentAccess = {
      id: generateId(db.document_accesses),
      document_id: accessData.document_id,
      shared_link_id: accessData.shared_link_id || null,
      ip_address: accessData.ip_address || null,
      user_agent: accessData.user_agent || null,
      access_type: accessData.access_type || 'shared_link',
      accessed_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    }
    
    db.document_accesses.push(newAccess)
    await saveDb()
    
    return newAccess
  }
  
  static async findByDocumentId(documentId: number, limit: number = 50, offset: number|null = null): Promise<DocumentAccess[]> {
    const db = getDb()
    const accesses = db.document_accesses.filter(a => a.document_id === documentId)
    accesses.sort((a, b) => new Date(b.accessed_at).getTime() - new Date(a.accessed_at).getTime())
    
    const start = offset || 0
    return accesses.slice(start, start + limit)
  }
  
  static async findBySharedLinkId(sharedLinkId: number, limit: number = 50): Promise<DocumentAccess[]> {
    const db = getDb()
    const accesses = db.document_accesses.filter(a => a.shared_link_id === sharedLinkId)
    accesses.sort((a, b) => new Date(b.accessed_at).getTime() - new Date(a.accessed_at).getTime())
    
    return accesses.slice(0, limit)
  }
  
  static async countByDocumentId(documentId: number): Promise<number> {
    const db = getDb()
    return db.document_accesses.filter(a => a.document_id === documentId).length
  }
  
  static async countBySharedLinkId(sharedLinkId: number): Promise<number> {
    const db = getDb()
    return db.document_accesses.filter(a => a.shared_link_id === sharedLinkId).length
  }
  
  static async getAccessStats(documentId: number): Promise<{
    total_accesses: number
    shared_link_accesses: number
    direct_accesses: number
    unique_ips: number
  }> {
    const db = getDb()
    const accesses = db.document_accesses.filter(a => a.document_id === documentId)
    
    const sharedLinkAccesses = accesses.filter(a => a.access_type === 'shared_link').length
    const directAccesses = accesses.filter(a => a.access_type === 'direct').length
    
    const uniqueIps = new Set(accesses.map(a => a.ip_address).filter(Boolean))
    
    return {
      total_accesses: accesses.length,
      shared_link_accesses: sharedLinkAccesses,
      direct_accesses: directAccesses,
      unique_ips: uniqueIps.size
    }
  }
}