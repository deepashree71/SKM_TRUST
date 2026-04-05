const express = require('express')
const router = express.Router()
const Notification = require('../models/Notification')
const NotificationPreference = require('../models/NotificationPreference')
const { protect } = require('../middleware/auth')

// GET /notifications  — user's in-app notifications
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id, channel: 'in_app' })
      .sort('-sentAt').limit(50)
    const unreadCount = await Notification.countDocuments({ userId: req.user._id, channel: 'in_app', isRead: false })
    res.json({ success: true, notifications, unreadCount })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /notifications/:id/read
router.put('/:id/read', protect, async (req, res) => {
  try {
    await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { isRead: true })
    res.json({ success: true, message: 'Marked as read.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /notifications/read-all
router.put('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true })
    res.json({ success: true, message: 'All notifications marked as read.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /notifications/preferences
router.get('/preferences', protect, async (req, res) => {
  try {
    let prefs = await NotificationPreference.findOne({ userId: req.user._id })
    if (!prefs) prefs = await NotificationPreference.create({ userId: req.user._id })
    res.json({ success: true, preferences: prefs })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /notifications/preferences
router.put('/preferences', protect, async (req, res) => {
  try {
    const { email, sms, whatsapp, inApp } = req.body
    const prefs = await NotificationPreference.findOneAndUpdate(
      { userId: req.user._id },
      { email, sms, whatsapp, inApp, updatedAt: new Date() },
      { new: true, upsert: true }
    )
    res.json({ success: true, preferences: prefs })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
