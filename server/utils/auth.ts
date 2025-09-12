import jwt from 'jsonwebtoken'
import type { User } from '~/server/models/User'
import { UserModel } from '~/server/models/User'

export function generateToken(userId: string) {
  const config = useRuntimeConfig()
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  const config = useRuntimeConfig()
  try {
    return jwt.verify(token, config.jwtSecret) as { userId: string }
  } catch (error) {
    return null
  }
}

export async function getCurrentUser(event: any): Promise<User | null> {
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (!token) return null
  
  const decoded = verifyToken(token)
  if (!decoded) return null
  
  const user = await UserModel.findById(parseInt(decoded.userId))
  if (!user) return null
  
  // Return user without password for security
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    created_at: user.created_at,
    updated_at: user.updated_at,
    password: '' // Don't expose password
  }
}