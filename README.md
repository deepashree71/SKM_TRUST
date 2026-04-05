# NGO Trust Digital Platform
### Shree Kankai Mataji Education & Charitable Trust

A full-stack NGO platform built with React + Node.js + MongoDB.

---

## 📋 CREDENTIALS & SERVICES NEEDED

### 1. REQUIRED (App won't work without these)

| Service | What it's for | How to get |
|---------|--------------|------------|
| **MongoDB** | Database | Install locally OR use [MongoDB Atlas](https://cloud.mongodb.com) (free tier) |
| **JWT Secret** | User authentication | Any long random string (min 32 chars) |
| **Razorpay** | Payment gateway | Sign up at [razorpay.com](https://razorpay.com) → Dashboard → API Keys |

### 2. OPTIONAL (App works without these, but features are limited)

| Service | What it's for | How to get |
|---------|--------------|------------|
| **Cloudinary** | Image upload & storage | Sign up at [cloudinary.com](https://cloudinary.com) (free tier: 10GB) |
| **Gmail SMTP** | Email notifications, receipts | Enable 2FA on Gmail → [App Passwords](https://myaccount.google.com/apppasswords) |
| **Twilio** | SMS/WhatsApp notifications | Sign up at [twilio.com](https://www.twilio.com) (trial account available) |

---

## 🔑 ADMIN LOGIN (Default after seed)
- **Email:** admin@ngotrust.org
- **Password:** Admin@1234

> ⚠️ Change these immediately in production!

---

## 🚀 QUICK SETUP (Step by Step)

### Prerequisites
- Node.js >= 18 → [Download](https://nodejs.org)
- MongoDB → [Download](https://www.mongodb.com/try/download/community) OR use Atlas (cloud)

---

### STEP 1 — Setup Backend

```bash
cd backend
cp .env .env.backup    # keep original as backup

# Open backend/.env and fill in your values (see below)
```

**Minimum required in `backend/.env`:**
```env
MONGODB_URI=mongodb://localhost:27017/ngo_trust
JWT_SECRET=my_super_secret_key_change_this_in_production
```

**For payments (Razorpay):**
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

**For emails (Gmail):**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx    # Gmail App Password (16 chars, spaces ok)
```

Then install & run:
```bash
npm install
npm run seed     # Creates admin + demo data
npm run dev      # Starts on http://localhost:5000
```

---

### STEP 2 — Setup Frontend

```bash
# From project root (not backend/)
cp .env .env.backup

# Open .env and set your Razorpay key:
# VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
```

**Minimum required in `.env` (root):**
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
```

Then:
```bash
npm install
npm run dev      # Opens http://localhost:5173
```

---

### STEP 3 — Seed Database
```bash
cd backend
npm run seed
```
This creates:
- Admin user (admin@ngotrust.org / Admin@1234)
- 4 sample programs
- 2 sample events
- 3 sample stories
- Gallery images
- Impact metrics

---

## 📁 PROJECT STRUCTURE

```
ngo-final/
├── src/                        # React Frontend
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx      # Navigation + Login button
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx
│   │   ├── sections/           # Homepage sections
│   │   └── common/             # Reusable components
│   ├── pages/
│   │   ├── Auth/
│   │   │   └── LoginModal.jsx  # Login & Register modal
│   │   ├── Home/
│   │   ├── About/
│   │   ├── Programs/
│   │   ├── Events/
│   │   ├── Donate/             # Razorpay payment integration
│   │   ├── Volunteer/
│   │   ├── Dashboard/          # User dashboard (real API)
│   │   ├── Gallery/
│   │   ├── Stories/
│   │   ├── Transparency/
│   │   ├── Contact/
│   │   ├── ImpactMap/
│   │   ├── GenerateID/
│   │   └── Verify/             # Certificate verification
│   ├── context/
│   │   ├── AuthContext.jsx     # Login state management
│   │   └── LangContext.jsx     # Multi-language (EN/HI/GU/MR/TA)
│   └── services/
│       └── api.js              # All API calls
│
└── backend/                    # Node.js Backend
    ├── server.js               # Express entry point
    ├── config/db.js            # MongoDB connection
    ├── middleware/auth.js      # JWT + admin protection
    ├── models/                 # 17 MongoDB models
    │   ├── User.js
    │   ├── Donation.js
    │   ├── Volunteer.js
    │   ├── Event.js
    │   ├── Certificate.js
    │   └── ... (12 more)
    ├── routes/                 # 15 API route files
    │   ├── auth.js
    │   ├── admin.js            # All /admin/* endpoints
    │   ├── donations.js        # Razorpay integration
    │   └── ... (12 more)
    └── utils/
        ├── pdfGen.js           # Puppeteer PDF generation
        ├── notify.js           # Nodemailer + Twilio
        └── seed.js             # Demo data seeder
```

---

## 🌐 PAGES & ROUTES

| URL | Page |
|-----|------|
| `/` | Home |
| `/about` | About the Trust |
| `/programs` | All Programs |
| `/events` | Events |
| `/volunteer` | Volunteer Registration |
| `/donate` | Donate (Razorpay) |
| `/gallery` | Photo Gallery |
| `/stories` | Impact Stories |
| `/transparency` | Documents & Reports |
| `/contact` | Contact Form |
| `/impact-map` | India Impact Map |
| `/dashboard` | User Dashboard |
| `/generate-id` | Generate Volunteer ID |
| `/verify/:token` | Verify Certificate |

---

## 🔌 API BASE URL

**Development:** `http://localhost:5000/api/v1`

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | /auth/register | Public |
| POST | /auth/login | Public |
| GET | /auth/me | JWT |
| GET | /programs | Public |
| GET | /events | Public |
| POST | /donations/create | JWT |
| POST | /donations/verify-payment | JWT |
| POST | /volunteers/apply | JWT |
| GET | /certificates/verify/:token | Public |
| POST | /contact | Public |
| GET | /admin/stats | Admin JWT |

---

## 💳 RAZORPAY SETUP

1. Create account at [razorpay.com](https://razorpay.com)
2. Go to **Settings → API Keys → Generate Test Key**
3. Copy `Key ID` and `Key Secret`
4. Add to `backend/.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxx
   RAZORPAY_KEY_SECRET=xxxx
   ```
5. Add to root `.env`:
   ```
   VITE_RAZORPAY_KEY_ID=rzp_test_xxxx
   ```

**Test Cards for Razorpay:**
- Card: `4111 1111 1111 1111` | Expiry: any future | CVV: any 3 digits
- UPI: `success@razorpay`

---

## 📧 GMAIL SMTP SETUP

1. Enable 2-Factor Authentication on your Gmail
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Generate App Password for "Mail"
4. Copy the 16-character password
5. Add to `backend/.env`:
   ```
   SMTP_USER=youremail@gmail.com
   SMTP_PASS=abcd efgh ijkl mnop
   ```

---

## ☁️ CLOUDINARY SETUP (Image Uploads)

1. Sign up at [cloudinary.com](https://cloudinary.com) (free: 10GB)
2. Go to Dashboard → copy Cloud Name, API Key, API Secret
3. Add to `backend/.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

---

## 🔧 PRODUCTION DEPLOYMENT

1. Set `NODE_ENV=production` in backend `.env`
2. Set `FRONTEND_URL=https://yourdomain.com`
3. Use strong `JWT_SECRET` (random 64+ chars)
4. Use MongoDB Atlas instead of local MongoDB
5. Use Razorpay **Live** keys (not test)
6. Install Chromium for PDF generation:
   ```bash
   apt-get install -y chromium-browser
   ```
7. Build frontend: `npm run build` (creates `dist/`)
8. Serve `dist/` via Nginx or same Express server

---

## ❗ TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| `MongoDB connection failed` | Check MONGODB_URI, ensure MongoDB is running |
| `Razorpay order failed` | Verify RAZORPAY_KEY_ID and KEY_SECRET |
| `JWT_SECRET error` | Make sure JWT_SECRET is set in backend/.env |
| `Email not sending` | Check Gmail App Password, not your login password |
| `PDF generation fails` | Install Chromium: `apt install chromium-browser` |
| `CORS error` | Set FRONTEND_URL in backend/.env to match your frontend URL |
| `Port 5000 in use` | Change PORT in backend/.env |
