const express = require('express')
const router = express.Router()
const Certificate = require('../models/Certificate')
const { protect } = require('../middleware/auth')
const { generateCertificatePDF } = require('../utils/pdfGen')

// GET /certificates/my
router.get('/my', protect, async (req, res) => {
  try {
    const certs = await Certificate.find({ userId: req.user._id, status: { $ne: 'revoked' } })
      .populate('eventId', 'title slug')
      .sort('-createdAt')
    res.json({ success: true, certificates: certs })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /certificates/verify/:token  — public
router.get('/verify/:token', async (req, res) => {
  try {
    const cert = await Certificate.findOne({ verifyToken: req.params.token })
      .populate('userId', 'name')
      .populate('eventId', 'title')
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found.' })
    res.json({ success: true, valid: cert.status !== 'revoked', certificate: cert })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /certificates/:id/download
router.get('/:id/download', protect, async (req, res) => {
  try {
    const cert = await Certificate.findOne({ _id: req.params.id, userId: req.user._id })
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found.' })
    if (cert.status === 'revoked') return res.status(403).json({ success: false, message: 'Certificate has been revoked.' })

    const pdfBuffer = await generateCertificatePDF(cert)
    cert.downloadCount += 1
    await cert.save()

    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${cert.certNumber}.pdf"` })
    res.send(pdfBuffer)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
