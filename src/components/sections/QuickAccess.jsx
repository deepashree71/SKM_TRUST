import { Link } from 'react-router-dom'

const cards = [
  {
    iconBg: '#1B3D7A',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <circle cx="9" cy="11" r="2.5"/>
        <path d="M14 9h3M14 12h3M7 16s1-2 2-2 3 2 3 2"/>
      </svg>
    ),
    title: 'Generate ID Card',
    desc: 'Download your official NGO Trust volunteer or member identity card instantly.',
    to: '/generate-id',
  },
  {
    iconBg: '#1B3D7A',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    title: 'Appointment Letter',
    desc: 'Access and download your official appointment or internship letter issued by the Trust.',
    to: '/dashboard',
  },
  {
    iconBg: '#1B3D7A',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
    title: 'Generate Certificate',
    desc: 'Generate your participation, service or appreciation certificate from NGO Trust.',
    to: '/dashboard',
  },
  {
    iconBg: '#CC2229',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
    title: 'Donate Now',
    desc: 'Support our mission with a secure online donation. Every contribution makes a difference.',
    to: '/donate',
  },
]

export default function QuickAccess() {
  return (
    <section style={{ padding: '50px 0', background: '#fff' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 24 }}>
          {cards.map((c, i) => (
            <Link key={i} to={c.to} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ padding: '28px 22px', textAlign: 'center', cursor: 'pointer' }}>
                <div className="icon-circle" style={{ background: c.iconBg, margin: '0 auto 14px' }}>
                  {c.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1B3D7A', marginBottom: 8 }}>{c.title}</h3>
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.65 }}>{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
