const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  slug:                 { type: String, required: true, unique: true },
  title:                { type: String, required: true },
  description:          { type: String, required: true },
  heroImage:            { type: String },
  startDate:            { type: Date, required: true },
  endDate:              { type: Date },
  registrationDeadline: { type: Date },
  venue: {
    name:      { type: String },
    address:   { type: String },
    city:      { type: String },
    state:     { type: String },
    latitude:  { type: Number },
    longitude: { type: Number },
  },
  coordinator: {
    name:  { type: String },
    phone: { type: String },
    email: { type: String },
  },
  capacity:             { type: Number },
  attendeeCount:        { type: Number, default: 0 },
  isFree:               { type: Boolean, default: true },
  certificateEnabled:   { type: Boolean, default: false },
  certificateTemplate:  { type: String },
  status:               { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
}, { timestamps: true })

module.exports = mongoose.model('Event', eventSchema)
