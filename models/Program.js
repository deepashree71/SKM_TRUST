const mongoose = require('mongoose')

const programSchema = new mongoose.Schema({
  slug:             { type: String, required: true, unique: true },
  title:            { type: String, required: true },
  shortDescription: { type: String, required: true, maxlength: 200 },
  description:      { type: String, required: true },
  heroImage:        { type: String },
  gallery:          [{ type: String }],
  category:         { type: String, enum: ['Education', 'Health', 'Women', 'Community', 'Skill'], required: true },
  status:           { type: String, enum: ['active', 'completed', 'upcoming', 'paused'], default: 'active' },
  isFeatured:       { type: Boolean, default: false },
  beneficiaryCount: { type: Number, default: 0 },
  targetAmount:     { type: Number },
  raisedAmount:     { type: Number, default: 0 },
  startDate:        { type: Date },
  endDate:          { type: Date },
  location:         { type: String },
  seoTitle:         { type: String },
  seoDescription:   { type: String },
  seoKeywords:      [{ type: String }],
}, { timestamps: true })

module.exports = mongoose.model('Program', programSchema)
