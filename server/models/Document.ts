import { getDB } from '../plugins/database'

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
    const db = getDB()
    
    const result = await db.query(
      'INSERT INTO documents (title, content, author_id, is_published) VALUES ($1, $2, $3, $4) RETURNING *',
      [
        documentData.title.trim(),
        documentData.content,
        documentData.author_id,
        documentData.is_published || false
      ]
    )
    
    return result.rows[0]
  }
  
  static async findById(id: number): Promise<Document | null> {
    const db = getDB()
    const result = await db.query(
      'SELECT * FROM documents WHERE id = $1',
      [id]
    )
    
    return result.rows[0] || null
  }
  
  static async findByAuthor(authorId: number): Promise<Document[]> {
    const db = getDB()
    const result = await db.query(
      'SELECT * FROM documents WHERE author_id = $1 ORDER BY created_at DESC',
      [authorId]
    )
    
    return result.rows
  }
  
  static async update(id: number, updateData: UpdateDocumentData): Promise<Document | null> {
    const db = getDB()
    
    const setParts = []
    const values = []
    let paramIndex = 1
    
    if (updateData.title !== undefined) {
      setParts.push(`title = $${paramIndex++}`)
      values.push(updateData.title.trim())
    }
    
    if (updateData.content !== undefined) {
      setParts.push(`content = $${paramIndex++}`)
      values.push(updateData.content)
    }
    
    if (updateData.is_published !== undefined) {
      setParts.push(`is_published = $${paramIndex++}`)
      values.push(updateData.is_published)
    }
    
    if (setParts.length === 0) {
      return this.findById(id)
    }
    
    setParts.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(id)
    
    const result = await db.query(
      `UPDATE documents SET ${setParts.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    )
    
    return result.rows[0] || null
  }
  
  static async delete(id: number): Promise<boolean> {
    const db = getDB()
    const result = await db.query(
      'DELETE FROM documents WHERE id = $1',
      [id]
    )
    
    return result.rowCount !== null && result.rowCount > 0
  }
  
  static async findByAuthorAndId(authorId: number, documentId: number): Promise<Document | null> {
    const db = getDB()
    const result = await db.query(
      'SELECT * FROM documents WHERE id = $1 AND author_id = $2',
      [documentId, authorId]
    )
    
    return result.rows[0] || null
  }
}