const express = require('express')

const { createTodo, getTodos, getTodo, updateTodo, toggleTodo, toggleArchiveTodo, deleteTodo, getTodoHistoryDates, getTodoHistory, getArchivedTodos } = require('../controllers/todoController')

const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// ! create todo
router.post('/', authMiddleware, createTodo)

// ! get todos
router.get('/', authMiddleware, getTodos)

// ! button logic
router.get('/history/dates', authMiddleware, getTodoHistoryDates)
router.get('/history', authMiddleware, getTodoHistory)
router.get('/archived', authMiddleware, getArchivedTodos)

// ! toggle completed
router.put('/toggle/:id', authMiddleware, toggleTodo)

// ! toggle archived
router.put('/archive/:id', authMiddleware, toggleArchiveTodo)

// ! get single todo
router.get('/:id', authMiddleware, getTodo)

// ! update todo
router.put('/:id', authMiddleware, updateTodo)

// ! delete todo
router.delete('/:id', authMiddleware, deleteTodo)

module.exports = router
