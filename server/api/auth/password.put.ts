import bcrypt from 'bcryptjs'
import { UserModel } from '~/server/models/User'
import { getCurrentUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const { currentPassword, newPassword } = await readBody(event)

  if (!currentPassword || !newPassword) {
    throw createError({ statusCode: 400, statusMessage: 'Current password and new password are required' })
  }

  if (newPassword.length < 6) {
    throw createError({ statusCode: 400, statusMessage: 'New password must be at least 6 characters' })
  }

  // Verify current password
  const fullUser = await UserModel.findById(user.id)
  if (!fullUser) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  const valid = await UserModel.comparePassword(currentPassword, fullUser.password)
  if (!valid) {
    throw createError({ statusCode: 400, statusMessage: 'Current password is incorrect' })
  }

  // Update password
  await UserModel.updatePassword(user.id, newPassword)

  return { message: 'Password updated successfully' }
})
