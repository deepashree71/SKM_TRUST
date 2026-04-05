const mongoose = require('mongoose')

const donationSchema = new mongoose.Schema({
  userId:               { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  programId:            { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
  razorpayOrderId:      { type: String, required: true },
  razorpayPaymentId:    { type: String },
  razorpaySignature:    { type: String },
  amount:               { type: Number, required: true }, // in paise
  currency:             { type: String, default: 'INR' },
  type:                 { type: String, enum: ['one_time', 'recurring'], required: true },
  subscriptionId:       { type: String },
  subscriptionPlanId:   { type: String },
  recurringFrequency:   { type: String, enum: ['monthly', 'quarterly', 'yearly'] },
  status:               { type: String, enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending' },
  receiptNumber:        { type: String, unique: true },
  donorMessage:         { type: String },
}, { timestamps: true })

donationSchema.pre('save', async function (next) {
  if (this.isNew && !this.receiptNumber) {
    const count = await mongoose.model('Donation').countDocuments()
    const year = new Date().getFullYear()
    this.receiptNumber = `REC-${year}-${String(count + 1).padStart(6, '0')}`
  }
  next()
})

module.exports = mongoose.model('Donation', donationSchema)
