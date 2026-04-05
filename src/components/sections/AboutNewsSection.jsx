import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const newsItems = [
  { title: 'Red Day Celebration Conducted at Bhavya Pre-School', date: 'April 08, 2025' },
  { title: 'Activity-Based Learning Session Organized', date: 'April 03, 2025' },
  { title: 'Cultural Learning Activity Conducted', date: 'March 26, 2025' },
  { title: 'Holistic Development Program for Preschool Students', date: 'March 18, 2025' },
  { title: 'Foundational Learning Activity Week Organized', date: 'March 10, 2025' },
  { title: 'Community Awareness Program on Early Education', date: 'February 27, 2025' },
  { title: 'Saraswati Pooja Celebration at Preschool', date: 'February 14, 2025' },
  { title: 'Vasant Panchami Educational Event', date: 'February 08, 2025' },
  { title: 'Interactive Classroom Learning Session', date: 'January 28, 2025' },
  { title: 'Preschool Nutrition & Group Learning Activity', date: 'January 15, 2025' },
]

// Duplicate for seamless infinite loop
const loopItems = [...newsItems, ...newsItems]

export default function AboutNewsSection() {
  const scrollRef = useRef(null)
  const [paused, setPaused] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const animRef = useRef(null)
  const posRef = useRef(0)

  // Continuous smooth auto-scroll (pixel-based, seamless loop)
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const SPEED = 0.6 // px per frame
    const ITEM_H = el.scrollHeight / loopItems.length
    const HALF = ITEM_H * newsItems.length

    const tick = () => {
      if (!paused) {
        posRef.current += SPEED
        // Seamless loop: when we reach the halfway point (duped section), jump back
        if (posRef.current >= HALF) {
          posRef.current -= HALF
        }
        el.scrollTop = posRef.current
        // Update active highlight
        const idx = Math.floor(posRef.current / ITEM_H) % newsItems.length
        setActiveIdx(idx)
      }
      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [paused])

  return (
    <section style={{ padding: '60px 0', background: '#F7F8FA' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28, alignItems: 'start' }} className="about-news-grid">

          {/* About card */}
          <div style={{ background: '#fff', borderRadius: 10, padding: '36px 32px', boxShadow: '0 2px 16px rgba(0,0,0,.06)', border: '1px solid #e4ecf4' }}>
            <h2 style={{ fontSize: 'clamp(17px,2.2vw,23px)', fontWeight: 700, color: '#1B3D7A', marginBottom: 6 }}>
              About Shree Kankai Mataji Education &amp; Charitable Trust
            </h2>
            <div style={{ width: 40, height: 3, background: '#CC2229', borderRadius: 2, marginBottom: 8 }} />
            <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Building communities, empowering lives since 2023.</p>
            <p style={{ fontSize: 14, color: '#444', lineHeight: 1.85, marginBottom: 22 }}>
              Shree Kankai Mataji Education &amp; Charitable Trust is a Government Registered Charitable Organization working
              towards strengthening early childhood education and foundational learning for children from economically weaker
              backgrounds. Established in 2023, the Trust actively operates community-based educational programs through{' '}
              <strong>Bhavya Pre-School</strong> in Alindra, Nadiad.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 26 }} className="mv-cols">
              {[
                { label: 'Our Mission', text: 'To support the holistic development of children through accessible foundational education and value-based learning initiatives.' },
                { label: 'Our Vision', text: 'To create a self-reliant, educated India where every child — regardless of background — has the opportunity to grow.' },
              ].map((item, i) => (
                <div key={i} style={{ borderLeft: '3px solid #1B3D7A', paddingLeft: 14, paddingTop: 2 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1B3D7A', marginBottom: 6 }}>{item.label}</h4>
                  <p style={{ fontSize: 13, color: '#555', lineHeight: 1.65 }}>{item.text}</p>
                </div>
              ))}
            </div>
            <Link to="/about" className="btn btn-red">Know More</Link>
          </div>

          {/* News panel — seamless auto-scroll */}
          <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,.06)', border: '1px solid #e4ecf4' }}>
            {/* Header */}
            <div style={{ background: '#0D1B3E', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#CC2229', animation: 'abPulse 2s infinite', flexShrink: 0 }} />
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 14, margin: 0 }}>Latest News &amp; Updates</h3>
              </div>
              <button
                onClick={() => setPaused(p => !p)}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', padding: '4px 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Poppins,sans-serif' }}>
                {paused ? '▶ Play' : '⏸ Pause'}
              </button>
            </div>

            {/* Seamless scrolling list — overflow hidden, no scrollbar */}
            <div
              ref={scrollRef}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              style={{ height: 340, overflowY: 'hidden', scrollBehavior: 'auto' }}>
              {loopItems.map((item, i) => (
                <div key={i}
                  style={{
                    padding: '13px 18px',
                    borderBottom: '1px solid #f0f2f8',
                    cursor: 'pointer',
                    background: activeIdx === (i % newsItems.length) ? '#f5f8ff' : 'transparent',
                    borderLeft: activeIdx === (i % newsItems.length) ? '3px solid #CC2229' : '3px solid transparent',
                    transition: 'background .2s',
                  }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1B3D7A', lineHeight: 1.5, marginBottom: 3 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: '#CC2229', fontWeight: 500 }}>{item.date}</div>
                </div>
              ))}
            </div>

            {/* Footer link */}
            <div style={{ padding: '12px 18px', borderTop: '1px solid #f0f2f8', textAlign: 'center' }}>
              <Link to="/programs" style={{ fontSize: 12, color: '#1B3D7A', fontWeight: 600, textDecoration: 'none' }}>
                View All Updates →
              </Link>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes abPulse{0%,100%{opacity:1}50%{opacity:.3}}
        @media(max-width:900px){ .about-news-grid{grid-template-columns:1fr!important} }
        @media(max-width:500px){ .mv-cols{grid-template-columns:1fr!important} }
      `}</style>
    </section>
  )
}
