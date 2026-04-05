const goals = [
  { bg:'#1B3D7A', title:'Early Childhood Education', desc:'Providing foundational learning opportunities through preschool programs.', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg> },
  { bg:'#1B3D7A', title:'Activity-Based Learning', desc:'Encouraging interactive and experiential learning among children.', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
  { bg:'#1B3D7A', title:'Community Awareness', desc:'Promoting the importance of early childhood education within communities.', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-1a6 6 0 0112 0v1"/></svg> },
  { bg:'#1B3D7A', title:'Cultural Learning', desc:'Integrating value-based education through cultural activities.', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { bg:'#1B3D7A', title:'Child Development', desc:'Supporting emotional, intellectual and social growth of young learners.', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { bg:'#28A745', title:'Educational Support', desc:'Providing books, learning materials and essential educational resources.', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M12 22V12M12 12C12 12 7 10 5 6s1-7 7-4c2.5-2.5 6-2 7 2s-2 6-7 8z"/></svg> },
]

export default function GoalsSection() {
  return (
    <section style={{ padding: '60px 0', background: '#F7F8FA' }}>
      <div className="container">
        <div className="section-heading">
          <h2>Goals of Shree Kankai Mataji Education & Charitable Trust</h2>
          <div className="bar" />
          <p>Our key focus areas that guide every program, initiative and investment we make for communities.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 22 }}>
          {goals.map((g, i) => (
            <div key={i} className="card" style={{ padding: '26px 20px', textAlign: 'center' }}>
              <div className="icon-circle" style={{ background: g.bg, margin: '0 auto 14px' }}>{g.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1B3D7A', marginBottom: 8 }}>{g.title}</h3>
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.65 }}>{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
