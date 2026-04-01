import { getDb, saveDb, generateId } from '../utils/fileStore'

export interface Document {
  id: number
  title: string
  content: string
  author_id: number
  is_published: boolean
  total_views: number
  shared_links_count: number
  created_at: Date
  updated_at: Date
}

export interface CreateDocumentData {
  title: string
  content: string
  author_id: number
  is_published?: boolean
}

export interface UpdateDocumentData {
  title?: string
  content?: string
  is_published?: boolean
}

export class DocumentModel {
  static async create(documentData: CreateDocumentData): Promise<Document> {
    const db = getDb()
    
    const newDocument: Document = {
      id: generateId(db.documents),
      title: documentData.title.trim(),
      content: documentData.content,
      author_id: documentData.author_id,
      is_published: documentData.is_published || false,
      total_views: 0,
      shared_links_count: 0,
      created_at: new Date(),
      updated_at: new Date()
    }
    
    db.documents.push(newDocument)
    await saveDb()
    
    return newDocument
  }
  
  static async findById(id: number): Promise<Document | null> {
    const db = getDb()
    const document = db.documents.find(d => d.id === id)
    return document || null
  }
  
  static async findByAuthor(authorId: number): Promise<Document[]> {
    const db = getDb()
    const documents = db.documents.filter(d => d.author_id === authorId)
    // SQL had ORDER BY created_at DESC
    return documents.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }
  
  static async update(id: number, updateData: UpdateDocumentData): Promise<Document | null> {
    const db = getDb()
    const document = db.documents.find(d => d.id === id)
    if (!document) return null
    
    let updated = false
    
    if (updateData.title !== undefined) {
      document.title = updateData.title.trim()
      updated = true
    }
    if (updateData.content !== undefined) {
      document.content = updateData.content
      updated = true
    }
    if (updateData.is_published !== undefined) {
      document.is_published = updateData.is_published
      updated = true
    }
    
    if (updated) {
      document.updated_at = new Date()
      await saveDb()
    }
    
    return document
  }
  
  static async delete(id: number): Promise<boolean> {
    const db = getDb()
    const initialLength = db.documents.length
    db.documents = db.documents.filter(d => d.id !== id)
    
    if (db.documents.length !== initialLength) {
      await saveDb()
      return true
    }
    return false
  }
  
  static async findByAuthorAndId(authorId: number, documentId: number): Promise<Document | null> {
    const db = getDb()
    const document = db.documents.find(d => d.id === documentId && d.author_id === authorId)
    return document || null
  }
}