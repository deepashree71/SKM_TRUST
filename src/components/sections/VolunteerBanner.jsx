import { Link } from 'react-router-dom'

export default function VolunteerBanner() {
  return (
    <section style={{ background: 'linear-gradient(135deg,#1B3D7A 0%,#0D1B3E 100%)', padding: '55px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 28, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(20px,3vw,30px)', fontWeight: 800, color: '#fff', marginBottom: 10 }}>Become a Volunteer</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.75)', maxWidth: 560, lineHeight: 1.75 }}>
              Join us in supporting early childhood education initiatives by contributing your time and skills towards community-based learning programs. Get an official ID card and certificate.
            </p>
          </div>
          <Link to="/volunteer" className="btn btn-outline-white" style={{ padding: '13px 32px', fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
            Join Now →
          </Link>
        </div>
      </div>
    </section>
  )
}
