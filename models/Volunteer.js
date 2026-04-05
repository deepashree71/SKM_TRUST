const mongoose = require('mongoose')

const volunteerSchema = new mongoose.Schema({
  userId:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  volunteerNumber:  { type: String, unique: true },
  fullName:         { type: String, required: true },
  email:            { type: String, required: true },
  phone:            { type: String, required: true },
  address:          { type: String },
  city:             { type: String },
  state:            { type: String },
  pincode:          { type: String },
  dob:              { type: Date },
  gender:           { type: String, enum: ['male', 'female', 'other'] },
  skills:           [{ type: String }],
  availability:     { type: String },
  motivation:       { type: String },
  experience:       { type: String },
  profileImage:     { type: String },
  idCardGeneratedAt:{ type: Date },
  status:           { type: String, enum: ['pending', 'approved', 'rejected', 'suspended'], default: 'pending' },
  approvedAt:       { type: Date },
  approvedBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectionReason:  { type: String },
}, { timestamps: true })

// Auto-generate volunteer number on approval
volunteerSchema.pre('save', async function (next) {
  if (this.isNew && !this.volunteerNumber) {
    const count = await mongoose.model('Volunteer').countDocuments()
    const year = new Date().getFullYear()
    this.volunteerNumber = `VOL-${year}-${String(count + 1).padStart(4, '0')}`
  }
  next()
})

module.exports = mongoose.model('Volunteer', volunteerSchema)
