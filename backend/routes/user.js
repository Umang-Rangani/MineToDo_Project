var express = require('express')
var router = express.Router()
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')

const User = require('../models/user')
const authMiddleware = require('../middleware/authMiddleware')

// Register
router.post('/register', async function (req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message: 'All fields are required',
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Password and confirm password do not match',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
      })
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    })

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    })

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Server error',
    })
  }
})

// Login
router.post('/login', async function (req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      })
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    })

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    if (user.status !== 'Active') {
      return res.status(403).json({
        message: 'Your account is inactive',
      })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      },
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Server error',
    })
  }
})

// Get Profile
router.get('/profile', authMiddleware, async function (req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password')

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    res.status(200).json({
      user,
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Server error',
    })
  }
})

// Logout
router.post('/logout', function (req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  })

  res.status(200).json({
    message: 'Logout successful',
  })
})

module.exports = router
