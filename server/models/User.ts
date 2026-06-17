import bcrypt from 'bcryptjs'
import prisma from '../utils/prisma'

export interface CreateUserData {
  email: string
  password: string
  name: string
}

export class UserModel {
  static async create(userData: CreateUserData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    const user = await prisma.user.create({
      data: {
        email: userData.email.toLowerCase().trim(),
        password: hashedPassword,
        name: userData.name.trim()
      }
    })

    return user
  }

  static async findByEmail(email: string) {
    const searchEmail = email.toLowerCase().trim()
    const user = await prisma.user.findUnique({
      where: { email: searchEmail }
    })
    return user
  }

  static async findById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id }
    })
    return user
  }

  static async comparePassword(candidatePassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, hashedPassword)
  }

  static async updatePassword(id: number, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    const user = await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword
      }
    })

    return user
  }
}
