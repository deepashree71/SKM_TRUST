const AuditLog = require('../models/AuditLog')

const logAudit = async (req, action, targetCollection, targetId, details = {}) => {
  try {
    await AuditLog.create({
      adminId: req.user._id,
      action,
      targetCollection,
      targetId,
      details,
      ip: req.ip || req.headers['x-forwarded-for'],
    })
  } catch (err) {
    console.error(`[AuditLog Error] ${err.message}`)
  }
}

module.exports = { logAudit }
