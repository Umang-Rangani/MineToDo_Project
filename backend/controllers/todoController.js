const { default: mongoose } = require('mongoose')
const TodoModel = require('../models/todos')

// POST    /todos
// GET     /todos
// GET     /todos/:id
// PUT     /todos/:id
// PUT     /todos/toggle/:id
// PUT     /todos/archive/:id
// DELETE  /todos/:id

/* create todo */
const createTodo = async (req, res) => {
  try {
    const { title, description, priority, dueDate, time } = req.body

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: 'Title is required',
      })
    }

    const todo = await TodoModel.create({
      userId: req.user.id,
      title: title.trim(),
      description: description?.trim() || '',
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      time: time || '',
    })

    return res.status(201).json({
      message: 'Todo created successfully',
      todo,
    })
  } catch (error) {
    console.error('CREATE TODO ERROR:', error)

    return res.status(500).json({
      message: 'Failed to create todo',
    })
  }
}

/* get all todos */
const getTodos = async (req, res) => {
  try {
    const todos = await TodoModel.find({
      userId: req.user.id,
      archived: false,
    }).sort({ createdAt: -1 })

    return res.status(200).json({
      todos,
    })
  } catch (error) {
    console.error('GET TODOS ERROR:', error)

    return res.status(500).json({
      message: 'Failed to fetch todos',
    })
  }
}

/* get single todo */
const getTodo = async (req, res) => {
  try {
    const todo = await TodoModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
    })

    if (!todo) {
      return res.status(404).json({
        message: 'Todo not found',
      })
    }

    return res.status(200).json({
      todo,
    })
  } catch (error) {
    console.error('GET TODO ERROR:', error)

    return res.status(500).json({
      message: 'Failed to fetch todo',
    })
  }
}

/* update todo */
const updateTodo = async (req, res) => {
  try {
    const { title, description, priority, dueDate, time } = req.body

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: 'Title is required',
      })
    }

    const todo = await TodoModel.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      {
        title: title.trim(),
        description: description?.trim() || '',
        priority: priority || 'Medium',
        dueDate: dueDate || null,
        time: time || '',
      },
      {
        new: true,
        runValidators: true,
      },
    )

    if (!todo) {
      return res.status(404).json({
        message: 'Todo not found',
      })
    }

    return res.status(200).json({
      message: 'Todo updated successfully',
      todo,
    })
  } catch (error) {
    console.error('UPDATE TODO ERROR:', error)

    return res.status(500).json({
      message: 'Failed to update todo',
    })
  }
}

/* toggle completed */
const toggleTodo = async (req, res) => {
  try {
    const todo = await TodoModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
    })

    if (!todo) {
      return res.status(404).json({
        message: 'Todo not found',
      })
    }

    todo.completed = !todo.completed

    await todo.save()

    return res.status(200).json({
      message: todo.completed ? 'Todo completed successfully' : 'Todo marked incomplete',
      todo,
    })
  } catch (error) {
    console.error('TOGGLE TODO ERROR:', error)

    return res.status(500).json({
      message: 'Failed to toggle todo',
    })
  }
}

/* toggle archive */
const toggleArchiveTodo = async (req, res) => {
  try {
    const todo = await TodoModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
    })

    if (!todo) {
      return res.status(404).json({
        message: 'Todo not found',
      })
    }

    todo.archived = !todo.archived

    todo.archivedAt = todo.archived ? new Date() : null

    await todo.save()

    return res.status(200).json({
      message: todo.archived ? 'Todo archived successfully' : 'Todo unarchived successfully',
      todo,
    })
  } catch (error) {
    console.error('TOGGLE ARCHIVE TODO ERROR:', error)

    return res.status(500).json({
      message: 'Failed to toggle archive',
    })
  }
}

/* delete todo */
const deleteTodo = async (req, res) => {
  try {
    const todo = await TodoModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    })

    if (!todo) {
      return res.status(404).json({
        message: 'Todo not found',
      })
    }

    return res.status(200).json({
      message: 'Todo deleted successfully',
    })
  } catch (error) {
    console.error('DELETE TODO ERROR:', error)

    return res.status(500).json({
      message: 'Failed to delete todo',
    })
  }
}

/* get todo history dates */
const getTodoHistoryDates = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id)

    const dates = await TodoModel.aggregate([
      {
        $match: {
          userId,
          archived: false,
          dueDate: {
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$dueDate',
              timezone: 'Asia/Kolkata',
            },
          },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ])

    return res.status(200).json({
      dates: dates.map((item) => item._id),
    })
  } catch (error) {
    console.error('GET TODO HISTORY DATES ERROR:', error)

    return res.status(500).json({
      message: 'Failed to fetch todo history dates',
    })
  }
}

/* get todos by due date */
const getTodoHistory = async (req, res) => {
  try {
    const { date } = req.query

    if (!date) {
      return res.status(400).json({
        message: 'Date is required',
      })
    }

    const startDate = new Date(`${date}T00:00:00+05:30`)
    const endDate = new Date(`${date}T23:59:59.999+05:30`)

    const todos = await TodoModel.find({
      userId: req.user.id,
      archived: false,
      dueDate: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ createdAt: -1 })

    return res.status(200).json({
      todos,
    })
  } catch (error) {
    console.error('GET TODO HISTORY ERROR:', error)

    return res.status(500).json({
      message: 'Failed to fetch todo history',
    })
  }
}

/* get archived todos */
const getArchivedTodos = async (req, res) => {
  try {
    const todos = await TodoModel.find({
      userId: req.user.id,
      archived: true,
    }).sort({ archivedAt: -1 })

    return res.status(200).json({ todos })
  } catch (error) {
    console.error('GET ARCHIVED TODOS ERROR:', error)

    return res.status(500).json({
      message: 'Failed to fetch archived todos',
    })
  }
}

module.exports = {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  toggleTodo,
  toggleArchiveTodo,
  deleteTodo,
  getTodoHistoryDates,
  getTodoHistory,
  getArchivedTodos,
}
