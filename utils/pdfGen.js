const puppeteer = require('puppeteer')

const launchBrowser = async () => puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
})

const htmlToPDF = async (html) => {
  const browser = await launchBrowser()
  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    const buffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' } })
    return buffer
  } finally {
    await browser.close()
  }
}

// ─── RECEIPT PDF ──────────────────────────────────────────────────────────────
const generateReceiptPDF = async (donation) => {
  const amountINR = (donation.amount / 100).toFixed(2)
  const date = new Date(donation.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; padding: 40px; }
    .header { text-align: center; border-bottom: 3px solid #e05c2a; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: bold; color: #e05c2a; }
    .title { font-size: 20px; margin-top: 8px; color: #555; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    td { padding: 12px 16px; border-bottom: 1px solid #eee; }
    td:first-child { font-weight: bold; width: 40%; color: #555; }
    .amount-row td { font-size: 18px; font-weight: bold; color: #e05c2a; background: #fff8f5; }
    .footer { text-align: center; margin-top: 40px; color: #888; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
    .stamp { display: inline-block; border: 2px solid #2ecc71; color: #2ecc71; padding: 6px 20px; border-radius: 4px; font-weight: bold; font-size: 14px; margin: 10px 0; }
  </style></head><body>
  <div class="header"><div class="logo">NGO Trust</div><div class="title">Donation Receipt</div></div>
  <div class="stamp">✓ PAYMENT SUCCESSFUL</div>
  <table>
    <tr><td>Receipt Number</td><td>${donation.receiptNumber}</td></tr>
    <tr><td>Donor Name</td><td>${donation.userId?.name || 'N/A'}</td></tr>
    <tr><td>Email</td><td>${donation.userId?.email || 'N/A'}</td></tr>
    <tr><td>Date</td><td>${date}</td></tr>
    <tr><td>Program</td><td>${donation.programId?.title || 'General Donation'}</td></tr>
    <tr><td>Payment ID</td><td>${donation.razorpayPaymentId || 'N/A'}</td></tr>
    <tr><td>Order ID</td><td>${donation.razorpayOrderId}</td></tr>
    <tr><td>Type</td><td>${donation.type === 'recurring' ? 'Recurring Donation' : 'One-Time Donation'}</td></tr>
    <tr class="amount-row"><td>Amount</td><td>₹${amountINR}</td></tr>
  </table>
  ${donation.donorMessage ? `<p><strong>Your Message:</strong> "${donation.donorMessage}"</p>` : ''}
  <p style="font-size:12px;color:#888;">This donation is eligible for tax exemption under Section 80G of the Income Tax Act, 1961.</p>
  <div class="footer"><p>NGO Trust | contact@ngotrust.org | www.ngotrust.org</p><p>Thank you for your generous contribution!</p></div>
  </body></html>`
  return htmlToPDF(html)
}

// ─── CERTIFICATE PDF ───────────────────────────────────────────────────────────
const generateCertificatePDF = async (cert) => {
  const date = new Date(cert.issueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${cert.verifyToken}`
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Open+Sans&display=swap');
    body { font-family: 'Open Sans', Arial, sans-serif; margin: 0; padding: 0; background: #fff; }
    .cert { width: 100%; min-height: 600px; border: 12px solid #e05c2a; padding: 50px; box-sizing: border-box; text-align: center; position: relative; }
    .cert::before { content: ''; position: absolute; inset: 20px; border: 2px solid #f0c080; pointer-events: none; }
    .ngo-name { font-size: 36px; color: #e05c2a; font-weight: bold; letter-spacing: 2px; }
    .cert-title { font-size: 16px; color: #888; letter-spacing: 4px; text-transform: uppercase; margin: 8px 0 40px; }
    .presented { font-size: 14px; color: #777; }
    .recipient { font-family: 'Playfair Display', serif; font-size: 42px; color: #2c3e50; margin: 16px 0; font-style: italic; }
    .event-desc { font-size: 15px; color: #555; max-width: 500px; margin: 0 auto 30px; }
    .event-name { font-weight: bold; color: #e05c2a; }
    .meta { display: flex; justify-content: space-around; margin: 40px 0 20px; }
    .meta div { text-align: center; }
    .meta .label { font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; }
    .meta .value { font-size: 14px; font-weight: bold; color: #333; margin-top: 4px; }
    .verify { font-size: 11px; color: #aaa; margin-top: 20px; }
    .cert-num { font-size: 12px; color: #bbb; }
  </style></head><body>
  <div class="cert">
    <div class="ngo-name">NGO TRUST</div>
    <div class="cert-title">Certificate of ${cert.certTitle}</div>
    <div class="presented">This is to certify that</div>
    <div class="recipient">${cert.recipientName}</div>
    <div class="event-desc">has successfully participated in<br><span class="event-name">${cert.eventName || cert.certTitle}</span></div>
    <div class="meta">
      <div><div class="label">Issue Date</div><div class="value">${date}</div></div>
      <div><div class="label">Certificate No.</div><div class="value">${cert.certNumber}</div></div>
      <div><div class="label">Issued By</div><div class="value">${cert.issuedBy}</div></div>
    </div>
    <div class="verify">Verify at: ${verifyUrl}</div>
  </div></body></html>`
  return htmlToPDF(html)
}

// ─── ID CARD PDF ───────────────────────────────────────────────────────────────
const generateIdCardPDF = async (volunteer) => {
  const since = new Date(volunteer.createdAt).getFullYear()
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; display: flex; justify-content: center; }
    .card { width: 320px; background: linear-gradient(135deg, #e05c2a 0%, #c0392b 100%); border-radius: 16px; padding: 24px; color: white; box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
    .org { font-size: 11px; letter-spacing: 2px; opacity: 0.8; text-transform: uppercase; }
    .org-name { font-size: 22px; font-weight: bold; margin: 4px 0 20px; }
    .avatar { width: 70px; height: 70px; border-radius: 50%; background: rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; margin-bottom: 12px; border: 3px solid rgba(255,255,255,0.6); }
    .name { font-size: 20px; font-weight: bold; }
    .vol-num { font-size: 11px; opacity: 0.75; margin: 2px 0 16px; }
    .info { background: rgba(255,255,255,0.15); border-radius: 8px; padding: 12px; margin: 12px 0; }
    .info-row { display: flex; justify-content: space-between; margin: 4px 0; font-size: 12px; }
    .info-label { opacity: 0.7; }
    .badge { display: inline-block; background: rgba(255,255,255,0.25); border-radius: 20px; padding: 3px 10px; font-size: 11px; margin: 2px; }
    .footer { font-size: 10px; opacity: 0.6; margin-top: 16px; text-align: center; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 10px; }
    .status-badge { display: inline-block; background: #2ecc71; color: white; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; margin-top: 8px; }
  </style></head><body>
  <div class="card">
    <div class="org">Official Volunteer ID</div>
    <div class="org-name">NGO Trust</div>
    <div class="avatar">${volunteer.fullName.charAt(0).toUpperCase()}</div>
    <div class="name">${volunteer.fullName}</div>
    <div class="vol-num">${volunteer.volunteerNumber}</div>
    <div class="status-badge">✓ APPROVED VOLUNTEER</div>
    <div class="info">
      <div class="info-row"><span class="info-label">Email</span><span>${volunteer.email}</span></div>
      <div class="info-row"><span class="info-label">Phone</span><span>${volunteer.phone}</span></div>
      ${volunteer.city ? `<div class="info-row"><span class="info-label">City</span><span>${volunteer.city}</span></div>` : ''}
      <div class="info-row"><span class="info-label">Member Since</span><span>${since}</span></div>
    </div>
    ${volunteer.skills?.length ? `<div>${volunteer.skills.slice(0,3).map(s => `<span class="badge">${s}</span>`).join('')}</div>` : ''}
    <div class="footer">This card is property of NGO Trust. If found, please return.<br>ngotrust.org</div>
  </div></body></html>`
  return htmlToPDF(html)
}

// ─── DONATION POSTER PDF ──────────────────────────────────────────────────────
const generatePosterPDF = async ({ donation, showAmount, showName, privacy }) => {
  const amountINR = (donation.amount / 100).toFixed(0)
  const date = new Date(donation.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
  const donorName = (privacy === 'anonymous' || !showName) ? 'An Anonymous Donor' : (donation.userId?.name || 'A Kind Donor')
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; margin: 0; background: linear-gradient(135deg, #e05c2a, #f39c12); min-height: 500px; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .poster { background: white; border-radius: 20px; padding: 50px 40px; text-align: center; max-width: 500px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
    .heart { font-size: 60px; margin-bottom: 16px; }
    .ngo { font-size: 14px; color: #e05c2a; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; }
    .headline { font-size: 28px; font-weight: bold; color: #2c3e50; margin: 16px 0; line-height: 1.3; }
    .donor { font-size: 20px; color: #e05c2a; font-weight: bold; margin: 16px 0; }
    .amount-box { background: linear-gradient(135deg, #e05c2a, #f39c12); color: white; border-radius: 12px; padding: 16px 30px; display: inline-block; margin: 16px 0; }
    .amount-label { font-size: 12px; opacity: 0.8; }
    .amount-value { font-size: 36px; font-weight: bold; }
    .message { color: #777; font-size: 14px; margin: 20px 0; line-height: 1.6; }
    .footer { border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px; }
    .footer-logo { font-size: 18px; font-weight: bold; color: #e05c2a; }
    .footer-sub { font-size: 12px; color: #aaa; margin-top: 4px; }
    .date { font-size: 12px; color: #bbb; margin-top: 8px; }
  </style></head><body>
  <div class="poster">
    <div class="heart">❤️</div>
    <div class="ngo">NGO Trust</div>
    <div class="headline">Making a Difference, One Donation at a Time</div>
    <div class="donor">🌟 ${donorName}</div>
    <p class="message">made a generous contribution to support our mission of empowering communities across India.</p>
    ${showAmount ? `<div class="amount-box"><div class="amount-label">Donation Amount</div><div class="amount-value">₹${parseInt(amountINR).toLocaleString('en-IN')}</div></div>` : ''}
    <p class="message">Your support helps us provide education, healthcare, and livelihood opportunities to those who need it most.</p>
    <div class="footer">
      <div class="footer-logo">NGO Trust</div>
      <div class="footer-sub">Empowering Lives · Building Communities · Creating Change</div>
      <div class="date">${date}</div>
    </div>
  </div></body></html>`
  return htmlToPDF(html)
}

module.exports = { generateReceiptPDF, generateCertificatePDF, generateIdCardPDF, generatePosterPDF }
