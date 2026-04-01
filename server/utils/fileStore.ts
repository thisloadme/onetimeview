import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'

import type { User } from '../models/User'
import type { Document } from '../models/Document'
import type { DocumentAccess } from '../models/DocumentAccess'
import type { SharedLink } from '../models/SharedLink'

export interface DatabaseSchema {
  users: User[]
  documents: Document[]
  document_accesses: DocumentAccess[]
  shared_links: SharedLink[]
}

const DB_FILE_PATH = path.resolve(process.cwd(), 'data', 'database.json')

let memoryDb: DatabaseSchema = {
  users: [],
  documents: [],
  document_accesses: [],
  shared_links: []
}

let isInitialized = false

const convertDates = (data: DatabaseSchema) => {
    for (const user of data.users) {
      if (user.created_at) user.created_at = new Date(user.created_at)
      if (user.updated_at) user.updated_at = new Date(user.updated_at)
    }
    for (const doc of data.documents) {
      if (doc.created_at) doc.created_at = new Date(doc.created_at)
      if (doc.updated_at) doc.updated_at = new Date(doc.updated_at)
    }
    for (const access of data.document_accesses) {
      if (access.accessed_at) access.accessed_at = new Date(access.accessed_at)
      if (access.created_at) access.created_at = new Date(access.created_at)
      if (access.updated_at) access.updated_at = new Date(access.updated_at)
    }
    for (const link of data.shared_links) {
      if (link.expires_at) link.expires_at = new Date(link.expires_at)
      if (link.created_at) link.created_at = new Date(link.created_at)
      if (link.updated_at) link.updated_at = new Date(link.updated_at)
    }
}

export const initDb = async () => {
    if (isInitialized) return
    const dir = path.dirname(DB_FILE_PATH)
    
    try {
        await fs.mkdir(dir, { recursive: true })
    } catch {}

    try {
        if (fsSync.existsSync(DB_FILE_PATH)) {
            const fileData = await fs.readFile(DB_FILE_PATH, 'utf-8')
            memoryDb = JSON.parse(fileData)
            convertDates(memoryDb)
        } else {
            await fs.writeFile(DB_FILE_PATH, JSON.stringify(memoryDb, null, 2), 'utf-8')
        }
        isInitialized = true
        console.log('✅ File Database initialized')
    } catch (error) {
        console.error('❌ File Database initialization error:', error)
    }
}

export const getDb = (): DatabaseSchema => {
    if (!isInitialized) {
        if (fsSync.existsSync(DB_FILE_PATH)) {
            const fileData = fsSync.readFileSync(DB_FILE_PATH, 'utf-8')
            memoryDb = JSON.parse(fileData)
            convertDates(memoryDb)
            isInitialized = true
        }
    }
    return memoryDb
}

export const saveDb = async () => {
    try {
        await fs.writeFile(DB_FILE_PATH, JSON.stringify(memoryDb, null, 2), 'utf-8')
    } catch (error) {
        console.error('❌ File Database save error:', error)
    }
}

export const generateId = (collection: any[]): number => {
    if (!collection || collection.length === 0) return 1
    const maxId = Math.max(...collection.map(item => item.id || 0))
    return maxId + 1
}
