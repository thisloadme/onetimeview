import mongoose from 'mongoose'

const documentAccessSchema = new mongoose.Schema({
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  sharedLink: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SharedLink',
    required: false // Optional, for direct access vs shared link access
  },
  accessedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    required: false
  },
  userAgent: {
    type: String,
    required: false
  },
  accessType: {
    type: String,
    enum: ['shared_link', 'direct'],
    default: 'shared_link'
  }
}, {
  timestamps: true
})

// Index for efficient querying
documentAccessSchema.index({ document: 1, accessedAt: -1 })
documentAccessSchema.index({ sharedLink: 1, accessedAt: -1 })

export const DocumentAccess = mongoose.models.DocumentAccess || mongoose.model('DocumentAccess', documentAccessSchema) 