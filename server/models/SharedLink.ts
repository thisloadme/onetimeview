import mongoose from 'mongoose'

const sharedLinkSchema = new mongoose.Schema({
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  maxAccesses: {
    type: Number,
    required: true,
    min: 1
  },
  currentAccesses: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
})

sharedLinkSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const SharedLink = mongoose.models.SharedLink || mongoose.model('SharedLink', sharedLinkSchema)