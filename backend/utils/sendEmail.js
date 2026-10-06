const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

async function sendEmail({ to, subject, html, attachments }) {
  try {
    console.log('EMAIL_USER:', process.env.EMAIL_USER)
    console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS)

    await transporter.verify()

    console.log('Gmail transporter connected')

    const mailOptions = {
      from: `"MineSpace" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    }

    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments
    }

    const info = await transporter.sendMail(mailOptions)

    console.log('Email sent:', info.messageId)

    return info
  } catch (error) {
    console.error('sendEmail Error:', error)
    throw error
  }
}

module.exports = { sendEmail }
