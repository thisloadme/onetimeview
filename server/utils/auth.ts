import jwt from 'jsonwebtoken'
import type { User } from '~/server/models/User'

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

export async function getCurrentUser(event: any) {
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (!token) return null
  
  const decoded = verifyToken(token)
  if (!decoded) return null
  
  const { User } = await import('~/server/models/User')
  return await User.findById(decoded.userId).select('-password')
}