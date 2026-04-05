import { useState, useEffect } from 'react'

const testimonials = [
  {
    initials: 'RK', name: 'Rahul Kumar', role: 'Scholarship Beneficiary, Bihar',
    text: 'Shree Kankai Mataji Education & Charitable Trust changed the trajectory of my life. The scholarship program gave me access to education I could never have afforded. I am now a software engineer and deeply grateful for their support.',
    rating: 5,
  },
  {
    initials: 'PS', name: 'Priya Sharma', role: 'CSR Head, TechCorp India',
    text: 'As a CSR partner, we were impressed by the transparency and impact reporting of NGO Trust. Their ground-level execution is exceptional and the documentation for compliance is thorough.',
    rating: 5,
  },
  {
    initials: 'AM', name: 'Arjun Mehta', role: 'Volunteer, Mumbai',
    text: 'Volunteering with NGO Trust for two years has been the most fulfilling experience of my life. The organization is professional, mission-driven, and deeply committed to real change.',
    rating: 5,
  },
  {
    initials: 'SB', name: 'Sunita Bai', role: 'Program Beneficiary, Rajasthan',
    text: "The women's skill development program gave me the confidence and training to start my own business. I now employ five women from my village. NGO Trust made this possible.",
    rating: 5,
  },
  {
    initials: 'DP', name: 'Dinesh Patel', role: 'Regular Donor, Gujarat',
    text: 'We have been donating to NGO Trust for 5 years. The detailed annual reports and field visit experiences have built our complete trust in how funds are utilized for maximum impact.',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  const [idx, setIdx] = useState(0)

  // Auto-advance every 5 seconds
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % testimonials.length), 5000)
    return () => clearInterval(t)
  }, [])

  const cur = testimonials[idx]

  return (
    <section style={{ padding: '70px 0', background: '#F7F8FA' }}>
      <div className="container">
        {/* Heading — left-aligned like screenshot */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, color: '#1B3D7A', marginBottom: 8 }}>
            What People Say About Us
          </h2>
          <div style={{ width: 48, height: 3, background: '#CC2229', borderRadius: 2, marginBottom: 14 }} />
          <p style={{ color: '#555', fontSize: 14, maxWidth: 620, lineHeight: 1.7 }}>
            Voices from our beneficiaries, volunteers and partners who have experienced the Shree Kankai Mataji Education &amp; Charitable Trust impact.
          </p>
        </div>

        {/* Card — full width like screenshot */}
        <div style={{
          background: '#fff', borderRadius: 12,
          border: '1px solid #e4ecf4',
          boxShadow: '0 4px 32px rgba(0,0,0,0.07)',
          padding: '40px 44px',
          minHeight: 200,
          position: 'relative',
        }}>
          {/* Big quote mark */}
          <div style={{ position: 'absolute', top: 20, right: 36, fontSize: 120, color: '#f0f4fb', fontFamily: 'Georgia, serif', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>
            "
          </div>

          {/* Stars */}
          <div style={{ color: '#f5a623', fontSize: 20, marginBottom: 16, letterSpacing: 3 }}>
            {'★'.repeat(cur.rating)}{'☆'.repeat(5 - cur.rating)}
          </div>

          {/* Quote text */}
          <p style={{
            fontSize: 16, color: '#333', lineHeight: 1.85,
            fontStyle: 'italic', marginBottom: 28,
            maxWidth: '90%',
            minHeight: 80,
          }}>
            {cur.text}
          </p>

          {/* Person */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: '#1B3D7A', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 16, flexShrink: 0,
            }}>
              {cur.initials}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#1B3D7A', fontSize: 15 }}>{cur.name}</div>
              <div style={{ fontSize: 13, color: '#888' }}>{cur.role}</div>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 24 }}>
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 28 : 9, height: 9, borderRadius: 20,
                border: 'none',
                background: i === idx ? '#1B3D7A' : '#ccd6e8',
                cursor: 'pointer', padding: 0,
                transition: 'all .35s',
              }} />
          ))}
        </div>
      </div>
    </section>
  )
}
