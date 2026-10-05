var mongoose = require('mongoose')

const todosSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    isCompleted: {
      type: Boolean,
      required: true,
      default: false,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserToDo',
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

const TodosModel = mongoose.model('todosapp', todosSchema)

module.exports = TodosModel
