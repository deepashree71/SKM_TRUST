const mongoose = require('mongoose')

const eventRegistrationSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  status:       { type: String, enum: ['registered', 'attended', 'absent', 'cancelled'], default: 'registered' },
  registeredAt: { type: Date, default: Date.now },
  attendedAt:   { type: Date },
  markedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

eventRegistrationSchema.index({ userId: 1, eventId: 1 }, { unique: true })

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema)
