var express = require('express')
const TodosModel = require('../models/todos')
const authMiddleware = require('../middleware/authMiddleware')
var router = express.Router()

// Get logged-in user's todos
router.get('/', authMiddleware, async (req, res) => {
  try {
    const data = await TodosModel.find({
      user: req.user.id,
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
    const { title, isCompleted } = req.body

    const postTodo = await TodosModel.create({
      title,
      isCompleted: isCompleted ?? false,
      user: req.user.id,
    })

    const data = await TodosModel.find({
      user: req.user.id,
    }).sort({ createdAt: -1 })

    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create todo',
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
      user: req.user.id,
    })

    if (!todo) {
      return res.status(404).json({
        message: 'Todo not found',
      })
    }

    const data = await TodosModel.find({
      user: req.user.id,
    }).sort({ createdAt: -1 })

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete todo',
      error: error.message,
    })
  }
})

// Update todo
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const id = req.params.id
    const putObj = req.body

    const todo = await TodosModel.findOneAndUpdate(
      {
        _id: id,
        user: req.user.id,
      },
      {
        title: putObj.title,
        isCompleted: putObj.isCompleted,
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
      user: req.user.id,
    }).sort({ createdAt: -1 })

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update todo',
      error: error.message,
    })
  }
})

// Toggle todo
router.put('/toggle/:id', authMiddleware, async (req, res) => {
  try {
    const id = req.params.id
    const { isCompleted } = req.body

    const todo = await TodosModel.findOneAndUpdate(
      {
        _id: id,
        user: req.user.id,
      },
      {
        isCompleted,
      },
      {
        new: true,
      },
    )

    if (!todo) {
      return res.status(404).json({
        message: 'Todo not found',
      })
    }

    const data = await TodosModel.find({
      user: req.user.id,
    }).sort({ createdAt: -1 })

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to toggle todo',
      error: error.message,
    })
  }
})

module.exports = router
