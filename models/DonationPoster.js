const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const donationPosterSchema = new mongoose.Schema({
  donationId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  posterUrl:    { type: String, required: true },
  shareToken:   { type: String, unique: true, default: () => uuidv4() },
  privacy:      { type: String, enum: ['public', 'private', 'anonymous'], default: 'public' },
  showAmount:   { type: Boolean, default: true },
  showName:     { type: Boolean, default: true },
  shareCount:   { type: Number, default: 0 },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('DonationPoster', donationPosterSchema)
