const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserMineSpace',
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: '',
    },

    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },

    dueDate: {
      type: Date,
      default: null,
    },

    time: {
      type: String,
      trim: true,
      default: '',
    },

    completed: {
      type: Boolean,
      default: false,
    },

    archived: {
      type: Boolean,
      default: false,
    },

    archivedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

const TodoModel = mongoose.model('TodoMineSpace', todoSchema)

module.exports = TodoModel
