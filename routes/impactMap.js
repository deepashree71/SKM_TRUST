const express = require('express')
const router = express.Router()
const { ImpactLocation, ImpactMetric } = require('../models/ImpactLocation')

// GET /impact-map/locations
router.get('/locations', async (req, res) => {
  try {
    const filter = { isActive: true }
    if (req.query.state) filter.state = req.query.state
    const locations = await ImpactLocation.find(filter).populate('programIds', 'title slug category')
    res.json({ success: true, locations })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /impact-map/metrics
router.get('/metrics', async (req, res) => {
  try {
    const metrics = await ImpactMetric.find()
    res.json({ success: true, metrics })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
