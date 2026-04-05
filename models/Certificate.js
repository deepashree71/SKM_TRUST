const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const certificateSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  certNumber:      { type: String, unique: true },
  verifyToken:     { type: String, unique: true, default: () => uuidv4() },
  certTitle:       { type: String, required: true },
  recipientName:   { type: String, required: true },
  eventName:       { type: String },
  issueDate:       { type: Date, default: Date.now },
  issuedBy:        { type: String, default: 'NGO Trust' },
  status:          { type: String, enum: ['pending', 'issued', 'revoked', 'reissued'], default: 'issued' },
  revokedAt:       { type: Date },
  revokedBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  revokeReason:    { type: String },
  reissuedFrom:    { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' },
  correctionNote:  { type: String },
  downloadCount:   { type: Number, default: 0 },
}, { timestamps: true })

certificateSchema.pre('save', async function (next) {
  if (this.isNew && !this.certNumber) {
    const count = await mongoose.model('Certificate').countDocuments()
    const year = new Date().getFullYear()
    this.certNumber = `NGO-CERT-${year}-${String(count + 1).padStart(4, '0')}`
  }
  next()
})

module.exports = mongoose.model('Certificate', certificateSchema)
