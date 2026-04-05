const express = require('express')
const router = express.Router()
const ContactMessage = require('../models/ContactMessage')
const { sendEmail } = require('../utils/notify')

// POST /contact
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, subject and message are required.' })
    }

    const contact = await ContactMessage.create({ name, email, phone, subject, message })

    // Auto-reply
    await sendEmail({
      to: email,
      subject: `We received your message — NGO Trust`,
      html: `<p>Dear ${name},</p><p>Thank you for reaching out. We will get back to you within 24-48 hours.</p><p>— NGO Trust Team</p>`,
    }).catch(() => {})

    res.status(201).json({ success: true, message: 'Message sent successfully.', id: contact._id })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
