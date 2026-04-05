import { useState } from 'react'
import PageBanner from '../../components/common/PageBanner'
import SectionHeading from '../../components/common/SectionHeading'

const locations = [
  { id: 1, state: 'Gujarat', district: 'Nadiad, Kheda', x: 22, y: 52, type: 'Education', beneficiaries: 120, programs: 3 },
  { id: 2, state: 'Maharashtra', district: 'Pune', x: 28, y: 57, type: 'Skill', beneficiaries: 85, programs: 2 },
  { id: 3, state: 'Rajasthan', district: 'Jaipur', x: 28, y: 38, type: 'Women', beneficiaries: 60, programs: 2 },
  { id: 4, state: 'Uttar Pradesh', district: 'Lucknow', x: 46, y: 36, type: 'Education', beneficiaries: 95, programs: 3 },
  { id: 5, state: 'Bihar', district: 'Patna', x: 54, y: 38, type: 'Scholarship', beneficiaries: 75, programs: 2 },
  { id: 6, state: 'Delhi', district: 'Delhi', x: 38, y: 31, type: 'Community', beneficiaries: 40, programs: 1 },
  { id: 7, state: 'Karnataka', district: 'Bengaluru', x: 32, y: 68, type: 'Skill', beneficiaries: 50, programs: 2 },
  { id: 8, state: 'Tamil Nadu', district: 'Chennai', x: 36, y: 76, type: 'Education', beneficiaries: 65, programs: 2 },
]

const typeColors = { Education: '#1B3D7A', Skill: '#28A745', Women: '#fd79a8', Scholarship: '#f5a623', Community: '#6c5ce7' }

const stats = [
  { num: '8+', label: 'States Covered' },
  { num: '500+', label: 'Lives Impacted' },
  { num: '17', label: 'Active Programs' },
  { num: '200+', label: 'Volunteers' },
]

export default function ImpactMap() {
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? locations : locations.filter(l => l.type === filter)
  const types = ['All', ...new Set(locations.map(l => l.type))]

  return (
    <>
      <PageBanner title="India Impact Map" subtitle="See where NGO Trust is creating change across India." breadcrumbs={[{ label: 'Impact Map' }]} />

      {/* Stats */}
      <section style={{ background: '#1B3D7A', padding: '30px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, textAlign: 'center' }}>
            {stats.map((s, i) => (
              <div key={i} style={{ padding: '10px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#ffcc44' }}>{s.num}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 0', background: '#F7F8FA' }}>
        <div className="container">
          <SectionHeading title="Our Presence Across India" subtitle="Interactive map showing all NGO Trust program locations." />

          {/* Filters */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 36 }}>
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                style={{
                  padding: '7px 18px', borderRadius: 20, border: `1px solid ${typeColors[t] || '#1B3D7A'}`,
                  background: filter === t ? (typeColors[t] || '#1B3D7A') : '#fff',
                  color: filter === t ? '#fff' : (typeColors[t] || '#1B3D7A'),
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                }}>
                {t}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, alignItems: 'start' }} className="map-grid">
            {/* SVG Map */}
            <div style={{ background: '#fff', borderRadius: 12, padding: '20px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', position: 'relative' }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', maxHeight: 460 }}>
                {/* India outline - simplified bounding box shape */}
                <rect x="10" y="8" width="75" height="85" rx="3" fill="#eef2ff" stroke="#c8d4f0" strokeWidth="0.5" />
                {/* Rough coastal shapes */}
                <ellipse cx="47" cy="50" rx="34" ry="42" fill="#e8eeff" stroke="#c0ccee" strokeWidth="0.4" />
                <text x="47" y="96" textAnchor="middle" fontSize="3.5" fill="#1B3D7A" fontWeight="bold" fontFamily="Poppins, sans-serif">INDIA</text>

                {/* Location markers */}
                {filtered.map(loc => (
                  <g key={loc.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(loc)}>
                    <circle
                      cx={loc.x + 12}
                      cy={loc.y}
                      r={selected?.id === loc.id ? 3.5 : 2.5}
                      fill={typeColors[loc.type] || '#1B3D7A'}
                      stroke="#fff"
                      strokeWidth="0.8"
                      style={{ transition: 'r 0.2s' }}
                    />
                    <circle
                      cx={loc.x + 12}
                      cy={loc.y}
                      r={5}
                      fill={typeColors[loc.type] || '#1B3D7A'}
                      opacity="0.15"
                    />
                    <text x={loc.x + 12} y={loc.y - 4} textAnchor="middle" fontSize="2.8" fill="#333" fontFamily="Poppins, sans-serif">
                      {loc.state.split(' ')[0]}
                    </text>
                  </g>
                ))}
              </svg>
              <p style={{ fontSize: 12, color: '#888', textAlign: 'center', marginTop: 8 }}>
                Click on a marker to see program details
              </p>
            </div>

            {/* Location list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map(loc => (
                <div key={loc.id}
                  onClick={() => setSelected(selected?.id === loc.id ? null : loc)}
                  style={{
                    background: selected?.id === loc.id ? '#1B3D7A' : '#fff',
                    borderRadius: 8, padding: '14px 16px', cursor: 'pointer',
                    border: `2px solid ${selected?.id === loc.id ? '#1B3D7A' : '#e8ecf4'}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s',
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: selected?.id === loc.id ? '#fff' : '#1B3D7A' }}>{loc.state}</div>
                      <div style={{ fontSize: 12, color: selected?.id === loc.id ? 'rgba(255,255,255,0.7)' : '#888' }}>{loc.district}</div>
                    </div>
                    <span style={{
                      fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
                      background: selected?.id === loc.id ? 'rgba(255,255,255,0.2)' : `${typeColors[loc.type]}18`,
                      color: selected?.id === loc.id ? '#fff' : typeColors[loc.type],
                    }}>
                      {loc.type}
                    </span>
                  </div>
                  {selected?.id === loc.id && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.2)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#ffcc44', fontWeight: 800, fontSize: 18 }}>{loc.beneficiaries}+</div>
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Beneficiaries</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#ffcc44', fontWeight: 800, fontSize: 18 }}>{loc.programs}</div>
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Programs</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <style>{`@media (max-width: 768px) { .map-grid { grid-template-columns: 1fr !important; } }`}</style>
    </>
  )
}
