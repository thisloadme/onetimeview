import bcrypt from 'bcryptjs'
import { getDB } from '../plugins/database'

export interface User {
  id: number
  email: string
  password: string
  name: string
  created_at: Date
  updated_at: Date
}

export interface CreateUserData {
  email: string
  password: string
  name: string
}

export class UserModel {
  static async create(userData: CreateUserData): Promise<User> {
    const db = getDB()
    const hashedPassword = await bcrypt.hash(userData.password, 12)
    
    const result = await db.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
      [userData.email.toLowerCase().trim(), hashedPassword, userData.name.trim()]
    )
    
    return result.rows[0]
  }
  
  static async findByEmail(email: string): Promise<User | null> {
    const db = getDB()
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    )
    
    return result.rows[0] || null
  }
  
  static async findById(id: number): Promise<User | null> {
    const db = getDB()
    const result = await db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    )
    
    return result.rows[0] || null
  }
  
  static async comparePassword(candidatePassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, hashedPassword)
  }
  
  static async updatePassword(id: number, newPassword: string): Promise<User> {
    const db = getDB()
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    const result = await db.query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [hashedPassword, id]
    )
    
    return result.rows[0]
  }
}