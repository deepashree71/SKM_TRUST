const mongoose = require('mongoose')

const contactMessageSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true },
  phone:     { type: String },
  subject:   { type: String, required: true },
  message:   { type: String, required: true },
  isRead:    { type: Boolean, default: false },
  repliedAt: { type: Date },
  repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

module.exports = mongoose.model('ContactMessage', contactMessageSchema)
