const mongoose = require('mongoose')

const transparencyDocSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  category:    { type: String, enum: ['Annual Report', 'Audit Report', 'Financial Statement', 'Project Report', 'Other'], required: true },
  fileUrl:     { type: String, required: true },
  fileType:    { type: String, default: 'pdf' },
  year:        { type: Number, required: true },
  isActive:    { type: Boolean, default: true },
  downloadCount:{ type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('TransparencyDoc', transparencyDocSchema)
