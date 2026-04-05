require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const path = require('path')
const fs = require('fs')
const connectDB = require('./config/db')

// ─── Ensure storage dirs exist ─────────────────────────────────────────────────
const storageDir = path.join(__dirname, 'storage')
const tempDir    = path.join(storageDir, 'temp')
if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true })
if (!fs.existsSync(tempDir))    fs.mkdirSync(tempDir,    { recursive: true })

// ─── Connect Database ─────────────────────────────────────────────────────────
connectDB()

const app = express()

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
})
app.use('/api/', limiter)

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use('/api/v1/donations/webhook', express.raw({ type: 'application/json' }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ─── Logging ──────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// ─── Static Files ─────────────────────────────────────────────────────────────
app.use('/storage', express.static(path.join(__dirname, 'storage')))

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/v1/auth',              require('./routes/auth'))
app.use('/api/v1/donations',         require('./routes/donations'))
app.use('/api/v1/donation-posters',  require('./routes/donationPosters'))
app.use('/api/v1/programs',          require('./routes/programs'))
app.use('/api/v1/volunteers',        require('./routes/volunteers'))
app.use('/api/v1/events',            require('./routes/events'))
app.use('/api/v1/certificates',      require('./routes/certificates'))
app.use('/api/v1/gallery',           require('./routes/gallery'))
app.use('/api/v1/stories',           require('./routes/stories'))
app.use('/api/v1/transparency',      require('./routes/transparency'))
app.use('/api/v1/contact',           require('./routes/contact'))
app.use('/api/v1/impact-map',        require('./routes/impactMap'))
app.use('/api/v1/notifications',     require('./routes/notifications'))
app.use('/api/v1/cms',               require('./routes/cms'))
app.use('/api/v1/admin',             require('./routes/admin'))

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'NGO Trust API is running', version: 'v1' })
})

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` })
})

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}/api/v1`)
})
