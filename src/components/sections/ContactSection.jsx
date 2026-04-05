import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ContactSection() {
  const [form, setForm] = useState({ name:'',email:'',phone:'',subject:'',message:'' })

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Message sent! We will get back to you soon.')
    setForm({ name:'',email:'',phone:'',subject:'',message:'' })
  }

  const fi = (id, label, type='text', ph='', req=true) => (
    <div>
      <label style={{ fontSize:13, fontWeight:600, color:'#444', display:'block', marginBottom:5 }}>{label}{req?' *':''}</label>
      <input type={type} placeholder={ph||label} value={form[id]}
        onChange={e => setForm({...form,[id]:e.target.value})} required={req}
        style={{ width:'100%', padding:'10px 12px', border:'1px solid #d0dcec', borderRadius:5, fontSize:13, fontFamily:'Poppins,sans-serif', outline:'none', transition:'border .2s' }}
        onFocus={e => e.target.style.borderColor='#1B3D7A'}
        onBlur={e => e.target.style.borderColor='#d0dcec'} />
    </div>
  )

  return (
    <section style={{ padding:'60px 0', background:'#F7F8FA' }} id="contact">
      <div className="container">
        <div className="section-heading">
          <h2>Contact Us</h2>
          <div className="bar" />
          <p>Reach out to us for partnerships, volunteering, donations or any other queries.</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, alignItems:'start' }} className="contact-grid">
          {/* Info */}
          <div style={{ background:'#fff', borderRadius:10, padding:'32px 28px', boxShadow:'0 2px 16px rgba(0,0,0,.06)', border:'1px solid #e4ecf4' }}>
            <h3 style={{ fontSize:17, fontWeight:700, color:'#1B3D7A', marginBottom:4 }}>Shree Kankai Mataji Education & Charitable Trust</h3>
            <p style={{ fontSize:12, color:'#888', marginBottom:24 }}>Registered Head Office</p>
            {[
              { svg:<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>, label:'Address', value:'NGO Trust, Community Center, Alindra, Nadiad – 387115, Gujarat, India' },
              { svg:<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.36 12a19.79 19.79 0 01-3.07-8.67A2 2 0 013.27 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>, label:'Phone', value:'+91-98765-43210 | +91-11-2345-6789' },
              { svg:<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label:'Email', value:'trust@ngotrust.org' },
              { svg:<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, label:'Working Hours', value:'Monday – Saturday: 9:00 AM – 6:00 PM' },
            ].map((item, i) => (
              <div key={i} style={{ display:'flex', gap:14, marginBottom:20, alignItems:'flex-start' }}>
                <div style={{ width:38, height:38, borderRadius:'50%', background:'#1B3D7A', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {item.svg}
                </div>
                <div>
                  <strong style={{ fontSize:11, color:'#888', textTransform:'uppercase', letterSpacing:.5, display:'block', marginBottom:2 }}>{item.label}</strong>
                  <span style={{ fontSize:13, color:'#333' }}>{item.value}</span>
                </div>
              </div>
            ))}
            {/* Map placeholder */}
            <div style={{ borderRadius:8, overflow:'hidden', background:'#e4ecf4', height:160, display:'flex', alignItems:'center', justifyContent:'center', color:'#1B3D7A', fontWeight:600, fontSize:13, gap:8 }}>
              📍 Alindra, Nadiad, Kheda, Gujarat
            </div>
          </div>

          {/* Form */}
          <div style={{ background:'#fff', borderRadius:10, padding:'32px 28px', boxShadow:'0 2px 16px rgba(0,0,0,.06)', border:'1px solid #e4ecf4' }}>
            <h3 style={{ fontSize:17, fontWeight:700, color:'#1B3D7A', marginBottom:24 }}>Send Us a Message</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }} className="form-2col">
                {fi('name','Full Name','text','Your full name')}
                {fi('email','Email Address','email','your@email.com')}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }} className="form-2col">
                {fi('phone','Phone Number','tel','+91 XXXXX XXXXX', false)}
                <div>
                  <label style={{ fontSize:13, fontWeight:600, color:'#444', display:'block', marginBottom:5 }}>Subject *</label>
                  <select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} required
                    style={{ width:'100%', padding:'10px 12px', border:'1px solid #d0dcec', borderRadius:5, fontSize:13, fontFamily:'Poppins,sans-serif', background:'#fff', outline:'none' }}>
                    <option value="">Select a subject</option>
                    <option>Donation Enquiry</option>
                    <option>Volunteer Registration</option>
                    <option>CSR Partnership</option>
                    <option>Membership</option>
                    <option>General Enquiry</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:13, fontWeight:600, color:'#444', display:'block', marginBottom:5 }}>Message *</label>
                <textarea rows={4} placeholder="Write your message here..."
                  value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required
                  style={{ width:'100%', padding:'10px 12px', border:'1px solid #d0dcec', borderRadius:5, fontSize:13, fontFamily:'Poppins,sans-serif', outline:'none', resize:'vertical' }} />
              </div>
              <button type="submit" className="btn btn-red" style={{ width:'100%', padding:'12px', fontSize:14, fontWeight:700 }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:768px){ .contact-grid{grid-template-columns:1fr!important} }
        @media(max-width:480px){ .form-2col{grid-template-columns:1fr!important} }
      `}</style>
    </section>
  )
}
