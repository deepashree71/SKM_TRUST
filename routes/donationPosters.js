const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const DonationPoster = require('../models/DonationPoster')
const Donation = require('../models/Donation')
const { protect, adminOnly } = require('../middleware/auth')
const { generatePosterPDF } = require('../utils/pdfGen')

// POST /donation-posters/generate
router.post('/generate', protect, async (req, res) => {
  try {
    const { donationId, privacy = 'public', showAmount = true, showName = true } = req.body
    const donation = await Donation.findOne({ _id: donationId, userId: req.user._id, status: 'success' })
      .populate('userId', 'name')
    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found or not verified.' })

    const posterBuffer = await generatePosterPDF({ donation, showAmount, showName, privacy })
    // In production upload to Cloudinary; here we return base64 or save temp
    const posterUrl = `data:application/pdf;base64,${posterBuffer.toString('base64')}`

    const poster = await DonationPoster.create({
      donationId, userId: req.user._id, posterUrl, privacy, showAmount, showName,
    })

    res.status(201).json({ success: true, poster })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /donation-posters/my
router.get('/my', protect, async (req, res) => {
  try {
    const posters = await DonationPoster.find({ userId: req.user._id })
      .populate('donationId', 'amount receiptNumber createdAt')
      .sort('-createdAt')
    res.json({ success: true, posters })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /donation-posters/public/:token  — no auth
router.get('/public/:token', async (req, res) => {
  try {
    const poster = await DonationPoster.findOne({ shareToken: req.params.token, isActive: true, privacy: 'public' })
    if (!poster) return res.status(404).json({ success: false, message: 'Poster not found or private.' })
    poster.shareCount += 1
    await poster.save()
    res.json({ success: true, poster })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /donation-posters/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const poster = await DonationPoster.findOne({ _id: req.params.id, userId: req.user._id })
    if (!poster) return res.status(404).json({ success: false, message: 'Poster not found.' })
    res.json({ success: true, poster })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /donation-posters/:id/privacy
router.put('/:id/privacy', protect, async (req, res) => {
  try {
    const { privacy } = req.body
    if (!['public', 'private', 'anonymous'].includes(privacy)) return res.status(400).json({ success: false, message: 'Invalid privacy value.' })
    const poster = await DonationPoster.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { privacy }, { new: true })
    if (!poster) return res.status(404).json({ success: false, message: 'Poster not found.' })
    res.json({ success: true, poster })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// DELETE /donation-posters/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const poster = await DonationPoster.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    if (!poster) return res.status(404).json({ success: false, message: 'Poster not found.' })
    res.json({ success: true, message: 'Poster deleted.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /admin/donation-posters — via admin router
// DELETE /admin/donation-posters/:id — via admin router

module.exports = router
