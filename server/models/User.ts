import bcrypt from 'bcryptjs'
import { getDb, saveDb, generateId } from '../utils/fileStore'

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
    const db = getDb()
    const hashedPassword = await bcrypt.hash(userData.password, 12)
    
    const newUser: User = {
      id: generateId(db.users),
      email: userData.email.toLowerCase().trim(),
      password: hashedPassword,
      name: userData.name.trim(),
      created_at: new Date(),
      updated_at: new Date()
    }
    
    db.users.push(newUser)
    await saveDb()
    
    return newUser
  }
  
  static async findByEmail(email: string): Promise<User | null> {
    const db = getDb()
    const searchEmail = email.toLowerCase().trim()
    const user = db.users.find(u => u.email === searchEmail)
    return user || null
  }
  
  static async findById(id: number): Promise<User | null> {
    const db = getDb()
    const user = db.users.find(u => u.id === id)
    return user || null
  }
  
  static async comparePassword(candidatePassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, hashedPassword)
  }
  
  static async updatePassword(id: number, newPassword: string): Promise<User> {
    const db = getDb()
    const user = db.users.find(u => u.id === id)
    if (!user) throw new Error('User not found')
    
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    user.password = hashedPassword
    user.updated_at = new Date()
    await saveDb()
    
    return user
  }
}