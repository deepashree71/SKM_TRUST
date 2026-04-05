import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageBanner from '../../components/common/PageBanner'
import SectionHeading from '../../components/common/SectionHeading'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'

const events = [
  { id: 1, title: 'Annual Community Awareness Camp', date: 'April 20, 2025', time: '10:00 AM', location: 'Nadiad, Gujarat', attendees: 120, status: 'upcoming', desc: 'A full-day community awareness camp covering education, health, and social welfare topics.' },
  { id: 2, title: 'Volunteer Orientation Program', date: 'April 25, 2025', time: '9:00 AM', location: 'Online / Zoom', attendees: 50, status: 'upcoming', desc: 'New volunteer batch orientation — roles, responsibilities, and NGO processes.' },
  { id: 3, title: 'Skill Development Workshop', date: 'May 5, 2025', time: '11:00 AM', location: 'Ahmedabad, Gujarat', attendees: 80, status: 'upcoming', desc: 'Hands-on vocational skill training for youth from rural communities.' },
  { id: 4, title: 'Red Day Celebration', date: 'April 08, 2025', time: '9:30 AM', location: 'Bhavya Pre-School', attendees: 60, status: 'past', desc: 'Cultural day celebration promoting value-based education for young children.' },
  { id: 5, title: 'NGO Annual General Meeting', date: 'March 30, 2025', time: '3:00 PM', location: 'Head Office', attendees: 40, status: 'past', desc: 'Annual review of programs, financials, and strategic planning for next year.' },
  { id: 6, title: 'Fundraising Dinner 2025', date: 'March 15, 2025', time: '7:00 PM', location: 'Hotel Grand, Ahmedabad', attendees: 200, status: 'past', desc: 'Annual fundraising gala to support scholarship and skill development programs.' },
]

export default function Events() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? events : events.filter(e => e.status === filter)

  return (
    <>
      <PageBanner title="Events" subtitle="Join our events and be part of the change." breadcrumbs={[{ label: 'Events' }]} />

      <section style={{ padding: '60px 0', background: '#F7F8FA' }}>
        <div className="container">
          <SectionHeading title="Upcoming & Past Events" subtitle="Be part of our community events — learn, volunteer, and make a difference." />

          {/* Filter */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 36 }}>
            {['all', 'upcoming', 'past'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  padding: '8px 22px', borderRadius: 20, border: '1px solid #1B3D7A',
                  background: filter === f ? '#1B3D7A' : '#fff',
                  color: filter === f ? '#fff' : '#1B3D7A',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                  textTransform: 'capitalize',
                }}>
                {f === 'all' ? 'All Events' : f === 'upcoming' ? 'Upcoming' : 'Past Events'}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {filtered.map(event => (
              <div key={event.id} style={{
                background: '#fff', borderRadius: 10, overflow: 'hidden',
                border: '1px solid #e8ecf4', boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                transition: 'all 0.25s',
              }}
              onMouseOver={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(0,0,0,0.1)' }}
              onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.05)' }}>
                {/* Colored header */}
                <div style={{ background: event.status === 'upcoming' ? '#1B3D7A' : '#666', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{event.date}</span>
                  <span style={{
                    fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700,
                    background: event.status === 'upcoming' ? '#CC2229' : 'rgba(255,255,255,0.2)',
                    color: '#fff',
                  }}>
                    {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                  </span>
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1B3D7A', marginBottom: 8 }}>{event.title}</h3>
                  <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, marginBottom: 16 }}>{event.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
                    {[
                      { icon: Clock, text: event.time },
                      { icon: MapPin, text: event.location },
                      { icon: Users, text: `${event.attendees} spots` },
                    ].map(({ icon: Icon, text }, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#666' }}>
                        <Icon size={13} color="#1B3D7A" /> {text}
                      </div>
                    ))}
                  </div>
                  {event.status === 'upcoming' ? (
                    <Link to="/volunteer" className="btn btn-red" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                      Register Now
                    </Link>
                  ) : (
                    <Link to="/dashboard" className="btn" style={{ width: '100%', textAlign: 'center', display: 'block', background: '#F7F8FA', color: '#666', border: '1px solid #e0e0e0' }}>
                      View Certificate
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
