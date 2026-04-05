const express = require('express')
const router = express.Router()
const Program = require('../models/Program')
const { protect, adminOnly } = require('../middleware/auth')

// GET /programs
router.get('/', async (req, res) => {
  try {
    const { category, status, featured } = req.query
    const filter = {}
    if (category) filter.category = category
    if (status) filter.status = status
    if (featured === 'true') filter.isFeatured = true
    const programs = await Program.find(filter).sort('-createdAt')
    res.json({ success: true, programs })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /programs/:slug
router.get('/:slug', async (req, res) => {
  try {
    const program = await Program.findOne({ slug: req.params.slug })
    if (!program) return res.status(404).json({ success: false, message: 'Program not found.' })
    res.json({ success: true, program })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
