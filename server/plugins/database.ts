import { Pool } from 'pg'

let pool: Pool | null = null

export const getDB = () => {
  if (!pool) {
    throw new Error('Database not initialized')
  }
  return pool
}

export default async () => {
  try {
    const config = useRuntimeConfig()
    
    pool = new Pool({
      host: config.dbHost,
      port: parseInt(config.dbPort),
      database: config.dbDatabase,
      user: config.dbUsername,
      password: config.dbPassword,
      ssl: false
    })
    
    // Test connection
    await pool.query('SELECT NOW()')
    console.log('✅ Connected to PostgreSQL')
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error)
  }
}