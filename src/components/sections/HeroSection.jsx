import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../context/LangContext'

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false)
  const { t } = useLang()

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 80)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    { num: '08+',  label: t('statCommunity') },
    { num: '100+', label: t('statChildren') },
    { num: '200+', label: t('statArea') },
    { num: '2023', label: t('statSince') },
  ]

  return (
    <section style={{ position: 'relative', minHeight: 560, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=85&auto=format&fit=crop&crop=center"
        alt="Teacher with children"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%' }}
      />
      {/* Overlay gradient — darker on left for text, lighter on right to show image */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(13,27,62,0.96) 0%, rgba(27,61,122,0.90) 40%, rgba(27,61,122,0.60) 65%, rgba(27,61,122,0.20) 100%)' }} />

      {/* Main content row: left text + right stats */}
      <div style={{
        position: 'relative',
        flex: 1,
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
        padding: '72px 24px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 40,
      }}>

        {/* LEFT — Text block */}
        <div style={{
          maxWidth: 560,
          flex: '1 1 auto',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-block',
            background: '#CC2229',
            color: '#fff',
            padding: '5px 16px',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase',
            marginBottom: 22,
            borderRadius: 3,
          }}>
            {t('heroTag')}
          </div>

          {/* Heading */}
          <h1 style={{ fontSize: 'clamp(26px, 4vw, 48px)', fontWeight: 900, lineHeight: 1.18, color: '#fff', marginBottom: 20 }}>
            {t('heroHeading1')}{' '}
            <span style={{ color: '#7ec8e3' }}>{t('heroHeading2')}</span>
          </h1>

          {/* Subtext */}
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.82)', lineHeight: 1.8, marginBottom: 34, maxWidth: 500 }}>
            {t('heroSub')}
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link
              to="/donate"
              style={{
                display: 'inline-block',
                background: '#CC2229',
                color: '#fff',
                padding: '13px 28px',
                borderRadius: 5,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(204,34,41,0.45)',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#aa1a20'}
              onMouseOut={e => e.currentTarget.style.background = '#CC2229'}
            >
              {t('heroDonate')}
            </Link>
            <Link
              to="/volunteer"
              style={{
                display: 'inline-block',
                background: 'transparent',
                color: '#fff',
                padding: '13px 28px',
                borderRadius: 5,
                fontWeight: 600,
                fontSize: 14,
                textDecoration: 'none',
                border: '2px solid rgba(255,255,255,0.75)',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.borderColor = '#fff' }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.75)' }}
            >
              {t('heroVolunteer')}
            </Link>
          </div>
        </div>

        {/* RIGHT — Stats 2×2 grid */}
        <div
          className="hero-stats-grid"
          style={{
            display: 'grid',
       gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: 3,
            flexShrink: 0,
            width: 340,
            opacity: loaded ? 1 : 0,
            transition: 'opacity 1s ease 0.45s',
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
               
                backdropFilter: 'blur(8px)',
                padding: '22px 18px',
                textAlign: 'center',
                borderRadius:
                  i === 0 ? '10px 0 0 0' :
                  i === 1 ? '0 10px 0 0' :
                  i === 2 ? '0 0 0 10px' :
                  '0 0 10px 0',
              }}
            >
              <div style={{ fontSize: 'clamp(22px, 3vw, 38px)', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                {s.num}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 7, lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .hero-stats-grid { display: none !important; }
        }
      `}</style>
    </section>
  )
}
