export default function SectionHeading({ title, subtitle, align = 'center' }) {
  return (
    <div style={{ textAlign: align, marginBottom: 40 }}>
      <h2 style={{ fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 700, color: '#1B3D7A', marginBottom: 8 }}>
        {title}
      </h2>
      <div style={{
        width: 40, height: 3, background: '#CC2229',
        margin: align === 'center' ? '10px auto' : '10px 0',
        borderRadius: 2
      }} />
      {subtitle && (
        <p style={{ color: '#666', fontSize: 14, maxWidth: 600, margin: align === 'center' ? '0 auto' : '0' }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
