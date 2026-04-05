const express = require('express')
const router = express.Router()
const Volunteer = require('../models/Volunteer')
const User = require('../models/User')
const { protect } = require('../middleware/auth')
const { generateIdCardPDF } = require('../utils/pdfGen')

// POST /volunteers/apply
router.post('/apply', async (req, res) => {
  try {
    const { name, email, phone, address, city, state, pincode, dob, gender, skills, availability, motivation, experience } = req.body
    if (!name || !email || !phone) return res.status(400).json({ success: false, message: 'Name, email and phone are required.' })

    // Find or create user
    let user = await User.findOne({ email })
    if (!user) {
      user = await User.create({ name, email, password: Math.random().toString(36).slice(-8) + 'A1!', phone, role: 'volunteer' })
    }

    const existing = await Volunteer.findOne({ userId: user._id })
    if (existing) return res.status(409).json({ success: false, message: 'Application already submitted.' })

    const volunteer = await Volunteer.create({ userId: user._id, fullName: name, email, phone, address, city, state, pincode, dob, gender, skills, availability, motivation, experience })
    res.status(201).json({ success: true, message: 'Application submitted successfully.', volunteer })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /volunteers/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({ userId: req.user._id }).populate('userId', 'name email phone')
    if (!volunteer) return res.status(404).json({ success: false, message: 'Volunteer profile not found.' })
    res.json({ success: true, volunteer })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /volunteers/generate-id-card
router.post('/generate-id-card', protect, async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({ userId: req.user._id })
    if (!volunteer) return res.status(404).json({ success: false, message: 'Volunteer profile not found.' })
    if (volunteer.status !== 'approved') return res.status(403).json({ success: false, message: 'ID card only available for approved volunteers.' })

    const pdfBuffer = await generateIdCardPDF(volunteer)
    volunteer.idCardGeneratedAt = new Date()
    await volunteer.save()

    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="id-card-${volunteer.volunteerNumber}.pdf"` })
    res.send(pdfBuffer)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
