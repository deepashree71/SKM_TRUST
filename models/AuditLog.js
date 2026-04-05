const mongoose = require('mongoose')

const auditLogSchema = new mongoose.Schema({
  adminId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action:           { type: String, required: true },
  targetCollection: { type: String, required: true },
  targetId:         { type: mongoose.Schema.Types.ObjectId, required: true },
  details:          { type: mongoose.Schema.Types.Mixed },
  ip:               { type: String },
}, { timestamps: true })

module.exports = mongoose.model('AuditLog', auditLogSchema)
