import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Read existing data from database.json if it exists
  const dbFilePath = path.resolve(__dirname, '..', 'data', 'database.json')
  let legacyData: any = null

  if (fs.existsSync(dbFilePath)) {
    try {
      const raw = fs.readFileSync(dbFilePath, 'utf-8')
      legacyData = JSON.parse(raw)
      console.log('📦 Found legacy database.json with data')
    } catch (e) {
      console.log('⚠️  Could not parse database.json, starting fresh')
    }
  }

  // Seed users
  if (legacyData?.users?.length > 0) {
    for (const user of legacyData.users) {
      const existing = await prisma.user.findUnique({ where: { email: user.email } })
      if (!existing) {
        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            password: user.password,
            name: user.name,
            created_at: new Date(user.created_at),
            updated_at: new Date(user.updated_at)
          }
        })
        console.log(`  ✓ User: ${user.email}`)
      }
    }
  }

  // Reset sequences for autoincrement
  await prisma.$executeRawUnsafe(`SELECT setval('"User_id_seq"', (SELECT MAX(id) FROM "User"))`)

  // Seed documents
  if (legacyData?.documents?.length > 0) {
    // Re-create documents with proper author_id references
    for (const doc of legacyData.documents) {
      await prisma.document.create({
        data: {
          id: doc.id,
          title: doc.title,
          content: doc.content,
          author_id: doc.author_id || null,
          is_published: doc.is_published ?? false,
          total_views: doc.total_views ?? 0,
          shared_links_count: doc.shared_links_count ?? 0,
          created_at: new Date(doc.created_at),
          updated_at: new Date(doc.updated_at)
        }
      })
      console.log(`  ✓ Document: ${doc.title.substring(0, 40)}`)
    }

    await prisma.$executeRawUnsafe(`SELECT setval('"Document_id_seq"', (SELECT MAX(id) FROM "Document"))`)
  } else {
    // Create sample seed data
    const password = await bcrypt.hash('password123', 12)
    const user = await prisma.user.upsert({
      where: { email: 'test@onetimeview.com' },
      update: {},
      create: {
        email: 'test@onetimeview.com',
        password,
        name: 'Test User'
      }
    })
    console.log(`  ✓ Created test user: ${user.email} (password: password123)`)

    await prisma.document.create({
      data: {
        title: 'Welcome to OneTimeView',
        content: '# Welcome\n\nThis is your first document! You can create **secure** links that expire after a set number of views.\n\n## How it works\n\n1. Write your content\n2. Set access limits\n3. Share the link securely',
        author_id: user.id,
        is_published: true
      }
    })
    console.log('  ✓ Created sample document')
  }

  // Seed shared links
  if (legacyData?.shared_links?.length > 0) {
    for (const link of legacyData.shared_links) {
      await prisma.sharedLink.create({
        data: {
          id: link.id,
          document_id: link.document_id,
          token: link.token,
          max_accesses: link.max_accesses,
          current_accesses: link.current_accesses ?? 0,
          is_active: link.is_active ?? true,
          expires_at: new Date(link.expires_at),
          created_at: new Date(link.created_at),
          updated_at: new Date(link.updated_at)
        }
      })
      console.log(`  ✓ SharedLink: ${link.token.substring(0, 16)}...`)
    }

    await prisma.$executeRawUnsafe(`SELECT setval('"SharedLink_id_seq"', (SELECT MAX(id) FROM "SharedLink"))`)
  }

  // Seed document accesses
  if (legacyData?.document_accesses?.length > 0) {
    for (const access of legacyData.document_accesses) {
      await prisma.documentAccess.create({
        data: {
          id: access.id,
          document_id: access.document_id,
          shared_link_id: access.shared_link_id || null,
          accessed_at: new Date(access.accessed_at),
          ip_address: access.ip_address || null,
          user_agent: access.user_agent || null,
          access_type: access.access_type || 'shared_link',
          created_at: new Date(access.created_at),
          updated_at: new Date(access.updated_at)
        }
      })
    }

    await prisma.$executeRawUnsafe(`SELECT setval('"DocumentAccess_id_seq"', (SELECT MAX(id) FROM "DocumentAccess"))`)
  }

  console.log('\n✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
