const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserMineSpace',
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 200,
      default: 'Untitled Note',
    },
    content: {
      type: String,
      default: '',
    },
    dateKey: {
      type: String,
      required: true,
      index: true,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

noteSchema.index({ userId: 1, dateKey: 1, archived: 1 })

const NoteModel = mongoose.model('NoteBookMineSpace', noteSchema)

module.exports = NoteModel
