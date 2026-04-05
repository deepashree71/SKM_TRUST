const mongoose = require('mongoose')

const impactLocationSchema = new mongoose.Schema({
  name:             { type: String, required: true },
  state:            { type: String, required: true },
  district:         { type: String },
  latitude:         { type: Number, required: true },
  longitude:        { type: Number, required: true },
  programIds:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Program' }],
  beneficiaryCount: { type: Number, default: 0 },
  description:      { type: String },
  isActive:         { type: Boolean, default: true },
}, { timestamps: true })

const impactMetricSchema = new mongoose.Schema({
  key:   { type: String, required: true, unique: true },
  label: { type: String, required: true },
  value: { type: Number, required: true },
  icon:  { type: String },
}, { timestamps: true })

module.exports = {
  ImpactLocation: mongoose.model('ImpactLocation', impactLocationSchema),
  ImpactMetric:   mongoose.model('ImpactMetric', impactMetricSchema),
}
