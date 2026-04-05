// gallery.js
const express = require('express')
const router = express.Router()
const Gallery = require('../models/Gallery')

router.get('/', async (req, res) => {
  try {
    const filter = { isActive: true }
    if (req.query.category) filter.category = req.query.category
    const items = await Gallery.find(filter).sort('-createdAt')
    res.json({ success: true, gallery: items })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
