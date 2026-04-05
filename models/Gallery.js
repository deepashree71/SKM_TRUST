const mongoose = require('mongoose')

const gallerySchema = new mongoose.Schema({
  title:       { type: String, required: true },
  imageUrl:    { type: String, required: true },
  category:    { type: String, enum: ['Events', 'Programs', 'Volunteers', 'Community', 'Other'], default: 'Other' },
  description: { type: String },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Gallery', gallerySchema)
