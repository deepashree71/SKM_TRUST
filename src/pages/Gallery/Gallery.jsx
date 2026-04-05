import { useState } from 'react'
import PageBanner from '../../components/common/PageBanner'
import SectionHeading from '../../components/common/SectionHeading'

const categories = ['All', 'Programs', 'Events', 'Volunteers', 'Community']

const galleryItems = [
  { id: 1, label: 'Education Programme', category: 'Programs', color: '#1B3D7A', emoji: '📚' },
  { id: 2, label: 'Community Camp', category: 'Events', color: '#CC2229', emoji: '🏕️' },
  { id: 3, label: 'Child Development', category: 'Programs', color: '#28A745', emoji: '🌱' },
  { id: 4, label: 'Volunteer Day', category: 'Volunteers', color: '#f5a623', emoji: '❤️' },
  { id: 5, label: 'Skill Workshop', category: 'Community', color: '#6c5ce7', emoji: '🔧' },
  { id: 6, label: 'Tree Plantation', category: 'Community', color: '#00b894', emoji: '🌳' },
  { id: 7, label: 'Annual Meet 2025', category: 'Events', color: '#d63031', emoji: '🤝' },
  { id: 8, label: 'Learning Activity', category: 'Programs', color: '#0984e3', emoji: '✏️' },
  { id: 9, label: 'Cultural Day', category: 'Events', color: '#e17055', emoji: '🎭' },
  { id: 10, label: 'Women Program', category: 'Community', color: '#fd79a8', emoji: '👩' },
  { id: 11, label: 'Volunteer Training', category: 'Volunteers', color: '#55efc4', emoji: '🎓' },
  { id: 12, label: 'Nutrition Drive', category: 'Community', color: '#fdcb6e', emoji: '🥗' },
]

export default function Gallery() {
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? galleryItems : galleryItems.filter(g => g.category === active)

  return (
    <>
      <PageBanner title="Photo Gallery" subtitle="Visual journey through our programs, events, and community impact." breadcrumbs={[{ label: 'Gallery' }]} />

      <section style={{ padding: '60px 0', background: '#F7F8FA' }}>
        <div className="container">
          <SectionHeading title="Our Impact Gallery" subtitle="A collection of moments that define our journey of change." />

          {/* Filter buttons */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActive(cat)}
                style={{
                  padding: '8px 22px', borderRadius: 20, border: '1px solid #1B3D7A',
                  background: active === cat ? '#1B3D7A' : '#fff',
                  color: active === cat ? '#fff' : '#1B3D7A',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                }}>
                {cat}
              </button>
            ))}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 18,
          }}>
            {filtered.map(item => (
              <div key={item.id} style={{
                borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
                background: item.color, height: 220,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: 10, position: 'relative',
                transition: 'transform 0.25s ease',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                <div style={{ fontSize: 48 }}>{item.emoji}</div>
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  padding: '20px 14px 14px',
                }}>
                  <div style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{item.label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{item.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
