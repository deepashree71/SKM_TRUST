const mongoose = require('mongoose')

const storySchema = new mongoose.Schema({
  slug:       { type: String, required: true, unique: true },
  type:       { type: String, enum: ['impact_story', 'testimonial', 'success_story'], required: true },
  name:       { type: String, required: true },
  initials:   { type: String, required: true },
  location:   { type: String, required: true },
  tag:        { type: String, required: true },
  title:      { type: String, required: true },
  text:       { type: String, required: true },
  imageUrl:   { type: String },
  rating:     { type: Number, min: 1, max: 5 },
  isActive:   { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Story', storySchema)
