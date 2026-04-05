import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function PageBanner({ title, subtitle, breadcrumbs = [] }) {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #0D1B3E 0%, #1B3D7A 60%, #2a5298 100%)',
      padding: '60px 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* decorative circles */}
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 240, height: 240,
        borderRadius: '50%', border: '2px solid rgba(255,255,255,0.06)'
      }} />
      <div style={{
        position: 'absolute', bottom: -40, left: -40, width: 160, height: 160,
        borderRadius: '50%', border: '2px solid rgba(255,255,255,0.06)'
      }} />

      <div className="container" style={{ position: 'relative' }}>
        <h1 style={{ color: '#fff', fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800, marginBottom: 10 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, marginBottom: 18 }}>{subtitle}</p>
        )}
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Home</Link>
          {breadcrumbs.map((b, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ChevronRight size={14} />
              {b.to ? (
                <Link to={b.to} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>{b.label}</Link>
              ) : (
                <span style={{ color: '#CC2229' }}>{b.label}</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
