import { Link } from 'react-router-dom'

function SKMLogoFooter() {
  return (
    <svg viewBox="0 0 64 64" width={80} height={80} xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="url(#fgR)" stroke="#8B6508" strokeWidth="1.5"/>
      <circle cx="32" cy="32" r="22" fill="url(#fgI)" stroke="#c8960c" strokeWidth="0.8"/>
      {[0,45,90,135,180,225,270,315].map((d,i)=><ellipse key={i} cx="32" cy="13" rx="3.5" ry="7" fill="#b8860b" opacity="0.7" transform={`rotate(${d} 32 32)`}/>)}
      {[22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5].map((d,i)=><ellipse key={i} cx="32" cy="20" rx="2" ry="4.5" fill="#f5d87e" opacity="0.8" transform={`rotate(${d} 32 32)`}/>)}
      <circle cx="32" cy="32" r="8" fill="#f5d87e" stroke="#b8860b" strokeWidth="1"/>
      <text x="32" y="36" textAnchor="middle" fontSize="10" fill="#5a3e00" fontWeight="bold" fontFamily="serif">ॐ</text>
      <path id="fA" d="M 12 40 A 22 22 0 0 0 52 40" fill="none"/>
      <text fontSize="5" fill="#5a3e00" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1"><textPath href="#fA" startOffset="10%">S K M TRUST</textPath></text>
      <defs>
        <radialGradient id="fgR" cx="40%" cy="35%"><stop offset="0%" stopColor="#f5d87e"/><stop offset="100%" stopColor="#c8960c"/></radialGradient>
        <radialGradient id="fgI" cx="40%" cy="35%"><stop offset="0%" stopColor="#f9e89a"/><stop offset="100%" stopColor="#d4a017"/></radialGradient>
      </defs>
    </svg>
  )
}

const socialIcons = [
  { path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z', label: 'Facebook' },
  { path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z', label: 'Facebook2' },
  { path: 'M22.54 6.42a2.78 2.78 0 00-1.94-1.95C18.88 4 12 4 12 4s-6.88 0-8.6.47A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.4 19.53C5.12 20 12 20 12 20s6.88 0 8.6-.47a2.78 2.78 0 001.94-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z', label: 'YouTube' },
  { d: 'instagram', label: 'Instagram' },
]

const hdr = { color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid #CC2229', display: 'block' }
const lnk = { color: '#8899bb', textDecoration: 'none', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', transition: 'color .2s' }

export default function Footer() {
  return (
    <footer style={{ background: '#0D1B3E', color: '#8899bb' }}>
      <div className="container" style={{ padding: '56px 20px 36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr', gap: 40 }} className="footer-grid">

          {/* Col 1: Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <SKMLogoFooter />
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#fff', lineHeight: 1.3 }}>
                  Shree Kankai<br/>Mataji Education &amp;<br/>Charitable Trust
                </div>
                <div style={{ fontSize: 11, color: '#CC2229', fontWeight: 600, marginTop: 4 }}>Empowering Young Minds<br/>Through Education</div>
              </div>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: '#6677aa' }}>
              A Community-Based, Government Recognized NGO committed to transforming lives through Education,
              Early Education Support, Child Development, Foundational Learning Support and Social Welfare since 2023.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <span style={hdr}>Quick Links</span>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {[
                ['Home', '/'],
                ['About Us', '/about'],
                ['Activities', '/programs'],
                ['Campaigns', '/programs'],
                ['Membership', '/volunteer'],
                ['Contact', '/contact'],
              ].map(([l, t], i) => (
                <li key={i} style={{ marginBottom: 2 }}>
                  <Link to={t} style={lnk}
                    onMouseOver={e => e.currentTarget.style.color = '#fff'}
                    onMouseOut={e => e.currentTarget.style.color = '#8899bb'}>
                    › {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Important Links */}
          <div>
            <span style={hdr}>Important Links</span>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {[
                ['Verify Certificate', '/verify/demo'],
                ['Apply Membership', '/volunteer'],
                ['Login', '/dashboard'],
                ['Reports', '/transparency'],
                ['Beneficiaries', '/stories'],
              ].map(([l, t], i) => (
                <li key={i} style={{ marginBottom: 2 }}>
                  <Link to={t} style={lnk}
                    onMouseOver={e => e.currentTarget.style.color = '#fff'}
                    onMouseOut={e => e.currentTarget.style.color = '#8899bb'}>
                    › {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Registration Details */}
          <div>
            <span style={hdr}>Registration Details</span>
            {[
              ['PAN NUMBER', 'ABLTS8056L'],
              ['12A CERTIFICATE', 'Approved — No. ABLTS8056LE20251'],
              ['80G CERTIFICATE', 'Approved — No. ABLTS8056LF20251'],
              ['FCRA REGISTRATION', 'Reg. No. 231650123'],
              ['EMAIL', 'skmectrustalindra@gmail.com'],
              ['PHONE', '+91-98765-43210'],
            ].map(([l, v], i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ color: '#aabbdd', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700, marginBottom: 2 }}>{l}</div>
                <div style={{ fontSize: 12.5, color: '#8899bb' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', padding: '18px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12, color: '#445577' }}>
            © {new Date().getFullYear()}{' '}
            <Link to="/" style={{ color: '#6677aa', textDecoration: 'none' }}>
              Shree Kankai Mataji Education &amp; Charitable Trust
            </Link>
            . All Rights Reserved. | Registered Under Trust Act | CIN: U85300DL2005NPL123456
          </div>
          {/* Social icons */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[
             
              { d: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
              { ig: true },
              { d: 'M22.54 6.42a2.78 2.78 0 00-1.94-1.95C18.88 4 12 4 12 4s-6.88 0-8.6.47A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.4 19.53C5.12 20 12 20 12 20s6.88 0 8.6-.47a2.78 2.78 0 001.94-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z' },
            ].map((icon, i) => (
              <a key={i} href="#" aria-label="social"
                style={{ width: 34, height: 34, borderRadius: 6, background: '#1B3D7A', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s' }}
                onMouseOver={e => e.currentTarget.style.background = '#CC2229'}
                onMouseOut={e => e.currentTarget.style.background = '#1B3D7A'}>
                <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
                  {icon.ig ? (
                    <g>
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" strokeWidth="2"/>
                      <circle cx="12" cy="12" r="5" fill="none" stroke="white" strokeWidth="2"/>
                      <circle cx="17.5" cy="6.5" r="1.5" fill="white"/>
                    </g>
                  ) : (
                    <path d={icon.d} />
                  )}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:900px){.footer-grid{grid-template-columns:1fr 1fr!important;gap:32px!important}}
        @media(max-width:540px){.footer-grid{grid-template-columns:1fr!important}}
      `}</style>
    </footer>
  )
}
