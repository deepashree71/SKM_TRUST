const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:         { type: String, trim: true },
  password:      { type: String, required: true, select: false },
  role:          { type: String, enum: ['visitor', 'donor', 'volunteer', 'admin'], default: 'donor' },
  isBlocked:     { type: Boolean, default: false },
  address:       { type: String },
  city:          { type: String },
  state:         { type: String },
  pincode:       { type: String },
  panNumber:     { type: String },
  profileImage:  { type: String },
  resetPasswordToken:   { type: String },
  resetPasswordExpire:  { type: Date },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password)
}

module.exports = mongoose.model('User', userSchema)
