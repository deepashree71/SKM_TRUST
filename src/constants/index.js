export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  PROGRAMS: '/programs',
  EVENTS: '/events',
  VOLUNTEER: '/volunteer',
  DONATE: '/donate',
  GALLERY: '/gallery',
  STORIES: '/stories',
  TRANSPARENCY: '/transparency',
  CONTACT: '/contact',
  IMPACT_MAP: '/impact-map',
  DASHBOARD: '/dashboard',
  GENERATE_ID: '/generate-id',
  VERIFY: '/verify',
}

export const ROLES = {
  VISITOR: 'visitor',
  DONOR: 'donor',
  VOLUNTEER: 'volunteer',
  PARTICIPANT: 'participant',
  ADMIN: 'admin',
}

export const STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ACTIVE: 'active',
  COMPLETED: 'completed',
}

export const DOC_TYPES = {
  ID_CARD: 'id_card',
  CERTIFICATE: 'certificate',
  DONATION_RECEIPT: 'donation_receipt',
  APPOINTMENT_LETTER: 'appointment_letter',
}

// NOTE: Generated documents (ID cards, certificates, receipts) are:
// 1. Created on-demand by Puppeteer (backend renders HTML template → PDF)
// 2. Stored TEMPORARILY in backend/storage/ (not permanently)
// 3. Only metadata saved in DB: { user_id, doc_type, name, date_generated }
// 4. User downloads immediately, temp file cleaned up after download

export const DONATION_AMOUNTS = [500, 1000, 2000, 5000, 10000, 25000]

export const PROGRAM_CATEGORIES = [
  'Education',
  'Healthcare',
  'Skill Development',
  'Women Empowerment',
  'Environment',
  'Community',
]
