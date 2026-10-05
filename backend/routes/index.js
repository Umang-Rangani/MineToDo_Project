var express = require('express')

var router = express.Router()

router.get('/', function (req, res) {
  res.status(200).json({
    message: 'Todo API is running',
  })
})

module.exports = router
