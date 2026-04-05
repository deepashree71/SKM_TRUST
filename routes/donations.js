const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const Razorpay = require('razorpay')
const Donation = require('../models/Donation')
const { protect } = require('../middleware/auth')
const { generateReceiptPDF } = require('../utils/pdfGen')
const { sendNotification } = require('../utils/notify')

const getRazorpay = () => new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// POST /donations/create  — one-time order
router.post('/create', protect, async (req, res) => {
  try {
    const { amount, currency = 'INR', programId, donorMessage } = req.body
    if (!amount) return res.status(400).json({ success: false, message: 'Amount is required.' })

    const razorpay = getRazorpay()
    const order = await razorpay.orders.create({ amount, currency, receipt: `rcpt_${Date.now()}` })

    const donation = await Donation.create({
      userId: req.user._id,
      programId,
      razorpayOrderId: order.id,
      amount,
      currency,
      type: 'one_time',
      donorMessage,
    })

    res.status(201).json({ success: true, order, donationId: donation._id })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /donations/verify-payment  — frontend callback
router.post('/verify-payment', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex')

    if (expected !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed.' })
    }

    const donation = await Donation.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature, status: 'success' },
      { new: true }
    )

    if (donation) {
      await sendNotification({
        userId: donation.userId,
        title: 'Donation Successful!',
        message: `Your donation of ₹${donation.amount / 100} was received. Receipt: ${donation.receiptNumber}`,
        type: 'donation',
        channel: 'in_app',
      })
    }

    res.json({ success: true, message: 'Payment verified successfully.', donation })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /donations/webhook  — Razorpay webhook (NO JWT)
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature']
    const body = req.body // raw buffer
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET).update(body).digest('hex')

    if (expected !== signature) {
      return res.status(400).json({ success: false, message: 'Webhook signature mismatch.' })
    }

    const event = JSON.parse(body.toString())

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity
      await Donation.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        { razorpayPaymentId: payment.id, status: 'success' }
      )
    }

    if (event.event === 'subscription.charged') {
      const payment = event.payload.payment.entity
      const sub = event.payload.subscription.entity
      // Log each recurring charge as a separate donation record
      await Donation.create({
        userId: (await Donation.findOne({ subscriptionId: sub.id }))?.userId,
        razorpayOrderId: payment.order_id || `webhook_${Date.now()}`,
        razorpayPaymentId: payment.id,
        amount: payment.amount,
        currency: payment.currency || 'INR',
        type: 'recurring',
        subscriptionId: sub.id,
        status: 'success',
      }).catch(() => {}) // silent if userId missing
    }

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /donations/subscribe  — recurring
router.post('/subscribe', protect, async (req, res) => {
  try {
    const { planId, totalCount = 12, programId, recurringFrequency } = req.body
    if (!planId) return res.status(400).json({ success: false, message: 'planId is required.' })

    const razorpay = getRazorpay()
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: totalCount,
      quantity: 1,
    })

    // Placeholder donation record
    const donation = await Donation.create({
      userId: req.user._id,
      programId,
      razorpayOrderId: `sub_order_${subscription.id}`,
      amount: 0, // filled per charge
      currency: 'INR',
      type: 'recurring',
      subscriptionId: subscription.id,
      subscriptionPlanId: planId,
      recurringFrequency,
      status: 'pending',
    })

    res.status(201).json({ success: true, subscription, donationId: donation._id })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /donations/subscription/:id/cancel
router.put('/subscription/:id/cancel', protect, async (req, res) => {
  try {
    const razorpay = getRazorpay()
    await razorpay.subscriptions.cancel(req.params.id)
    await Donation.updateMany({ subscriptionId: req.params.id, userId: req.user._id }, { status: 'refunded' })
    res.json({ success: true, message: 'Subscription cancelled.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /donations/subscriptions
router.get('/subscriptions', protect, async (req, res) => {
  try {
    const subs = await Donation.find({ userId: req.user._id, type: 'recurring' }).sort('-createdAt')
    res.json({ success: true, subscriptions: subs })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /donations/my-history
router.get('/my-history', protect, async (req, res) => {
  try {
    const donations = await Donation.find({ userId: req.user._id, status: 'success' })
      .populate('programId', 'title slug')
      .sort('-createdAt')
    res.json({ success: true, donations })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /donations/:id/receipt  — PDF blob
router.get('/:id/receipt', protect, async (req, res) => {
  try {
    const donation = await Donation.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('userId', 'name email')
      .populate('programId', 'title')
    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found.' })

    const pdfBuffer = await generateReceiptPDF(donation)
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="receipt-${donation.receiptNumber}.pdf"` })
    res.send(pdfBuffer)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
