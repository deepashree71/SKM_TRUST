const express = require('express')
const router = express.Router()
const { CmsPage, CmsSettings } = require('../models/CmsPage')

// GET /cms/:key
router.get('/:key', async (req, res) => {
  try {
    const page = await CmsPage.findOne({ key: req.params.key })
    if (!page) return res.status(404).json({ success: false, message: 'Page not found.' })
    res.json({ success: true, page })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /cms/settings  (must be defined before /:key to avoid conflict — handled in server.js order)
router.get('/site/settings', async (req, res) => {
  try {
    const settings = await CmsSettings.findOne()
    res.json({ success: true, settings: settings || {} })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
