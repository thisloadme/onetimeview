import bcrypt from 'bcryptjs'
import prisma from '~/server/utils/prisma'
import { withRateLimit } from '~/server/utils/rateLimiter'

export default withRateLimit(async (event) => {
  try {
    const { token, password } = await readBody(event)

    if (!token || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token and new password are required'
      })
    }

    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 6 characters'
      })
    }

    // Find user by reset token
    const user = await prisma.user.findFirst({
      where: {
        reset_token: token,
        reset_token_expires: { gt: new Date() }
      }
    })

    if (!user) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid or expired reset token'
      })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        reset_token: null,
        reset_token_expires: null
      }
    })

    return { message: 'Password has been reset successfully. You can now login with your new password.' }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to reset password'
    })
  }
}, { maxRequests: 5, windowSeconds: 300 })
