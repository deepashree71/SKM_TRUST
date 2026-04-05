const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/User')
const NotificationPreference = require('../models/NotificationPreference')
const { protect } = require('../middleware/auth')
const { sendEmail } = require('../utils/notify')

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email and password are required.' })

    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ success: false, message: 'Email already registered.' })

    const allowedRoles = ['donor', 'volunteer']
    const userRole = allowedRoles.includes(role) ? role : 'donor'
    const user = await User.create({ name, email, password, phone, role: userRole })

    await NotificationPreference.create({ userId: user._id })

    const token = signToken(user._id)
    res.status(201).json({ success: true, message: 'Registration successful.', token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required.' })

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }
    if (user.isBlocked) return res.status(401).json({ success: false, message: 'Your account has been blocked. Contact admin.' })

    const token = signToken(user._id)
    res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /auth/logout
router.post('/logout', protect, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' })
})

// GET /auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.json({ success: true, user })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /auth/me  — update profile
router.put('/me', protect, async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'address', 'city', 'state', 'pincode', 'panNumber', 'profileImage']
    const updates = {}
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f] })
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true })
    res.json({ success: true, user })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.json({ success: true, message: 'If this email exists, a reset link has been sent.' })

    const token = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000 // 30 min
    await user.save({ validateBeforeSave: false })

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`
    await sendEmail({ to: user.email, subject: 'Password Reset - NGO Trust', html: `<p>Reset your password: <a href="${resetUrl}">${resetUrl}</a></p><p>Expires in 30 minutes.</p>` })

    res.json({ success: true, message: 'Password reset email sent.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /auth/reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({ resetPasswordToken: hashed, resetPasswordExpire: { $gt: Date.now() } })
    if (!user) return res.status(400).json({ success: false, message: 'Token invalid or expired.' })

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    res.json({ success: true, message: 'Password reset successful.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
