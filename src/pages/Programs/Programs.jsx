import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageBanner from '../../components/common/PageBanner'
import SectionHeading from '../../components/common/SectionHeading'
import { BookOpen, Home, Zap, Users, Star, Leaf } from 'lucide-react'

const programs = [
  { id: 1, icon: BookOpen, color: '#1B3D7A', category: 'Education', title: 'Foundational Learning Support', desc: 'Activity-based early childhood education programs for underprivileged children.', raised: '₹4.2L', target: '₹6L', percent: 72 },
  { id: 2, icon: Home, color: '#CC2229', category: 'Infrastructure', title: 'Learning Materials Drive', desc: 'Providing books, stationery and educational kits to children in need.', raised: '₹2.8L', target: '₹5L', percent: 56 },
  { id: 3, icon: Zap, color: '#28A745', category: 'Skill', title: 'Vocational Skill Development', desc: 'Training programs to equip youth with job-ready skills and entrepreneurial mindset.', raised: '₹6.1L', target: '₹7L', percent: 87 },
  { id: 4, icon: Users, color: '#f5a623', category: 'Community', title: 'Women Empowerment Program', desc: 'Building confidence and economic independence among women from rural areas.', raised: '₹3.5L', target: '₹5.5L', percent: 63 },
  { id: 5, icon: Star, color: '#6c5ce7', category: 'Education', title: 'Scholarship for Bright Students', desc: 'Merit-based scholarships for students from economically weaker sections.', raised: '₹5L', target: '₹8L', percent: 62 },
  { id: 6, icon: Leaf, color: '#00b894', category: 'Environment', title: 'Green Community Initiative', desc: 'Tree plantation drives, clean-up campaigns, and environmental awareness.', raised: '₹1.2L', target: '₹2L', percent: 60 },
]

const categories = ['All', 'Education', 'Infrastructure', 'Skill', 'Community', 'Environment']

export default function Programs() {
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? programs : programs.filter(p => p.category === active)

  return (
    <>
      <PageBanner title="Our Programs" subtitle="Each program is a promise — to transform a life, strengthen a community." breadcrumbs={[{ label: 'Programs' }]} />

      <section style={{ padding: '60px 0', background: '#F7F8FA' }}>
        <div className="container">
          <SectionHeading title="Support Our Campaigns" subtitle="Your contribution directly funds welfare programs that change lives." />

          {/* Filters */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActive(cat)}
                style={{
                  padding: '8px 20px', borderRadius: 20, border: '1px solid', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  background: active === cat ? '#1B3D7A' : '#fff',
                  color: active === cat ? '#fff' : '#1B3D7A',
                  borderColor: '#1B3D7A', transition: 'all 0.2s', fontFamily: 'Poppins, sans-serif',
                }}>
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {filtered.map(p => {
              const Icon = p.icon
              return (
                <div key={p.id} style={{
                  background: '#fff', borderRadius: 10, padding: '28px 22px',
                  border: '1px solid #e8ecf4', boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  display: 'flex', flexDirection: 'column', gap: 12,
                  transition: 'all 0.25s ease',
                }}
                onMouseOver={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 10px 30px rgba(0,0,0,0.1)' }}
                onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="icon-circle" style={{ background: p.color, margin: 0 }}>
                      <Icon size={22} color="#fff" />
                    </div>
                    <span style={{ fontSize: 11, background: '#eef2ff', color: '#1B3D7A', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
                      {p.category}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1B3D7A' }}>{p.title}</h3>
                  <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, flex: 1 }}>{p.desc}</p>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
                      <span style={{ color: '#444' }}>{p.raised} raised</span>
                      <span style={{ color: '#28A745' }}>{p.percent}%</span>
                    </div>
                    <div style={{ background: '#e8ecf4', borderRadius: 20, height: 7 }}>
                      <div style={{ height: '100%', borderRadius: 20, background: 'linear-gradient(90deg, #28A745, #5dd97a)', width: `${p.percent}%` }} />
                    </div>
                    <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Target: {p.target}</div>
                  </div>
                  <Link to="/donate" className="btn btn-red" style={{ textAlign: 'center', marginTop: 4 }}>Donate Now</Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
