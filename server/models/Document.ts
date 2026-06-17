import prisma from '../utils/prisma'

export interface CreateDocumentData {
  title: string
  content: string
  author_id?: number | null
  is_published?: boolean
}

export interface UpdateDocumentData {
  title?: string
  content?: string
  is_published?: boolean
}

export class DocumentModel {
  static async create(documentData: CreateDocumentData) {
    const document = await prisma.document.create({
      data: {
        title: documentData.title.trim(),
        content: documentData.content,
        author_id: documentData.author_id ?? null,
        is_published: documentData.is_published ?? false
      }
    })

    return document
  }

  static async findById(id: number) {
    const document = await prisma.document.findUnique({
      where: { id }
    })
    return document
  }

  static async findByAuthor(authorId: number) {
    const documents = await prisma.document.findMany({
      where: { author_id: authorId },
      orderBy: { created_at: 'desc' }
    })
    return documents
  }

  static async update(id: number, updateData: UpdateDocumentData) {
    const data: any = {}
    if (updateData.title !== undefined) data.title = updateData.title.trim()
    if (updateData.content !== undefined) data.content = updateData.content
    if (updateData.is_published !== undefined) data.is_published = updateData.is_published

    try {
      const document = await prisma.document.update({
        where: { id },
        data
      })
      return document
    } catch (e: any) {
      if (e.code === 'P2025') return null
      throw e
    }
  }

  static async delete(id: number) {
    try {
      await prisma.document.delete({
        where: { id }
      })
      return true
    } catch (e: any) {
      if (e.code === 'P2025') return false
      throw e
    }
  }

  static async findByAuthorAndId(authorId: number, documentId: number) {
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        author_id: authorId
      }
    })
    return document
  }

  static async incrementViews(id: number) {
    const document = await prisma.document.update({
      where: { id },
      data: {
        total_views: { increment: 1 }
      }
    })
    return document
  }
}
