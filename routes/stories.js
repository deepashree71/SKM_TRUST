const express = require('express')
const router = express.Router()
const Story = require('../models/Story')

// GET /stories
router.get('/', async (req, res) => {
  try {
    const filter = { isActive: true }
    if (req.query.type) filter.type = req.query.type
    if (req.query.tag) filter.tag = req.query.tag
    const stories = await Story.find(filter).sort('-createdAt')
    res.json({ success: true, stories })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /stories/:slug
router.get('/:slug', async (req, res) => {
  try {
    const story = await Story.findOne({ slug: req.params.slug, isActive: true })
    if (!story) return res.status(404).json({ success: false, message: 'Story not found.' })
    res.json({ success: true, story })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
