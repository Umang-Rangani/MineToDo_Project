var express = require('express')
var router = express.Router()
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
var crypto = require('crypto')

const User = require('../models/user')
const PasswordReset = require('../models/passwordReset')
const authMiddleware = require('../middleware/authMiddleware')
const { sendEmail } = require('../utils/sendEmail')

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

    const normalizedEmail = email.toLowerCase().trim()

    const existingUser = await User.findOne({
      email: normalizedEmail,
    })

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
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

    const normalizedEmail = email.toLowerCase().trim()

    const user = await User.findOne({
      email: normalizedEmail,
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
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
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

// Forgot Password - Send OTP
router.post('/forgot-password', async function (req, res) {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        message: 'Email is required',
      })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const user = await User.findOne({
      email: normalizedEmail,
    })

    if (!user) {
      return res.status(200).json({
        message: 'If this email is registered, an OTP has been sent',
      })
    }

    await PasswordReset.deleteMany({
      email: normalizedEmail,
    })

    const otp = crypto.randomInt(100000, 1000000).toString()

    const otpHash = await bcrypt.hash(otp, 10)

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await PasswordReset.create({
      userId: user._id,
      email: normalizedEmail,
      otpHash,
      expiresAt,
    })

    await sendEmail({
      to: normalizedEmail,
      subject: 'MineSpace Password Reset OTP',
      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 500px;
          margin: auto;
          padding: 20px;
        ">
          <h2 style="color: #7E563B;">
            MineSpace
          </h2>

          <p>
            Hello ${user.name},
          </p>

          <p>
            We received a request to reset your MineSpace password.
          </p>

          <p>
            Your OTP is:
          </p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #B8794A;
            margin: 20px 0;
          ">
            ${otp}
          </div>

          <p>
            This OTP is valid for
            <strong>10 minutes</strong>.
          </p>

          <p>
            If you did not request a password reset,
            you can safely ignore this email.
          </p>

          <p>
            Regards,<br />
            MineSpace Team
          </p>
        </div>
      `,
    })

    res.status(200).json({
      message: 'If this email is registered, an OTP has been sent',
    })
  } catch (error) {
    console.error('FORGOT PASSWORD ERROR:', error)
    console.error('ERROR MESSAGE:', error.message)
    console.error('ERROR CODE:', error.code)

    res.status(500).json({
      message: error.message || 'Unable to send OTP',
    })
  }
})

// Verify OTP
router.post('/verify-otp', async function (req, res) {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({
        message: 'Email and OTP are required',
      })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const resetRequest = await PasswordReset.findOne({
      email: normalizedEmail,
    })

    if (!resetRequest) {
      return res.status(400).json({
        message: 'OTP not found or expired',
      })
    }

    if (resetRequest.expiresAt < new Date()) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      })

      return res.status(400).json({
        message: 'OTP has expired',
      })
    }

    if (resetRequest.attempts >= 5) {
      return res.status(400).json({
        message: 'Too many invalid attempts',
      })
    }

    const isOtpValid = await bcrypt.compare(otp.toString(), resetRequest.otpHash)

    if (!isOtpValid) {
      resetRequest.attempts += 1
      await resetRequest.save()

      return res.status(400).json({
        message: 'Invalid OTP',
      })
    }

    resetRequest.verifiedAt = new Date()

    const resetToken = crypto.randomBytes(32).toString('hex')

    resetRequest.resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')

    await resetRequest.save()

    res.status(200).json({
      message: 'OTP verified successfully',
      resetToken,
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Unable to verify OTP',
    })
  }
})

// Reset Password
router.post('/reset-password', async function (req, res) {
  try {
    const { email, resetToken, password, confirmPassword } = req.body

    if (!email || !resetToken || !password || !confirmPassword) {
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

    const normalizedEmail = email.toLowerCase().trim()

    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')

    const resetRequest = await PasswordReset.findOne({
      email: normalizedEmail,
      resetTokenHash,
      verifiedAt: { $ne: null },
    })

    if (!resetRequest) {
      return res.status(400).json({
        message: 'Invalid or expired reset request',
      })
    }

    if (resetRequest.expiresAt < new Date()) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      })

      return res.status(400).json({
        message: 'Reset request has expired',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.findById(resetRequest.userId)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    user.password = hashedPassword

    await user.save()

    await PasswordReset.deleteOne({
      _id: resetRequest._id,
    })

    // Send password reset success email
    try {
      await sendEmail({
        to: user.email,
        subject: 'MineSpace Password Reset Successful',
        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 560px;
            margin: 0 auto;
            padding: 30px 20px;
            background: #F7F0E7;
            color: #3B2A20;
          ">
            <div style="
              background: #FFF9F2;
              border: 1px solid #E4D5C5;
              border-radius: 16px;
              padding: 28px;
            ">
              <h2 style="
                margin: 0 0 20px;
                color: #7E563B;
                font-size: 26px;
              ">
                MineSpace
              </h2>

              <p style="
                font-size: 16px;
                margin-bottom: 14px;
              ">
                Hello ${user.name},
              </p>

              <p style="
                font-size: 15px;
                line-height: 1.6;
              ">
                Your MineSpace account password has been
                <strong>successfully reset</strong>.
              </p>

              <div style="
                margin: 24px 0;
                padding: 18px;
                border-radius: 12px;
                background: #F7EBDD;
                border: 1px solid #E4D5C5;
              ">
                <p style="
                  margin: 0 0 8px;
                  font-size: 13px;
                  color: #806F62;
                ">
                  Account
                </p>

                <p style="
                  margin: 0;
                  font-size: 15px;
                  font-weight: bold;
                  color: #3B2A20;
                ">
                  ${user.email}
                </p>
              </div>

              <p style="
                font-size: 14px;
                line-height: 1.6;
                color: #806F62;
              ">
                You can now log in to your MineSpace account
                using your new password.
              </p>

              <p style="
                font-size: 14px;
                line-height: 1.6;
                color: #806F62;
              ">
                If you did not make this password change,
                please secure your account immediately.
              </p>

              <div style="
                margin-top: 28px;
                padding-top: 18px;
                border-top: 1px solid #E4D5C5;
              ">
                <p style="
                  margin: 0;
                  font-size: 13px;
                  color: #806F62;
                ">
                  Regards,<br />
                  <strong style="color: #7E563B;">
                    MineSpace Team
                  </strong>
                </p>
              </div>
            </div>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('PASSWORD RESET SUCCESS EMAIL ERROR:', emailError)

      // Password is already changed successfully,
      // so don't return an error to the frontend.
    }

    res.status(200).json({
      message: 'Password reset successfully',
    })
  } catch (error) {
    console.log('RESET PASSWORD ERROR:', error)

    res.status(500).json({
      message: 'Unable to reset password',
    })
  }
})

// Update Profile
router.put('/profile', authMiddleware, async function (req, res) {
  try {
    const { name, email } = req.body

    if (!name || !email) {
      return res.status(400).json({
        message: 'Name and email are required',
      })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user.id },
    })

    if (existingUser) {
      return res.status(400).json({
        message: 'Email is already registered',
      })
    }

    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    user.name = name.trim()
    user.email = normalizedEmail

    await user.save()

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    })
  } catch (error) {
    console.error('UPDATE PROFILE ERROR:', error)

    res.status(500).json({
      message: 'Unable to update profile',
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
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  })

  res.status(200).json({
    message: 'Logout successful',
  })
})

module.exports = router
