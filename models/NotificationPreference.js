const mongoose = require('mongoose')

const notificationPreferenceSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  email:    { type: Boolean, default: true },
  sms:      { type: Boolean, default: false },
  whatsapp: { type: Boolean, default: false },
  inApp:    { type: Boolean, default: true },
  updatedAt:{ type: Date, default: Date.now },
})

module.exports = mongoose.model('NotificationPreference', notificationPreferenceSchema)
