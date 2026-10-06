var express = require('express')
const TodosModel = require('../models/todos')
const authMiddleware = require('../middleware/authMiddleware')

var router = express.Router()

// Get logged-in user's todos
router.get('/', authMiddleware, async (req, res) => {
  try {
    const data = await TodosModel.find({
      userId: req.user.id,
      archived: false,
    }).sort({ createdAt: -1 })

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch todos',
      error: error.message,
    })
  }
})

// Create todo
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, priority, dueDate, time, category, completed, archived } = req.body

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: 'Task title is required',
      })
    }

    await TodosModel.create({
      userId: req.user.id,
      title: title.trim(),
      description: description?.trim() || '',
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      time: time?.trim() || '',
      category: category?.trim() || 'General',
      completed: completed ?? false,
      archived: archived ?? false,
    })

    const data = await TodosModel.find({
      userId: req.user.id,
      archived: false,
    }).sort({ createdAt: -1 })

    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create todo',
      error: error.message,
    })
  }
})

// Toggle todo
router.put('/toggle/:id', authMiddleware, async (req, res) => {
  try {
    const id = req.params.id
    const { completed } = req.body

    const todo = await TodosModel.findOneAndUpdate(
      {
        _id: id,
        userId: req.user.id,
      },
      {
        completed: Boolean(completed),
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

    const data = await TodosModel.find({
      userId: req.user.id,
      archived: false,
    }).sort({ createdAt: -1 })

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to toggle todo',
      error: error.message,
    })
  }
})

// Update todo
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const id = req.params.id

    const { title, description, priority, dueDate, time, category, completed, archived } = req.body

    const todo = await TodosModel.findOne({
      _id: id,
      userId: req.user.id,
    })

    if (!todo) {
      return res.status(404).json({
        message: 'Todo not found',
      })
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message: 'Task title is required',
        })
      }

      todo.title = title.trim()
    }

    if (description !== undefined) {
      todo.description = description.trim()
    }

    if (priority !== undefined) {
      if (!['High', 'Medium', 'Low'].includes(priority)) {
        return res.status(400).json({
          message: 'Invalid priority',
        })
      }

      todo.priority = priority
    }

    if (dueDate !== undefined) {
      todo.dueDate = dueDate || null
    }

    if (time !== undefined) {
      todo.time = time.trim()
    }

    if (category !== undefined) {
      todo.category = category.trim() || 'General'
    }

    if (completed !== undefined) {
      todo.completed = Boolean(completed)
    }

    if (archived !== undefined) {
      todo.archived = Boolean(archived)
    }

    await todo.save()

    const data = await TodosModel.find({
      userId: req.user.id,
      archived: false,
    }).sort({ createdAt: -1 })

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update todo',
      error: error.message,
    })
  }
})

// Delete todo
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const id = req.params.id

    const todo = await TodosModel.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    })

    if (!todo) {
      return res.status(404).json({
        message: 'Todo not found',
      })
    }

    const data = await TodosModel.find({
      userId: req.user.id,
      archived: false,
    }).sort({ createdAt: -1 })

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete todo',
      error: error.message,
    })
  }
})

module.exports = router
