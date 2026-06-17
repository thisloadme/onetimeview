import crypto from 'crypto'
import { UserModel } from '~/server/models/User'
import { withRateLimit } from '~/server/utils/rateLimiter'
import prisma from '~/server/utils/prisma'

export default withRateLimit(async (event) => {
  try {
    const { email } = await readBody(event)

    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email is required'
      })
    }

    const user = await UserModel.findByEmail(email)
    if (!user) {
      // Don't reveal whether email exists — return success either way
      return { message: 'If the email exists, a reset link has been sent.' }
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour expiry

    // Store in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        reset_token: resetToken,
        reset_token_expires: expiresAt
      }
    })

    // In production, send email with reset link
    // For now, log the token so the user can use it
    const config = useRuntimeConfig()
    const baseUrl = config.public.baseUrl
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`

    console.log(`🔐 Password reset requested for ${email}: ${resetUrl}`)

    return {
      message: 'If the email exists, a reset link has been sent.',
      // ⚠️ TEMPORARY: Return token in response for testing.
      // Remove for production and use email sending instead.
      resetUrl
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to process request'
    })
  }
}, { maxRequests: 3, windowSeconds: 300 })
