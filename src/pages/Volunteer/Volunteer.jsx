import { useState } from 'react'
import PageBanner from '../../components/common/PageBanner'
import SectionHeading from '../../components/common/SectionHeading'
import { CheckCircle, CreditCard, Award, Heart, Users } from 'lucide-react'
import toast from 'react-hot-toast'

const benefits = [
  { icon: CreditCard, title: 'Official ID Card', desc: 'Receive a verified NGO Trust volunteer ID card.' },
  { icon: Award, title: 'Certificate of Service', desc: 'Get an official certificate upon program completion.' },
  { icon: Heart, title: 'Make Real Impact', desc: 'Directly contribute to community transformation.' },
  { icon: Users, title: 'Join a Network', desc: 'Connect with 200+ volunteers across India.' },
]

export default function Volunteer() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', city: '', dob: '',
    skills: '', interests: '', message: '', photo: null
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    toast.success('Application submitted! We will review and get back to you within 48 hours.')
  }

  const inp = (id, label, type = 'text', placeholder = '') => (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 5 }}>{label}</label>
      <input type={type} placeholder={placeholder || label}
        value={form[id]} onChange={e => setForm({ ...form, [id]: e.target.value })}
        required style={{ width: '100%', padding: '10px 12px', border: '1px solid #d8e0f0', borderRadius: 5, fontSize: 13, fontFamily: 'Poppins, sans-serif', outline: 'none' }} />
    </div>
  )

  return (
    <>
      <PageBanner title="Become a Volunteer" subtitle="Join our mission and make a real difference in communities across India." breadcrumbs={[{ label: 'Volunteer' }]} />

      {/* Benefits */}
      <section style={{ padding: '50px 0', background: '#F7F8FA' }}>
        <div className="container">
          <SectionHeading title="Why Volunteer With Us?" subtitle="What you get as an NGO Trust volunteer." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 22 }}>
            {benefits.map((b, i) => {
              const Icon = b.icon
              return (
                <div key={i} style={{ background: '#fff', borderRadius: 10, padding: '24px', textAlign: 'center', border: '1px solid #e8ecf4', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                  <div className="icon-circle" style={{ margin: '0 auto 12px' }}>
                    <Icon size={20} color="#fff" />
                  </div>
                  <h4 style={{ fontWeight: 700, color: '#1B3D7A', marginBottom: 6 }}>{b.title}</h4>
                  <p style={{ fontSize: 13, color: '#666' }}>{b.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Form */}
      <section style={{ padding: '60px 0', background: '#fff' }}>
        <div className="container" style={{ maxWidth: 700 }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 60, marginBottom: 20 }}>🎉</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1B3D7A', marginBottom: 12 }}>Application Submitted!</h2>
              <p style={{ fontSize: 15, color: '#555', marginBottom: 28 }}>
                Thank you for applying. Our team will review your application and contact you within 48 hours.
              </p>
              <button onClick={() => setSubmitted(false)} className="btn btn-blue">Submit Another Application</button>
            </div>
          ) : (
            <>
              <SectionHeading title="Volunteer Registration Form" subtitle="Fill in your details to apply as a volunteer with NGO Trust." />
              <div style={{ background: '#F7F8FA', borderRadius: 12, padding: '36px 32px', boxShadow: '0 2px 20px rgba(0,0,0,0.06)' }}>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }} className="form-grid">
                    {inp('name', 'Full Name *', 'text', 'Your full name')}
                    {inp('email', 'Email Address *', 'email', 'your@email.com')}
                    {inp('phone', 'Phone Number *', 'tel', '+91 XXXXX XXXXX')}
                    {inp('dob', 'Date of Birth *', 'date')}
                    {inp('city', 'City / District *', 'text', 'Your city')}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 5 }}>Skills & Expertise *</label>
                    <input type="text" placeholder="e.g. Teaching, Design, Coding, Counseling"
                      value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })}
                      required style={{ width: '100%', padding: '10px 12px', border: '1px solid #d8e0f0', borderRadius: 5, fontSize: 13, fontFamily: 'Poppins, sans-serif', outline: 'none' }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 5 }}>Area of Interest *</label>
                    <select value={form.interests} onChange={e => setForm({ ...form, interests: e.target.value })} required
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d8e0f0', borderRadius: 5, fontSize: 13, fontFamily: 'Poppins, sans-serif', background: '#fff', outline: 'none' }}>
                      <option value="">Select area of interest</option>
                      <option>Education & Teaching</option>
                      <option>Health & Nutrition</option>
                      <option>Skill Development</option>
                      <option>Community Outreach</option>
                      <option>Technology & Digital</option>
                      <option>Event Management</option>
                      <option>Fundraising</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 5 }}>Why do you want to volunteer?</label>
                    <textarea rows={4} placeholder="Tell us what motivates you to join NGO Trust..."
                      value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d8e0f0', borderRadius: 5, fontSize: 13, fontFamily: 'Poppins, sans-serif', outline: 'none', resize: 'vertical' }} />
                  </div>
                  <button type="submit" className="btn btn-red" style={{ width: '100%', padding: '13px', fontSize: 15, fontWeight: 700 }}>
                    Submit Application →
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </section>
      <style>{`@media (max-width: 600px) { .form-grid { grid-template-columns: 1fr !important; } }`}</style>
    </>
  )
}
