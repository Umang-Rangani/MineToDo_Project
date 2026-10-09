require('dotenv').config()

var createError = require('http-errors')
var express = require('express')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/user')
var todosRouter = require('./routes/todos')
var notebookRouter = require('./routes/notebook')

var mongoose = require('mongoose')
var app = express()

app.use(logger('dev'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
)

app.use('/', indexRouter)
app.use('/todos', todosRouter)
app.use('/notebook', notebookRouter)
app.use('/users', usersRouter)

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('database is connected')
  })
  .catch((err) => {
    console.log('database connection error:', err)
  })

app.use(function (req, res, next) {
  next(createError(404))
})

app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message || 'Server error',
  })
})

module.exports = app
