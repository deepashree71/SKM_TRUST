const express = require('express')
const router = express.Router()
const TransparencyDoc = require('../models/TransparencyDoc')

// GET /transparency
router.get('/', async (req, res) => {
  try {
    const filter = { isActive: true }
    if (req.query.category) filter.category = req.query.category
    if (req.query.year) filter.year = parseInt(req.query.year)
    const docs = await TransparencyDoc.find(filter).sort('-year -createdAt')
    res.json({ success: true, documents: docs })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /transparency/:id/download
router.get('/:id/download', async (req, res) => {
  try {
    const doc = await TransparencyDoc.findByIdAndUpdate(req.params.id, { $inc: { downloadCount: 1 } }, { new: true })
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found.' })
    res.json({ success: true, fileUrl: doc.fileUrl })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
