import bcrypt from 'bcryptjs'
import { getCurrentUser } from '~/server/utils/auth'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const { name } = await readBody(event)

  if (!name || !name.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Name is required' })
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { name: name.trim() }
  })

  return {
    user: {
      id: updated.id,
      email: updated.email,
      name: updated.name
    }
  }
})
