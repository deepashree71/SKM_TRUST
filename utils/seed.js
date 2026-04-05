require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = require('../config/db')
const User = require('../models/User')
const Program = require('../models/Program')
const Event = require('../models/Event')
const Story = require('../models/Story')
const Gallery = require('../models/Gallery')
const { ImpactLocation, ImpactMetric } = require('../models/ImpactLocation')
const { CmsPage, CmsSettings } = require('../models/CmsPage')
const TransparencyDoc = require('../models/TransparencyDoc')
const NotificationPreference = require('../models/NotificationPreference')

const seed = async () => {
  await connectDB()
  console.log('🌱 Starting seed...')

  // Admin user
  const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@ngotrust.org' })
  if (!existingAdmin) {
    const admin = await User.create({ name: 'Admin', email: process.env.ADMIN_EMAIL || 'admin@ngotrust.org', password: process.env.ADMIN_PASSWORD || 'Admin@1234', role: 'admin', phone: '+919999999999' })
    await NotificationPreference.create({ userId: admin._id })
    console.log('✅ Admin created:', admin.email)
  } else {
    console.log('⏭  Admin already exists')
  }

  // Programs
  const programCount = await Program.countDocuments()
  if (programCount === 0) {
    await Program.insertMany([
      { slug: 'education-for-all', title: 'Education For All', shortDescription: 'Providing quality education to underprivileged children across rural India.', description: 'Our Education For All program reaches 10,000+ students in 50 villages, providing free schooling, books, uniforms and meals.', category: 'Education', status: 'active', isFeatured: true, beneficiaryCount: 10000, targetAmount: 5000000, raisedAmount: 3200000, location: 'Rajasthan, UP, Bihar' },
      { slug: 'womens-health-initiative', title: "Women's Health Initiative", shortDescription: 'Free healthcare and wellness programs for women in underserved communities.', description: 'Comprehensive healthcare for women including maternal health, nutrition counseling and preventive screenings.', category: 'Health', status: 'active', isFeatured: true, beneficiaryCount: 5000, targetAmount: 3000000, raisedAmount: 1800000, location: 'Maharashtra, Gujarat' },
      { slug: 'skill-development-program', title: 'Skill Development Program', shortDescription: 'Vocational training and livelihood skills for unemployed youth.', description: 'We train youth in digital skills, tailoring, carpentry, and more to enable self-employment and job placement.', category: 'Skill', status: 'active', isFeatured: false, beneficiaryCount: 2000, targetAmount: 2000000, raisedAmount: 900000, location: 'Tamil Nadu, Karnataka' },
      { slug: 'clean-water-mission', title: 'Clean Water Mission', shortDescription: 'Bringing safe drinking water to villages lacking basic water infrastructure.', description: 'Installing hand pumps, water purifiers and training communities on water hygiene in 30 drought-prone villages.', category: 'Community', status: 'active', isFeatured: false, beneficiaryCount: 8000, targetAmount: 4000000, raisedAmount: 2100000, location: 'Madhya Pradesh, Odisha' },
    ])
    console.log('✅ Programs seeded')
  }

  // Events
  const eventCount = await Event.countDocuments()
  if (eventCount === 0) {
    const now = new Date()
    await Event.insertMany([
      { slug: 'annual-volunteer-day-2026', title: 'Annual Volunteer Day 2026', description: 'Join us for our biggest volunteer celebration — workshops, networking, and awards.', startDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), endDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), registrationDeadline: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), venue: { name: 'Community Hall', address: '12 Gandhi Road', city: 'Mumbai', state: 'Maharashtra', latitude: 19.0760, longitude: 72.8777 }, coordinator: { name: 'Priya Sharma', phone: '+919876543210', email: 'priya@ngotrust.org' }, capacity: 200, isFree: true, certificateEnabled: true, status: 'upcoming' },
      { slug: 'health-camp-chennai', title: 'Free Health Camp — Chennai', description: 'Free medical check-ups, blood tests and consultation for all residents.', startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), venue: { name: 'Town Park', city: 'Chennai', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707 }, coordinator: { name: 'Dr. Ramesh Kumar', phone: '+918765432109', email: 'ramesh@ngotrust.org' }, capacity: 500, isFree: true, certificateEnabled: false, status: 'upcoming' },
    ])
    console.log('✅ Events seeded')
  }

  // Stories
  const storyCount = await Story.countDocuments()
  if (storyCount === 0) {
    await Story.insertMany([
      { slug: 'rania-education-story', type: 'impact_story', name: 'Rania Devi', initials: 'RD', location: 'Rajasthan', tag: 'Education', title: 'From a mud floor to a bright future', text: "Thanks to NGO Trust's Education For All program, my daughter now attends school every day. Two years ago we couldn't afford notebooks. Today she dreams of becoming a doctor.", isActive: true, isFeatured: true },
      { slug: 'amit-volunteer-testimonial', type: 'testimonial', name: 'Amit Kulkarni', initials: 'AK', location: 'Pune', tag: 'Volunteer', title: 'Volunteering changed my perspective on life', text: "I joined NGO Trust as a weekend volunteer and it became the most meaningful part of my week. Seeing the impact of small acts of kindness is incredibly humbling.", rating: 5, isActive: true, isFeatured: true },
      { slug: 'meena-skill-success', type: 'success_story', name: 'Meena R.', initials: 'MR', location: 'Tamil Nadu', tag: 'Women Empowerment', title: 'Learning to code, learning to dream', text: "The digital skills course gave me more than a job — it gave me confidence. I now work remotely and support my entire family on my own income.", isActive: true, isFeatured: false },
    ])
    console.log('✅ Stories seeded')
  }

  // Gallery
  const galleryCount = await Gallery.countDocuments()
  if (galleryCount === 0) {
    await Gallery.insertMany([
      { title: 'Annual Volunteer Day 2025', imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800', category: 'Events', description: 'Volunteers gathered for our annual celebration.' },
      { title: 'Health Camp — Village Outreach', imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800', category: 'Programs', description: 'Free health camp for village residents.' },
      { title: 'School Inauguration', imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800', category: 'Programs', description: 'New school building inaugurated in rural Rajasthan.' },
    ])
    console.log('✅ Gallery seeded')
  }

  // Impact Metrics
  const metricCount = await ImpactMetric.countDocuments()
  if (metricCount === 0) {
    await ImpactMetric.insertMany([
      { key: 'lives_impacted', label: 'Lives Impacted', value: 50000, icon: '❤️' },
      { key: 'volunteers', label: 'Active Volunteers', value: 1200, icon: '🙋' },
      { key: 'programs', label: 'Programs Running', value: 12, icon: '📋' },
      { key: 'villages', label: 'Villages Covered', value: 85, icon: '🏘️' },
    ])
    console.log('✅ Impact metrics seeded')
  }

  // Impact Locations
  const locCount = await ImpactLocation.countDocuments()
  if (locCount === 0) {
    await ImpactLocation.insertMany([
      { name: 'Jaipur District', state: 'Rajasthan', latitude: 26.9124, longitude: 75.7873, beneficiaryCount: 12000 },
      { name: 'Patna District', state: 'Bihar', latitude: 25.5941, longitude: 85.1376, beneficiaryCount: 8000 },
      { name: 'Chennai Zone', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707, beneficiaryCount: 6500 },
      { name: 'Pune District', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567, beneficiaryCount: 5000 },
    ])
    console.log('✅ Impact locations seeded')
  }

  // Transparency Docs
  const docCount = await TransparencyDoc.countDocuments()
  if (docCount === 0) {
    await TransparencyDoc.insertMany([
      { title: 'Annual Report 2024-25', description: 'Complete annual report with program outcomes and financials.', category: 'Annual Report', fileUrl: 'https://example.com/annual-report-2025.pdf', year: 2025 },
      { title: 'Audit Report FY 2024-25', description: 'Independent audit report by CA firm.', category: 'Audit Report', fileUrl: 'https://example.com/audit-2025.pdf', year: 2025 },
    ])
    console.log('✅ Transparency docs seeded')
  }

  // CMS Settings
  const settingsCount = await CmsSettings.countDocuments()
  if (settingsCount === 0) {
    await CmsSettings.create({ siteName: 'NGO Trust', tagline: 'Empowering Lives, Building Communities', primaryColor: '#e05c2a', contactEmail: 'contact@ngotrust.org', contactPhone: '+91-9876543210', address: '12 Gandhi Road, Mumbai, Maharashtra 400001', socialLinks: { facebook: 'https://facebook.com/ngotrust', twitter: 'https://twitter.com/ngotrust', instagram: 'https://instagram.com/ngotrust', youtube: 'https://youtube.com/ngotrust' } })
    console.log('✅ CMS settings seeded')
  }

  console.log('\n🎉 Seed complete!')
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
