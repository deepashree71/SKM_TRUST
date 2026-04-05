const express = require('express')
const router = express.Router()
const { protect, adminOnly } = require('../middleware/auth')
const Program = require('../models/Program')
const Event = require('../models/Event')
const EventRegistration = require('../models/EventRegistration')
const Certificate = require('../models/Certificate')
const Volunteer = require('../models/Volunteer')
const Donation = require('../models/Donation')
const DonationPoster = require('../models/DonationPoster')
const Gallery = require('../models/Gallery')
const Story = require('../models/Story')
const TransparencyDoc = require('../models/TransparencyDoc')
const User = require('../models/User')
const ContactMessage = require('../models/ContactMessage')
const { CmsPage, CmsSettings } = require('../models/CmsPage')
const { ImpactLocation, ImpactMetric } = require('../models/ImpactLocation')
const AuditLog = require('../models/AuditLog')
const { sendNotification } = require('../utils/notify')
const { logAudit } = require('../utils/auditLog')

// All admin routes require auth + admin role
router.use(protect, adminOnly)

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [users, volunteers, donations, events, certificates] = await Promise.all([
      User.countDocuments(),
      Volunteer.countDocuments({ status: 'approved' }),
      Donation.aggregate([{ $match: { status: 'success' } }, { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }]),
      Event.countDocuments(),
      Certificate.countDocuments({ status: 'issued' }),
    ])
    res.json({ success: true, stats: {
      totalUsers: users,
      approvedVolunteers: volunteers,
      totalDonations: donations[0]?.count || 0,
      totalRaisedPaise: donations[0]?.total || 0,
      totalEvents: events,
      certificatesIssued: certificates,
    }})
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ─── USERS ───────────────────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query
    const filter = {}
    if (role) filter.role = role
    const users = await User.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(+limit)
    const total = await User.countDocuments(filter)
    res.json({ success: true, users, total })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

router.put('/users/:id/block', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true })
    await logAudit(req, 'user.block', 'users', req.params.id)
    res.json({ success: true, user })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.put('/users/:id/unblock', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true })
    await logAudit(req, 'user.unblock', 'users', req.params.id)
    res.json({ success: true, user })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ─── VOLUNTEERS ───────────────────────────────────────────────────────────────
router.get('/volunteers', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const filter = {}
    if (status) filter.status = status
    const volunteers = await Volunteer.find(filter).populate('userId', 'name email').sort('-createdAt').skip((page-1)*limit).limit(+limit)
    const total = await Volunteer.countDocuments(filter)
    res.json({ success: true, volunteers, total })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.get('/volunteers/:id', async (req, res) => {
  try {
    const v = await Volunteer.findById(req.params.id).populate('userId', 'name email phone')
    if (!v) return res.status(404).json({ success: false, message: 'Volunteer not found.' })
    res.json({ success: true, volunteer: v })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.put('/volunteers/:id/approve', async (req, res) => {
  try {
    const v = await Volunteer.findByIdAndUpdate(req.params.id, { status: 'approved', approvedAt: new Date(), approvedBy: req.user._id }, { new: true })
    if (!v) return res.status(404).json({ success: false, message: 'Volunteer not found.' })
    await User.findByIdAndUpdate(v.userId, { role: 'volunteer' })
    await sendNotification({ userId: v.userId, title: 'Application Approved!', message: 'Your volunteer application has been approved. You can now generate your ID card.', type: 'system', channel: 'in_app' })
    await logAudit(req, 'volunteer.approve', 'volunteers', req.params.id)
    res.json({ success: true, volunteer: v })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.put('/volunteers/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body
    const v = await Volunteer.findByIdAndUpdate(req.params.id, { status: 'rejected', rejectionReason: reason }, { new: true })
    if (!v) return res.status(404).json({ success: false, message: 'Volunteer not found.' })
    await sendNotification({ userId: v.userId, title: 'Application Update', message: `Your volunteer application was not approved. Reason: ${reason || 'Not specified'}`, type: 'system', channel: 'in_app' })
    await logAudit(req, 'volunteer.reject', 'volunteers', req.params.id, { reason })
    res.json({ success: true, volunteer: v })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ─── PROGRAMS ─────────────────────────────────────────────────────────────────
router.get('/programs', async (req, res) => {
  try {
    const programs = await Program.find().sort('-createdAt')
    res.json({ success: true, programs })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.post('/programs', async (req, res) => {
  try {
    const program = await Program.create({ ...req.body })
    await logAudit(req, 'program.create', 'programs', program._id)
    res.status(201).json({ success: true, program })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.put('/programs/:id', async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!program) return res.status(404).json({ success: false, message: 'Program not found.' })
    await logAudit(req, 'program.update', 'programs', req.params.id)
    res.json({ success: true, program })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.delete('/programs/:id', async (req, res) => {
  try {
    await Program.findByIdAndDelete(req.params.id)
    await logAudit(req, 'program.delete', 'programs', req.params.id)
    res.json({ success: true, message: 'Program deleted.' })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.put('/programs/:id/toggle-featured', async (req, res) => {
  try {
    const program = await Program.findById(req.params.id)
    if (!program) return res.status(404).json({ success: false, message: 'Program not found.' })
    program.isFeatured = !program.isFeatured
    await program.save()
    res.json({ success: true, program })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.post('/programs/:id/gallery', async (req, res) => {
  try {
    const { imageUrl } = req.body
    const program = await Program.findByIdAndUpdate(req.params.id, { $push: { gallery: imageUrl } }, { new: true })
    res.json({ success: true, program })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.delete('/programs/:id/gallery/:imgId', async (req, res) => {
  try {
    const program = await Program.findById(req.params.id)
    if (!program) return res.status(404).json({ success: false, message: 'Program not found.' })
    program.gallery = program.gallery.filter((_, i) => i.toString() !== req.params.imgId)
    await program.save()
    res.json({ success: true, program })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ─── EVENTS ───────────────────────────────────────────────────────────────────
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find().sort('-createdAt')
    res.json({ success: true, events })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.post('/events', async (req, res) => {
  try {
    const event = await Event.create(req.body)
    await logAudit(req, 'event.create', 'events', event._id)
    res.status(201).json({ success: true, event })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.put('/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' })
    await logAudit(req, 'event.update', 'events', req.params.id)
    res.json({ success: true, event })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.delete('/events/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id)
    await logAudit(req, 'event.delete', 'events', req.params.id)
    res.json({ success: true, message: 'Event deleted.' })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.put('/events/:id/cancel', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true })
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' })
    // Notify all registrants
    const regs = await EventRegistration.find({ eventId: req.params.id, status: 'registered' }).select('userId')
    for (const r of regs) {
      await sendNotification({ userId: r.userId, title: 'Event Cancelled', message: `The event "${event.title}" has been cancelled.`, type: 'event', channel: 'in_app' })
    }
    await logAudit(req, 'event.cancel', 'events', req.params.id)
    res.json({ success: true, event })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.get('/events/:id/registrations', async (req, res) => {
  try {
    const regs = await EventRegistration.find({ eventId: req.params.id })
      .populate('userId', 'name email phone')
      .sort('-registeredAt')
    res.json({ success: true, registrations: regs })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.put('/events/:id/mark-attendance', async (req, res) => {
  try {
    const { attendedUserIds = [], absentUserIds = [] } = req.body
    if (attendedUserIds.length) {
      await EventRegistration.updateMany(
        { eventId: req.params.id, userId: { $in: attendedUserIds } },
        { status: 'attended', attendedAt: new Date(), markedBy: req.user._id }
      )
    }
    if (absentUserIds.length) {
      await EventRegistration.updateMany(
        { eventId: req.params.id, userId: { $in: absentUserIds } },
        { status: 'absent', markedBy: req.user._id }
      )
    }
    await logAudit(req, 'event.mark-attendance', 'event_registrations', req.params.id, { attendedCount: attendedUserIds.length, absentCount: absentUserIds.length })
    res.json({ success: true, message: 'Attendance marked.' })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ─── CERTIFICATES ─────────────────────────────────────────────────────────────
router.get('/certificates', async (req, res) => {
  try {
    const { status, eventId, page = 1, limit = 20 } = req.query
    const filter = {}
    if (status) filter.status = status
    if (eventId) filter.eventId = eventId
    const certs = await Certificate.find(filter)
      .populate('userId', 'name email')
      .populate('eventId', 'title')
      .sort('-createdAt').skip((page-1)*limit).limit(+limit)
    const total = await Certificate.countDocuments(filter)
    res.json({ success: true, certificates: certs, total })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.post('/certificates/bulk-issue', async (req, res) => {
  try {
    const { eventId, certTitle } = req.body
    if (!eventId) return res.status(400).json({ success: false, message: 'eventId is required.' })

    const event = await Event.findById(eventId)
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' })

    const attended = await EventRegistration.find({ eventId, status: 'attended' }).populate('userId', 'name')
    const created = []
    for (const reg of attended) {
      const exists = await Certificate.findOne({ userId: reg.userId._id, eventId })
      if (!exists) {
        const cert = await Certificate.create({
          userId: reg.userId._id,
          eventId,
          certTitle: certTitle || `${event.title} - Participation Certificate`,
          recipientName: reg.userId.name,
          eventName: event.title,
          issuedBy: 'NGO Trust',
        })
        created.push(cert)
        await sendNotification({ userId: reg.userId._id, title: 'Certificate Issued!', message: `Your certificate for "${event.title}" is ready. Download it from your dashboard.`, type: 'certificate', channel: 'in_app' })
      }
    }
    await logAudit(req, 'certificate.bulk-issue', 'certificates', eventId, { count: created.length })
    res.json({ success: true, message: `${created.length} certificates issued.`, certificates: created })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.post('/certificates/:id/reissue', async (req, res) => {
  try {
    const original = await Certificate.findById(req.params.id)
    if (!original) return res.status(404).json({ success: false, message: 'Certificate not found.' })

    original.status = 'reissued'
    await original.save()

    const newCert = await Certificate.create({
      userId: original.userId,
      eventId: original.eventId,
      certTitle: req.body.certTitle || original.certTitle,
      recipientName: req.body.recipientName || original.recipientName,
      eventName: original.eventName,
      issuedBy: original.issuedBy,
      reissuedFrom: original._id,
      correctionNote: req.body.correctionNote,
    })
    await logAudit(req, 'certificate.reissue', 'certificates', req.params.id, { newCertId: newCert._id })
    res.status(201).json({ success: true, certificate: newCert })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.put('/certificates/:id/revoke', async (req, res) => {
  try {
    const { reason } = req.body
    if (!reason) return res.status(400).json({ success: false, message: 'Revoke reason is required.' })
    const cert = await Certificate.findByIdAndUpdate(req.params.id, { status: 'revoked', revokedAt: new Date(), revokedBy: req.user._id, revokeReason: reason }, { new: true })
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found.' })
    await logAudit(req, 'certificate.revoke', 'certificates', req.params.id, { reason })
    res.json({ success: true, certificate: cert })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.put('/certificates/:id/correct', async (req, res) => {
  try {
    const { recipientName, issueDate, correctionNote } = req.body
    const cert = await Certificate.findByIdAndUpdate(req.params.id, { recipientName, issueDate, correctionNote }, { new: true })
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found.' })
    await logAudit(req, 'certificate.correct', 'certificates', req.params.id, { recipientName, correctionNote })
    res.json({ success: true, certificate: cert })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ─── GALLERY ──────────────────────────────────────────────────────────────────
router.get('/gallery', async (req, res) => {
  try {
    const items = await Gallery.find().sort('-createdAt')
    res.json({ success: true, gallery: items })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.post('/gallery', async (req, res) => {
  try {
    const item = await Gallery.create(req.body)
    res.status(201).json({ success: true, item })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.put('/gallery/:id', async (req, res) => {
  try {
    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found.' })
    res.json({ success: true, item })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.delete('/gallery/:id', async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id)
    await logAudit(req, 'gallery.delete', 'gallery', req.params.id)
    res.json({ success: true, message: 'Gallery item deleted.' })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ─── STORIES ──────────────────────────────────────────────────────────────────
router.get('/stories', async (req, res) => {
  try {
    const stories = await Story.find().sort('-createdAt')
    res.json({ success: true, stories })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.post('/stories', async (req, res) => {
  try {
    const story = await Story.create(req.body)
    res.status(201).json({ success: true, story })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.put('/stories/:id', async (req, res) => {
  try {
    const story = await Story.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!story) return res.status(404).json({ success: false, message: 'Story not found.' })
    res.json({ success: true, story })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.delete('/stories/:id', async (req, res) => {
  try {
    await Story.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Story deleted.' })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.put('/stories/:id/toggle-active', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
    if (!story) return res.status(404).json({ success: false, message: 'Story not found.' })
    story.isActive = !story.isActive
    await story.save()
    res.json({ success: true, story })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ─── DONATIONS ────────────────────────────────────────────────────────────────
router.get('/donations', async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query
    const filter = {}
    if (status) filter.status = status
    if (type) filter.type = type
    const donations = await Donation.find(filter)
      .populate('userId', 'name email')
      .populate('programId', 'title')
      .sort('-createdAt').skip((page-1)*limit).limit(+limit)
    const total = await Donation.countDocuments(filter)
    res.json({ success: true, donations, total })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ─── DONATION POSTERS ─────────────────────────────────────────────────────────
router.get('/donation-posters', async (req, res) => {
  try {
    const posters = await DonationPoster.find()
      .populate('userId', 'name email')
      .populate('donationId', 'amount receiptNumber')
      .sort('-createdAt')
    res.json({ success: true, posters })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.delete('/donation-posters/:id', async (req, res) => {
  try {
    const poster = await DonationPoster.findByIdAndUpdate(req.params.id, { isActive: false })
    if (!poster) return res.status(404).json({ success: false, message: 'Poster not found.' })
    await logAudit(req, 'donation_poster.remove', 'donation_posters', req.params.id)
    res.json({ success: true, message: 'Poster removed.' })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ─── TRANSPARENCY DOCS ────────────────────────────────────────────────────────
router.get('/transparency', async (req, res) => {
  try {
    const docs = await TransparencyDoc.find().sort('-year -createdAt')
    res.json({ success: true, documents: docs })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.post('/transparency', async (req, res) => {
  try {
    const doc = await TransparencyDoc.create(req.body)
    res.status(201).json({ success: true, document: doc })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.put('/transparency/:id', async (req, res) => {
  try {
    const doc = await TransparencyDoc.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found.' })
    res.json({ success: true, document: doc })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.delete('/transparency/:id', async (req, res) => {
  try {
    await TransparencyDoc.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Document deleted.' })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ─── CONTACT MESSAGES ─────────────────────────────────────────────────────────
router.get('/contact', async (req, res) => {
  try {
    const { isRead, page = 1, limit = 20 } = req.query
    const filter = {}
    if (isRead !== undefined) filter.isRead = isRead === 'true'
    const messages = await ContactMessage.find(filter).sort('-createdAt').skip((page-1)*limit).limit(+limit)
    const total = await ContactMessage.countDocuments(filter)
    res.json({ success: true, messages, total })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.put('/contact/:id/read', async (req, res) => {
  try {
    await ContactMessage.findByIdAndUpdate(req.params.id, { isRead: true })
    res.json({ success: true, message: 'Marked as read.' })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ─── CMS PAGES ────────────────────────────────────────────────────────────────
router.get('/cms', async (req, res) => {
  try {
    const pages = await CmsPage.find().sort('key')
    res.json({ success: true, pages })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.put('/cms/:key', async (req, res) => {
  try {
    const page = await CmsPage.findOneAndUpdate(
      { key: req.params.key },
      { ...req.body, updatedBy: req.user._id },
      { new: true, upsert: true }
    )
    await logAudit(req, 'cms.update', 'cms_pages', page._id, { key: req.params.key })
    res.json({ success: true, page })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.put('/cms-settings', async (req, res) => {
  try {
    const settings = await CmsSettings.findOneAndUpdate({}, { ...req.body, updatedBy: req.user._id }, { new: true, upsert: true })
    await logAudit(req, 'cms.settings-update', 'cms_settings', settings._id)
    res.json({ success: true, settings })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ─── IMPACT MAP ───────────────────────────────────────────────────────────────
router.post('/impact-locations', async (req, res) => {
  try {
    const loc = await ImpactLocation.create(req.body)
    res.status(201).json({ success: true, location: loc })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.put('/impact-locations/:id', async (req, res) => {
  try {
    const loc = await ImpactLocation.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, location: loc })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.delete('/impact-locations/:id', async (req, res) => {
  try {
    await ImpactLocation.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Location deleted.' })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.post('/impact-metrics', async (req, res) => {
  try {
    const metric = await ImpactMetric.findOneAndUpdate({ key: req.body.key }, req.body, { new: true, upsert: true })
    res.json({ success: true, metric })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ─── BROADCAST NOTIFICATION ───────────────────────────────────────────────────
router.post('/broadcast', async (req, res) => {
  try {
    const { title, message, role } = req.body
    if (!title || !message) return res.status(400).json({ success: false, message: 'Title and message are required.' })
    const filter = role ? { role } : {}
    const users = await User.find(filter).select('_id')
    const { sendNotification } = require('../utils/notify')
    let count = 0
    for (const u of users) {
      await sendNotification({ userId: u._id, title, message, type: 'broadcast', channel: 'in_app' })
      count++
    }
    res.json({ success: true, message: `Broadcast sent to ${count} users.` })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ─── AUDIT LOG ────────────────────────────────────────────────────────────────
router.get('/audit-log', async (req, res) => {
  try {
    const { page = 1, limit = 30 } = req.query
    const logs = await AuditLog.find()
      .populate('adminId', 'name email')
      .sort('-createdAt').skip((page-1)*limit).limit(+limit)
    const total = await AuditLog.countDocuments()
    res.json({ success: true, logs, total })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

module.exports = router
