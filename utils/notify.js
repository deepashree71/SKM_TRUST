const nodemailer = require('nodemailer')
const Notification = require('../models/Notification')
const NotificationPreference = require('../models/NotificationPreference')

// ─── Email Transport ───────────────────────────────────────────────────────────
const getTransporter = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

const sendEmail = async ({ to, subject, html, text }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[Email Skipped - no SMTP config] To: ${to} | Subject: ${subject}`)
    return
  }
  try {
    const transporter = getTransporter()
    await transporter.sendMail({ from: `"${process.env.FROM_NAME || 'NGO Trust'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`, to, subject, html, text })
    console.log(`[Email Sent] To: ${to} | Subject: ${subject}`)
  } catch (err) {
    console.error(`[Email Error] ${err.message}`)
  }
}

// ─── SMS via Twilio ────────────────────────────────────────────────────────────
const sendSMS = async (to, message) => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.log(`[SMS Skipped - no Twilio config] To: ${to}`)
    return
  }
  try {
    const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    await twilio.messages.create({ body: message, from: process.env.TWILIO_PHONE, to })
    console.log(`[SMS Sent] To: ${to}`)
  } catch (err) {
    console.error(`[SMS Error] ${err.message}`)
  }
}

// ─── WhatsApp via Twilio ────────────────────────────────────────────────────────
const sendWhatsApp = async (to, message) => {
  if (!process.env.TWILIO_ACCOUNT_SID) return
  try {
    const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    await twilio.messages.create({ body: message, from: process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886', to: `whatsapp:${to}` })
  } catch (err) {
    console.error(`[WhatsApp Error] ${err.message}`)
  }
}

// ─── Main sendNotification ────────────────────────────────────────────────────
const sendNotification = async ({ userId, title, message, type, channel, link }) => {
  try {
    // Always create in-app record
    await Notification.create({ userId, title, message, type, channel: channel || 'in_app', link })

    // Check preferences for external channels
    if (channel && channel !== 'in_app') {
      const prefs = await NotificationPreference.findOne({ userId })
      const User = require('../models/User') // lazy to avoid circular
      const user = await User.findById(userId).select('email phone')
      if (!user) return

      if (channel === 'email' && prefs?.email) {
        await sendEmail({ to: user.email, subject: title, html: `<p>${message}</p>${link ? `<p><a href="${link}">View Details</a></p>` : ''}` })
      }
      if (channel === 'sms' && prefs?.sms && user.phone) {
        await sendSMS(user.phone, `${title}: ${message}`)
      }
      if (channel === 'whatsapp' && prefs?.whatsapp && user.phone) {
        await sendWhatsApp(user.phone, `*${title}*\n${message}`)
      }
    }
  } catch (err) {
    console.error(`[Notification Error] ${err.message}`)
  }
}

module.exports = { sendEmail, sendSMS, sendWhatsApp, sendNotification }
