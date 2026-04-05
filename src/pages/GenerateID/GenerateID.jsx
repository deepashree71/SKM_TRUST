import { useState } from 'react'
import PageBanner from '../../components/common/PageBanner'
import SectionHeading from '../../components/common/SectionHeading'
import { Download, CreditCard, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function GenerateID() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', volunteerId: '', role: 'Volunteer', city: '' })
  const [generated, setGenerated] = useState(false)
  const [idData, setIdData] = useState(null)

  const handleGenerate = (e) => {
    e.preventDefault()
    const id = form.volunteerId || `VL-${Date.now().toString().slice(-6)}`
    setIdData({ ...form, volunteerId: id, issueDate: new Date().toLocaleDateString('en-IN'), validUntil: 'December 2025' })
    setGenerated(true)
    toast.success('ID card generated! Click Download to save it.')
  }

  const handleDownload = () => {
    // In real implementation: POST to /api/v1/volunteers/generate-id-card
    // Backend uses Puppeteer → renders HTML template → returns PDF
    // Stored temporarily in local storage, NOT permanently
    // Only metadata (name, id, date, type) stored in DB
    toast.success('Generating PDF via server... Download will start in a moment.')
  }

  const inp = (id, label, type = 'text', placeholder = '', required = true) => (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 5 }}>{label}{required && ' *'}</label>
      <input type={type} placeholder={placeholder || label}
        value={form[id]} onChange={e => setForm({ ...form, [id]: e.target.value })}
        required={required}
        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d8e0f0', borderRadius: 5, fontSize: 13, fontFamily: 'Poppins, sans-serif', outline: 'none' }} />
    </div>
  )

  return (
    <>
      <PageBanner title="Generate ID Card" subtitle="Request and download your official NGO Trust ID card instantly." breadcrumbs={[{ label: 'Generate ID Card' }]} />

      <section style={{ padding: '60px 0', background: '#F7F8FA' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, alignItems: 'start' }} className="id-grid">

            {/* Form */}
            <div style={{ background: '#fff', borderRadius: 12, padding: '36px 32px', boxShadow: '0 2px 20px rgba(0,0,0,0.06)' }}>
              <SectionHeading title="Enter Your Details" subtitle="Your ID card will be generated based on our database records." align="left" />
              <form onSubmit={handleGenerate}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {inp('name', 'Full Name', 'text', 'As per registration')}
                  {inp('email', 'Registered Email', 'email', 'your@email.com')}
                  {inp('phone', 'Phone Number', 'tel', '+91 XXXXX XXXXX')}
                  {inp('volunteerId', 'Volunteer / Member ID', 'text', 'Leave blank if unknown', false)}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 5 }}>Role / Designation *</label>
                    <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d8e0f0', borderRadius: 5, fontSize: 13, fontFamily: 'Poppins, sans-serif', background: '#fff', outline: 'none' }}>
                      <option>Volunteer</option>
                      <option>Member</option>
                      <option>Intern</option>
                      <option>Field Coordinator</option>
                      <option>Program Associate</option>
                    </select>
                  </div>
                  {inp('city', 'City', 'text', 'Your city')}
                </div>
                <div style={{ background: '#eef2ff', borderRadius: 8, padding: '12px 16px', fontSize: 12, color: '#1B3D7A', margin: '20px 0', lineHeight: 1.7 }}>
                  ℹ️ Your data is fetched from our database and used to generate the ID card. The PDF is created temporarily and not stored permanently. Only basic metadata is recorded.
                </div>
                <button type="submit" className="btn btn-red" style={{ width: '100%', padding: '13px', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <CreditCard size={18} /> Generate ID Card
                </button>
              </form>
            </div>

            {/* Preview */}
            <div>
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1B3D7A', marginBottom: 4 }}>ID Card Preview</h3>
                <p style={{ fontSize: 13, color: '#888' }}>A preview of your generated ID card will appear here.</p>
              </div>

              {!generated ? (
                <div style={{
                  background: '#fff', borderRadius: 12, padding: '60px 40px',
                  border: '2px dashed #d8e0f0', textAlign: 'center', color: '#888',
                }}>
                  <CreditCard size={48} color="#d0d8e8" style={{ marginBottom: 14 }} />
                  <p style={{ fontSize: 14 }}>Fill in the form and click Generate to preview your ID card.</p>
                </div>
              ) : (
                <>
                  {/* ID Card Design */}
                  <div style={{
                    background: 'linear-gradient(135deg, #1B3D7A 0%, #0D1B3E 100%)',
                    borderRadius: 14, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.2)', marginBottom: 18,
                  }}>
                    <div style={{ background: '#CC2229', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ color: '#fff', fontWeight: 800, fontSize: 12 }}>NGO TRUST DIGITAL PLATFORM</div>
                      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10 }}>OFFICIAL ID CARD</div>
                    </div>
                    <div style={{ padding: '22px 22px 18px', display: 'flex', gap: 18, alignItems: 'center' }}>
                      <div style={{ width: 72, height: 82, borderRadius: 8, background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: '#fff', fontWeight: 800, fontSize: 26 }}>{idData.name.charAt(0)}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#fff', fontWeight: 800, fontSize: 17, marginBottom: 3 }}>{idData.name}</div>
                        <div style={{ color: '#ffcc44', fontSize: 12, fontWeight: 600, marginBottom: 10 }}>{idData.role}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                          {[
                            { l: 'ID', v: idData.volunteerId },
                            { l: 'City', v: idData.city },
                            { l: 'Phone', v: idData.phone },
                            { l: 'Valid', v: idData.validUntil },
                          ].map((f, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 5, padding: '5px 9px' }}>
                              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5 }}>{f.l}</div>
                              <div style={{ color: '#fff', fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.v}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ background: '#fff', width: 42, height: 42, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⬛</div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, textAlign: 'right' }}>
                        <div>Issued: {idData.issueDate}</div>
                        <div>ngotrust.org/verify</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={handleDownload} className="btn btn-red" style={{ flex: 1, padding: '12px', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <Download size={16} /> Download PDF
                    </button>
                    <button onClick={() => setGenerated(false)} className="btn" style={{ padding: '12px 20px', background: '#F7F8FA', color: '#555', border: '1px solid #e0e0e0', fontSize: 14 }}>
                      Reset
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      <style>{`@media (max-width: 768px) { .id-grid { grid-template-columns: 1fr !important; } }`}</style>
    </>
  )
}
