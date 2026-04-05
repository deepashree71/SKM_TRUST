import PageBanner from '../../components/common/PageBanner'
import SectionHeading from '../../components/common/SectionHeading'

const stories = [
  { id: 1, initials: 'RK', name: 'Rahul Kumar', location: 'Bihar', tag: 'Education', color: '#1B3D7A', title: 'From Village to Software Engineer', text: 'NGO Trust\'s scholarship program gave me access to education I could never have afforded on my own. Today I work as a software engineer and mentor other students from my village to follow the same path.' },
  { id: 2, initials: 'SB', name: 'Sunita Bai', location: 'Rajasthan', tag: 'Women Empowerment', color: '#CC2229', title: 'Running a Business of My Own', text: 'The women\'s skill development program gave me the confidence and training to start my own tailoring business. I now employ five women from my village and we are building something meaningful together.' },
  { id: 3, initials: 'AM', name: 'Arjun Mehta', location: 'Mumbai', tag: 'Volunteer', color: '#28A745', title: 'Two Years of Fulfillment', text: 'Volunteering with NGO Trust for two years has been the most fulfilling experience of my professional life. The organization is genuinely mission-driven and the impact is visible on the ground every day.' },
  { id: 4, initials: 'MP', name: 'Meera Patel', location: 'Gujarat', tag: 'Community', color: '#f5a623', title: 'My Children Go to School Now', text: 'Before the community outreach program reached our village, I struggled to understand why school mattered. Now both my children attend regularly and I volunteer myself to spread awareness to other parents.' },
  { id: 5, initials: 'AK', name: 'Aditya Kumar', location: 'UP', tag: 'Skills', color: '#6c5ce7', title: 'Certified and Employed', text: 'The vocational training I received helped me get my first job within three months of completion. The certificate from NGO Trust was recognized by my employer and it opened doors I never expected.' },
  { id: 6, initials: 'DP', name: 'Dinesh Patel', location: 'Gujarat', tag: 'Donor', color: '#00b894', title: 'Five Years of Trusting NGO Trust', text: 'As a regular donor for five years, detailed annual reports and field visit experiences have completely won my trust. I know exactly how my contributions are used and it reflects in every report.' },
]

export default function Stories() {
  return (
    <>
      <PageBanner title="Impact Stories" subtitle="Real stories from real people whose lives were touched by our work." breadcrumbs={[{ label: 'Stories' }]} />

      <section style={{ padding: '60px 0', background: '#F7F8FA' }}>
        <div className="container">
          <SectionHeading title="Stories of Change" subtitle="Every story here is a reminder of why we do what we do." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {stories.map(s => (
              <div key={s.id} style={{
                background: '#fff', borderRadius: 10, overflow: 'hidden',
                border: '1px solid #e8ecf4', boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                display: 'flex', flexDirection: 'column',
                transition: 'all 0.25s',
              }}
              onMouseOver={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(0,0,0,0.1)' }}
              onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ height: 6, background: s.color }} />
                <div style={{ padding: '24px 22px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 46, height: 46, borderRadius: '50%', background: s.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
                      {s.initials}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1B3D7A', fontSize: 14 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>{s.location}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: 11, background: '#eef2ff', color: s.color, padding: '3px 10px', borderRadius: 20, fontWeight: 600, border: `1px solid ${s.color}22`, whiteSpace: 'nowrap' }}>
                      {s.tag}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1B3D7A' }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7, flex: 1 }}>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
