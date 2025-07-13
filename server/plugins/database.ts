import mongoose from 'mongoose'

export default async () => {
  try {
    const config = useRuntimeConfig()
    await mongoose.connect(config.mongoUri)
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
  }
}