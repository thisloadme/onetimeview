import { UserModel } from '~/server/models/User'
import { generateToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event)
    
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required'
      })
    }
    
    const user = await UserModel.findByEmail(email)
    if (!user || !(await UserModel.comparePassword(password, user.password))) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }
    
    const token = generateToken(user.id.toString())
    
    setCookie(event, 'auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Login failed'
    })
  }
})