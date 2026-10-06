const mongoose = require('mongoose')

const passwordResetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserMineSpace',
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    resetTokenHash: {
      type: String,
      default: null,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const PasswordReset = mongoose.model('PasswordResetMineSpace', passwordResetSchema)

module.exports = PasswordReset
