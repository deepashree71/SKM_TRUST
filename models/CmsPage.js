const mongoose = require('mongoose')

const cmsPageSchema = new mongoose.Schema({
  key:       { type: String, required: true, unique: true },
  title:     { type: String, required: true },
  content:   { type: mongoose.Schema.Types.Mixed },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

const cmsSettingsSchema = new mongoose.Schema({
  siteName:       { type: String, default: 'NGO Trust' },
  tagline:        { type: String },
  logoUrl:        { type: String },
  faviconUrl:     { type: String },
  primaryColor:   { type: String, default: '#e05c2a' },
  contactEmail:   { type: String },
  contactPhone:   { type: String },
  address:        { type: String },
  socialLinks:    { type: mongoose.Schema.Types.Mixed },
  metaDescription:{ type: String },
  updatedBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

module.exports = {
  CmsPage:     mongoose.model('CmsPage', cmsPageSchema),
  CmsSettings: mongoose.model('CmsSettings', cmsSettingsSchema),
}
