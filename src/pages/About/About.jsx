import PageBanner from '../../components/common/PageBanner'
import SectionHeading from '../../components/common/SectionHeading'
import { CheckCircle } from 'lucide-react'

const team = [
  { name: 'Dr. Ramesh Patel', role: 'Founder & Trustee', initials: 'RP' },
  { name: 'Sunita Mehta', role: 'Executive Director', initials: 'SM' },
  { name: 'Arjun Sharma', role: 'Program Head', initials: 'AS' },
  { name: 'Priya Singh', role: 'Finance & Compliance', initials: 'PS' },
]

const milestones = [
  { year: '2020', event: 'NGO Trust established, first community program launched' },
  { year: '2021', event: '100+ beneficiaries registered, first scholarship batch' },
  { year: '2022', event: '12A & 80G certifications received, CSR partnerships begun' },
  { year: '2023', event: 'Digital platform launched, volunteer ID system activated' },
  { year: '2024', event: '500+ lives impacted, expanded to 3 new districts' },
  { year: '2025', event: 'Full digital transformation — certificates & ID cards online' },
]

export default function About() {
  return (
    <>
      <PageBanner title="About Us" subtitle="Our journey of transforming lives through education and community empowerment." breadcrumbs={[{ label: 'About Us' }]} />

      {/* Mission & Vision */}
      <section style={{ padding: '60px 0', background: '#fff' }}>
        <div className="container">
          <SectionHeading title="Our Mission & Vision" subtitle="What drives every program, initiative, and decision we make." />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }} className="mv-grid">
            {[
              { title: 'Our Mission', text: 'To support holistic development of communities through accessible education, skill-based learning initiatives, and transparent social welfare programs that create self-reliant individuals and strong communities.', color: '#1B3D7A' },
              { title: 'Our Vision', text: 'A self-reliant, educated, and empowered India where every individual — regardless of background — has the opportunity to learn, grow, and contribute to society.', color: '#CC2229' },
            ].map((item, i) => (
              <div key={i} style={{
                borderLeft: `4px solid ${item.color}`, paddingLeft: 24,
                background: '#F7F8FA', borderRadius: '0 10px 10px 0', padding: '28px 28px 28px 24px',
              }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: item.color, marginBottom: 14 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: '#444', lineHeight: 1.8 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '60px 0', background: '#F7F8FA' }}>
        <div className="container">
          <SectionHeading title="Our Journey" subtitle="Key milestones in our growth as an organization." />
          <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: '#e0e8f8', transform: 'translateX(-50%)' }} />
            {milestones.map((m, i) => (
              <div key={i} style={{
                display: 'flex', gap: 20, marginBottom: 30, alignItems: 'flex-start',
                flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
              }}>
                <div style={{ flex: 1, textAlign: i % 2 === 0 ? 'right' : 'left' }}>
                  <div style={{ background: '#fff', borderRadius: 8, padding: '16px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e8ecf4' }}>
                    <p style={{ fontSize: 13, color: '#444' }}>{m.event}</p>
                  </div>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1B3D7A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0, zIndex: 1 }}>
                  {m.year.slice(2)}
                </div>
                <div style={{ flex: 1, fontWeight: 700, color: '#1B3D7A', fontSize: 18, paddingTop: 10, textAlign: i % 2 === 0 ? 'left' : 'right' }}>
                  {m.year}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '60px 0', background: '#fff' }} id="team">
        <div className="container">
          <SectionHeading title="Our Core Team" subtitle="The dedicated people behind every program and initiative." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {team.map((m, i) => (
              <div key={i} style={{ textAlign: 'center', background: '#F7F8FA', borderRadius: 10, padding: '28px 20px', border: '1px solid #e8ecf4' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#1B3D7A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22, margin: '0 auto 14px' }}>
                  {m.initials}
                </div>
                <h4 style={{ fontWeight: 700, color: '#1B3D7A', marginBottom: 5 }}>{m.name}</h4>
                <p style={{ fontSize: 13, color: '#888' }}>{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) { .mv-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  )
}
