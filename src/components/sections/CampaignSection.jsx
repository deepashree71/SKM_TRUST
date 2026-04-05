import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const campaigns = [
  {
    iconBg: '#1B3D7A',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-1a6 6 0 0112 0v1"/><path d="M18 8h2M20 10l-2-2 2-2"/></svg>,
    title: 'Support Foundational Learning',
    desc: 'Contribute towards activity-based learning initiatives and preschool education programs.',
    raised: '₹4.2L raised', pct: 72,
  },
  {
    iconBg: '#1B3D7A',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    title: 'Learning Materials Support',
    desc: 'Help provide stationery, books and essential educational kits to children.',
    raised: '₹2.8L raised', pct: 58,
  },
  {
    iconBg: '#1B3D7A',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
    title: 'Educate a Child',
    desc: 'Contribute towards activity-based learning initiatives and preschool education programs.',
    raised: '₹6.1L raised', pct: 85,
  },
  {
    iconBg: '#CC2229',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    title: 'Preschool Development',
    desc: 'Support infrastructure and development of community-based preschool initiatives.',
    raised: '₹3.5L raised', pct: 62,
  },
]

// Animated progress bar that counts from 0 when scrolled into view
function AnimatedBar({ pct }) {
  const [width, setWidth] = useState(0)
  const ref = useRef(null)
  const animated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          // Small delay then animate
          setTimeout(() => setWidth(pct), 200)
        }
      },
      { threshold: 0.4 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [pct])

  return (
    <div ref={ref} style={{ background: '#e4ecf4', borderRadius: 20, height: 7, overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: 20,
        background: 'linear-gradient(90deg,#28A745,#5dd97a)',
        width: `${width}%`,
        transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
      }} />
    </div>
  )
}

export default function CampaignSection() {
  return (
    <section style={{ padding: '60px 0', background: '#fff' }}>
      <div className="container">
        <div className="section-heading">
          <h2>Support Our Campaigns</h2>
          <div className="bar" />
          <p>Your contribution directly funds welfare programs that change lives within local community.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
          {campaigns.map((c, i) => (
            <div key={i} className="card" style={{ padding: '28px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="icon-circle" style={{ background: c.iconBg }}>
                {c.icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1B3D7A' }}>{c.title}</h3>
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.65, flex: 1 }}>{c.desc}</p>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                  <span style={{ color: '#444' }}>{c.raised}</span>
                  <span style={{ color: '#28A745' }}>{c.pct}%</span>
                </div>
                <AnimatedBar pct={c.pct} />
              </div>
              <Link to="/donate" className="btn btn-red" style={{ textAlign: 'center', marginTop: 4 }}>Donate Now</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
