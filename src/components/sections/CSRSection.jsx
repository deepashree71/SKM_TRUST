import { Link } from 'react-router-dom'

const csList = [
  'Project Implementation & Management',
  'Social Impact Programs with Reporting',
  'Employee Volunteer Engagement',
  'Community-Based Reach across India',
  'Compliance Documentation & Audit Reports',
  'Measurable Impact Assessments',
]

export default function CSRSection() {
  return (
    <section style={{ padding: '60px 0', background: '#fff' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 40, alignItems: 'center' }} className="csr-grid">
          <div>
            <h2 style={{ fontSize: 'clamp(18px,2.5vw,26px)', fontWeight: 700, color: '#1B3D7A', marginBottom: 6 }}>CSR Partnership Opportunities</h2>
            <div style={{ width: 40, height: 3, background: '#CC2229', borderRadius: 2, marginBottom: 16 }} />
            <p style={{ fontSize: 13, color: '#888', marginBottom: 18 }}>NGO Trust collaborates with local stakeholders and community institutions to strengthen educational outreach.</p>
            <p style={{ fontSize: 14, color: '#444', lineHeight: 1.85, marginBottom: 22 }}>
              NGO Trust is a preferred CSR implementation partner for organizations looking to create measurable social impact. We provide transparent fund utilization, impact assessments, and compliance documentation.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28 }}>
              {csList.map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#28A745', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, fontWeight: 700, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 14, color: '#333' }}>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/contact" className="btn btn-red">Partner With Us</Link>
          </div>

          {/* Photo */}
          <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,.12)' }} className="csr-img">
            <img
              src="https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=80&auto=format&fit=crop"
              alt="CSR partnership"
              style={{ width: '100%', height: 320, objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:768px){ .csr-grid{grid-template-columns:1fr!important} .csr-img{display:none} }
      `}</style>
    </section>
  )
}
