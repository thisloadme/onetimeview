import { User } from '~/server/models/User'
import { generateToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const { email, password, name } = await readBody(event)
    
    if (!email || !password || !name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email, password, and name are required'
      })
    }
    
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User already exists'
      })
    }
    
    const user = await User.create({ email, password, name })
    const token = generateToken(user._id.toString())
    
    setCookie(event, 'auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      token
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Registration failed'
    })
  }
})