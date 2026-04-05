import { useState } from 'react'
import { Link } from 'react-router-dom'

const slides = [
  [
    { src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=480&q=80&auto=format&fit=crop', label: 'Education Programme' },
    { src: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=480&q=80&auto=format&fit=crop', label: 'Early Learning Camp' },
    { src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=480&q=80&auto=format&fit=crop', label: 'Child Development' },
  ],
  [
    { src: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=480&q=80&auto=format&fit=crop', label: 'Skill Development' },
    { src: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=480&q=80&auto=format&fit=crop', label: 'Community Welfare' },
    { src: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=480&q=80&auto=format&fit=crop', label: 'Learning Support' },
  ],
]

function GalleryImg({ src, label }) {
  const [errored, setErrored] = useState(false)
  return (
    <div style={{ borderRadius: 8, overflow: 'hidden', position: 'relative', height: 200, boxShadow: '0 4px 16px rgba(0,0,0,.1)', background: '#e4ecf4' }}>
      {!errored ? (
        <img
          src={src}
          alt={label}
          loading="lazy"
          onError={() => setErrored(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .4s ease' }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        />
      ) : (
        /* Fallback gradient tile when image fails to load */
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#1B3D7A,#2a5298)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" width="40" height="40" opacity="0.5">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
          </svg>
        </div>
      )}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent,rgba(0,0,0,.65))', padding: '18px 14px 12px' }}>
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{label}</span>
      </div>
    </div>
  )
}

export default function GalleryPreview() {
  const [slide, setSlide] = useState(0)
  const items = slides[slide]

  return (
    <section style={{ padding: '60px 0', background: '#F7F8FA' }}>
      <div className="container">
        <div className="section-heading">
          <h2>Our Impact Gallery</h2>
          <div className="bar" />
          <p>A visual journey through our welfare programs, community outreach and social impact initiatives within local community.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 22 }} className="gal-grid">
          {items.map((img, i) => <GalleryImg key={`${slide}-${i}`} src={img.src} label={img.label} />)}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              style={{ width: i === slide ? 24 : 8, height: 8, borderRadius: 20, border: 'none', background: i === slide ? '#CC2229' : '#c8d4e8', padding: 0, cursor: 'pointer', transition: 'all .3s' }} />
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/gallery" className="btn btn-red">See More Images</Link>
        </div>
      </div>
      <style>{`@media(max-width:600px){.gal-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}
