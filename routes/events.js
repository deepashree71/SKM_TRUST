const express = require('express')
const router = express.Router()
const Event = require('../models/Event')
const EventRegistration = require('../models/EventRegistration')
const { protect } = require('../middleware/auth')

// GET /events
router.get('/', async (req, res) => {
  try {
    const { status, date } = req.query
    const filter = {}
    if (status) filter.status = status
    if (date) filter.startDate = { $gte: new Date(date) }
    const events = await Event.find(filter).sort('startDate')
    res.json({ success: true, events })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /events/:slug
router.get('/:slug', async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug })
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' })
    res.json({ success: true, event })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /events/:id/register
router.post('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' })
    if (event.status === 'cancelled') return res.status(400).json({ success: false, message: 'Event is cancelled.' })
    if (event.registrationDeadline && new Date() > event.registrationDeadline) {
      return res.status(400).json({ success: false, message: 'Registration deadline has passed.' })
    }
    if (event.capacity && event.attendeeCount >= event.capacity) {
      return res.status(400).json({ success: false, message: 'Event is at full capacity.' })
    }

    const existing = await EventRegistration.findOne({ userId: req.user._id, eventId: req.params.id })
    if (existing) return res.status(409).json({ success: false, message: 'Already registered for this event.' })

    const registration = await EventRegistration.create({ userId: req.user._id, eventId: req.params.id })
    await Event.findByIdAndUpdate(req.params.id, { $inc: { attendeeCount: 1 } })

    res.status(201).json({ success: true, message: 'Registered successfully.', registration })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /events/:id/cancel-registration
router.put('/:id/cancel-registration', protect, async (req, res) => {
  try {
    const reg = await EventRegistration.findOne({ userId: req.user._id, eventId: req.params.id, status: 'registered' })
    if (!reg) return res.status(404).json({ success: false, message: 'Active registration not found.' })

    reg.status = 'cancelled'
    await reg.save()
    await Event.findByIdAndUpdate(req.params.id, { $inc: { attendeeCount: -1 } })

    res.json({ success: true, message: 'Registration cancelled.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
