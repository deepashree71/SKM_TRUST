import { useState, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ChevronDown, Menu, X, Phone, Globe, Check } from 'lucide-react'
import { useLang } from '../../context/LangContext'
import { useAuth } from '../../context/AuthContext'
import LoginModal from '../../pages/Auth/LoginModal'

// ── Google-Translate-style Language Dropdown ─────────────────────────────────
const LANG_FLAGS = { en: '🇬🇧', hi: '🇮🇳', gu: '🇮🇳', mr: '🇮🇳', ta: '🇮🇳' }
const LANG_NATIVE = { en: 'English', hi: 'हिन्दी', gu: 'ગુજરાતી', mr: 'मराठी', ta: 'தமிழ்' }
const LANG_ENGLISH = { en: 'English', hi: 'Hindi', gu: 'Gujarati', mr: 'Marathi', ta: 'Tamil' }

function LangDropdown({ lang, setLang, LANG_OPTIONS }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 10px', border: '1.5px solid #c8d8f0',
          borderRadius: 6, background: open ? '#EEF4FF' : '#fff',
          color: '#1B3D7A', fontWeight: 600, fontSize: 12,
          cursor: 'pointer', transition: 'all .15s', whiteSpace: 'nowrap',
        }}
        onMouseOver={e => { if (!open) e.currentTarget.style.background = '#f0f5ff' }}
        onMouseOut={e => { if (!open) e.currentTarget.style.background = '#fff' }}
      >
        <Globe size={13} strokeWidth={2} />
        <span style={{ fontSize: 13 }}>{LANG_FLAGS[lang]}</span>
        <span>{LANG_NATIVE[lang]}</span>
        <ChevronDown size={11} style={{ transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          background: '#fff', borderRadius: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid #e0e8f5',
          minWidth: 210, zIndex: 9999, overflow: 'hidden',
        }}>
          <div style={{
            background: 'linear-gradient(90deg, #1B3D7A 0%, #2B5DB8 100%)',
            padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <Globe size={14} color="rgba(255,255,255,0.9)" />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 12, letterSpacing: 0.4 }}>Select Language</span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginLeft: 'auto' }}>भाषा चुनें</span>
          </div>

          <div style={{ padding: '6px 0' }}>
            {LANG_OPTIONS.map(l => {
              const isActive = lang === l.code
              return (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setOpen(false) }}
                  style={{
                    width: '100%', padding: '9px 14px',
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: isActive ? '#EEF4FF' : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    transition: 'background .12s',
                    borderLeft: isActive ? '3px solid #1B3D7A' : '3px solid transparent',
                  }}
                  onMouseOver={e => { if (!isActive) e.currentTarget.style.background = '#f5f8ff' }}
                  onMouseOut={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{LANG_FLAGS[l.code]}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: isActive ? 700 : 500, fontSize: 13, color: isActive ? '#1B3D7A' : '#222', lineHeight: 1.3 }}>
                      {LANG_NATIVE[l.code]}
                    </div>
                    <div style={{ fontSize: 11, color: '#888', lineHeight: 1.2 }}>
                      {LANG_ENGLISH[l.code]}
                    </div>
                  </div>
                  {isActive && <Check size={14} color="#1B3D7A" strokeWidth={2.5} style={{ flexShrink: 0 }} />}
                </button>
              )
            })}
          </div>

          <div style={{
            borderTop: '1px solid #eef0f5', padding: '7px 14px',
            display: 'flex', alignItems: 'center', gap: 5,
            background: '#fafbff',
          }}>
            <Globe size={11} color="#999" />
            <span style={{ fontSize: 10, color: '#aaa' }}>5 languages supported</span>
          </div>
        </div>
      )}
    </div>
  )
}

const tickerItems = [
  'Bhavya Pre-School educational programs benefiting children in Alindra community',
  'Community-based early childhood learning initiative underway',
  'Activity-based foundational learning programs for young children',
  'Cultural and value-based education initiatives conducted at preschool',
  'Trust registered under NITI Aayog NGO Darpan portal',
  'Provisional 12A & 80G certifications granted under Income Tax Act',
]

function SKMLogo({ size = 52 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <circle cx="32" cy="32" r="30" fill="url(#gR)" stroke="#8B6508" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="22" fill="url(#gI)" stroke="#c8960c" strokeWidth="0.8" />
      {[0,45,90,135,180,225,270,315].map((d,i) => <ellipse key={i} cx="32" cy="13" rx="3.5" ry="7" fill="#b8860b" opacity="0.7" transform={`rotate(${d} 32 32)`} />)}
      {[22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5].map((d,i) => <ellipse key={i} cx="32" cy="20" rx="2" ry="4.5" fill="#f5d87e" opacity="0.8" transform={`rotate(${d} 32 32)`} />)}
      <circle cx="32" cy="32" r="8" fill="#f5d87e" stroke="#b8860b" strokeWidth="1" />
      <text x="32" y="36" textAnchor="middle" fontSize="10" fill="#5a3e00" fontWeight="bold" fontFamily="serif">ॐ</text>
      <path id="bA" d="M 12 40 A 22 22 0 0 0 52 40" fill="none" />
      <text fontSize="5.5" fill="#5a3e00" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1">
        <textPath href="#bA" startOffset="12%">S K M TRUST</textPath>
      </text>
      <defs>
        <radialGradient id="gR" cx="40%" cy="35%"><stop offset="0%" stopColor="#f5d87e" /><stop offset="100%" stopColor="#c8960c" /></radialGradient>
        <radialGradient id="gI" cx="40%" cy="35%"><stop offset="0%" stopColor="#f9e89a" /><stop offset="100%" stopColor="#d4a017" /></radialGradient>
      </defs>
    </svg>
  )
}

export default function Header() {
  const { lang, setLang, t, LANG_OPTIONS } = useLang()
  const [openDrop, setOpenDrop] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const { user, logout } = useAuth()
  const timer = useRef(null)

  // Build nav items from translations so they update on language change
  const navItems = [
    {
      label: t('whoWeAre'),
      children: [
        { label: t('aboutUs'), to: '/about' },
        { label: 'Our Team', to: '/about#team' },
        { label: 'Financial Documents', to: '/transparency' },
        { label: t('contact'), to: '/contact' },
      ],
    },
    {
      label: t('whatWeDo'),
      children: [
        { label: t('programs'), to: '/programs' },
        { label: t('events'), to: '/events' },
        { label: 'Impact Map', to: '/impact-map' },
        { label: 'Our Stories', to: '/stories' },
      ],
    },
    {
      label: t('howToEmpower'),
      children: [
        { label: 'Donate Online', to: '/donate' },
        { label: t('volunteer'), to: '/volunteer' },
        { label: 'CSR Partnership', to: '/contact' },
      ],
    },
    {
      label: t('gallery'),
      children: [
        { label: 'Photo Gallery', to: '/gallery' },
        { label: 'Impact Stories', to: '/stories' },
      ],
    },
    {
      label: t('login'),
      children: [
        { label: 'Volunteer Login', to: '/dashboard' },
        { label: 'Admin Login', to: '/dashboard' },
      ],
    },
    { label: t('generateId'), to: '/generate-id', plain: true },
    { label: t('donateNow'), to: '/donate', donate: true },
  ]

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const fn = () => { if (window.innerWidth > 960) setMobileOpen(false) }
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  const enter = (i) => { clearTimeout(timer.current); setOpenDrop(i) }
  const leave = () => { timer.current = setTimeout(() => setOpenDrop(null), 100) }

  return (
    <>
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, boxShadow: scrolled ? '0 3px 24px rgba(0,0,0,0.22)' : '0 1px 6px rgba(0,0,0,0.08)', transition: 'box-shadow 0.3s' }}>

        {/* ── Topbar ── */}
        <div style={{ background: '#1B3D7A' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', height: 36 }}>
            {/* Social icons */}
            <div className="skm-social" style={{ display: 'flex', gap: 4, marginRight: 10, flexShrink: 0 }}>
              {[
                <path key="fb" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />,
                <g key="ig"><rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="white" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="white" /><circle cx="17.5" cy="6.5" r="1.5" fill="white" /></g>,
                <path key="yt" d="M22.54 6.42a2.78 2.78 0 00-1.94-1.95C18.88 4 12 4 12 4s-6.88 0-8.6.47A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.4 19.53C5.12 20 12 20 12 20s6.88 0 8.6-.47a2.78 2.78 0 001.94-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />,
              ].map((icon, i) => (
                <a key={i} href="#" aria-label="social" style={{ width: 24, height: 24, borderRadius: 3, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
                  <svg viewBox="0 0 24 24" fill="white" width="12" height="12">{icon}</svg>
                </a>
              ))}
            </div>

            {/* Ticker */}
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <span style={{ background: '#CC2229', color: '#fff', padding: '2px 8px', borderRadius: 3, fontWeight: 700, fontSize: 10, whiteSpace: 'nowrap', letterSpacing: 0.6, textTransform: 'uppercase', flexShrink: 0 }}>Latest</span>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{ display: 'inline-block', whiteSpace: 'nowrap', animation: 'hdrTicker 38s linear infinite', color: 'rgba(255,255,255,0.88)', fontSize: 12 }}>
                  {[...tickerItems, ...tickerItems].map((item, i) => (
                    <span key={i} style={{ marginRight: 80 }}>📢 {item}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Phone */}
            <a href="tel:+919876543210" className="skm-phone" style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.9)', fontSize: 12, textDecoration: 'none', whiteSpace: 'nowrap', marginLeft: 10, flexShrink: 0 }}>
              <Phone size={12} /> +91-98765-43210
            </a>
          </div>
        </div>

        {/* ── Brand row ── */}
        <div style={{ background: '#fff', borderBottom: '1px solid #dde6f4' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '7px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
              <SKMLogo size={50} />
              <div style={{ lineHeight: 1.25 }}>
                <div style={{ fontWeight: 800, fontSize: 'clamp(13px,1.6vw,17px)', color: '#1B3D7A' }}>SKM Trust</div>
                <div style={{ fontSize: 'clamp(8px,0.9vw,10.5px)', color: '#666', fontStyle: 'italic', whiteSpace: 'nowrap' }}>Education &amp; Charitable Trust</div>
              </div>
            </Link>

            <div className="skm-center" style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontWeight: 900, fontSize: 'clamp(12px,1.7vw,21px)', color: '#1B3D7A', letterSpacing: 1.5, textTransform: 'uppercase', lineHeight: 1.2 }}>SHREE KANKAI MATAJI</div>
              <div style={{ fontSize: 'clamp(8px,0.85vw,10.5px)', color: '#555', letterSpacing: 0.3, marginTop: 2 }}>EDUCATION &amp; CHARITABLE TRUST &nbsp;|&nbsp; Registered Under Trust Act</div>
            </div>

            <div className="skm-brand-actions" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <Link to="/volunteer" className="skm-btn-member"
                style={{ padding: '6px 13px', border: '1.5px solid #1B3D7A', borderRadius: 4, color: '#1B3D7A', fontWeight: 600, fontSize: 12, textDecoration: 'none', background: '#fff', whiteSpace: 'nowrap', transition: 'all .2s' }}
                onMouseOver={e => { e.currentTarget.style.background = '#1B3D7A'; e.currentTarget.style.color = '#fff' }}
                onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1B3D7A' }}>
                {t('applyMembership')}
              </Link>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Link to="/dashboard"
                    style={{ padding: '6px 14px', background: '#1B3D7A', borderRadius: 4, color: '#fff', fontWeight: 600, fontSize: 12, textDecoration: 'none', whiteSpace: 'nowrap', border: '1px solid rgba(255,255,255,0.3)' }}>
                    Dashboard
                  </Link>
                  <button onClick={logout}
                    style={{ padding: '6px 10px', background: '#CC2229', border: 'none', borderRadius: 4, color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    Logout
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowLogin(true)}
                  style={{ padding: '6px 16px', background: '#1B3D7A', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 4, color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {t('login')}
                </button>
              )}

              {/* Language selector — Google Translate style */}
              <LangDropdown lang={lang} setLang={setLang} LANG_OPTIONS={LANG_OPTIONS} />
            </div>

            <button onClick={() => setMobileOpen(o => !o)} className="skm-hamburger" aria-label="Toggle menu"
              style={{ background: 'none', border: 'none', color: '#1B3D7A', cursor: 'pointer', padding: '6px', display: 'none', flexShrink: 0 }}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* ── Desktop Nav ── */}
        <nav className="skm-desknav" style={{ background: '#1B3D7A' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
            <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center', flexWrap: 'nowrap' }}>
              {navItems.map((item, i) => (
                <li key={i} style={{ position: 'relative' }}
                  onMouseEnter={() => item.children && enter(i)}
                  onMouseLeave={() => item.children && leave()}>
                  {item.to && !item.children ? (
                    <NavLink to={item.to} style={({ isActive }) => ({
                      display: 'flex', alignItems: 'center',
                      padding: item.donate ? '9px 16px' : '12px 12px',
                      fontSize: 13, fontWeight: item.donate ? 700 : 500,
                      color: '#dce4f4', textDecoration: 'none',
                      background: item.donate ? '#CC2229' : isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                      borderBottom: isActive && !item.donate ? '3px solid #CC2229' : '3px solid transparent',
                      borderRadius: item.donate ? 4 : 0,
                      margin: item.donate ? '0 0 0 4px' : 0,
                      transition: 'all .2s', whiteSpace: 'nowrap',
                    })}>
                      {item.label}
                    </NavLink>
                  ) : (
                    <button style={{
                      display: 'flex', alignItems: 'center', gap: 3,
                      padding: '12px 12px', fontSize: 13, fontWeight: 500,
                      color: '#dce4f4',
                      background: openDrop === i ? 'rgba(255,255,255,0.1)' : 'transparent',
                      border: 'none',
                      borderBottom: openDrop === i ? '3px solid #CC2229' : '3px solid transparent',
                      cursor: 'pointer', fontFamily: 'Poppins,sans-serif', whiteSpace: 'nowrap', transition: 'all .2s',
                    }}>
                      {item.label}
                      <ChevronDown size={11} style={{ transition: 'transform .2s', transform: openDrop === i ? 'rotate(180deg)' : 'none' }} />
                    </button>
                  )}

                  {item.children && openDrop === i && (
                    <ul style={{
                      position: 'absolute', top: '100%', left: 0,
                      background: '#fff', listStyle: 'none', padding: '6px 0',
                      margin: 0, minWidth: 200, zIndex: 500,
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                      borderTop: '3px solid #CC2229', borderRadius: '0 0 6px 6px',
                    }}
                      onMouseEnter={() => enter(i)}
                      onMouseLeave={leave}>
                      {item.children.map((child, j) => (
                        <li key={j}>
                          <Link to={child.to} onClick={() => setOpenDrop(null)}
                            style={{ display: 'block', padding: '9px 20px', fontSize: 13, color: '#333', textDecoration: 'none', transition: 'all .15s' }}
                            onMouseOver={e => { e.currentTarget.style.background = '#f0f4ff'; e.currentTarget.style.color = '#1B3D7A'; e.currentTarget.style.paddingLeft = '24px' }}
                            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#333'; e.currentTarget.style.paddingLeft = '20px' }}>
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div style={{ background: '#0D1B3E', borderTop: '1px solid rgba(255,255,255,0.1)', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
            {navItems.map((item, i) => (
              <div key={i}>
                {item.to && !item.children ? (
                  <Link to={item.to} onClick={() => setMobileOpen(false)}
                    style={{ display: 'block', padding: '13px 20px', color: '#fff', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.07)', background: item.donate ? '#CC2229' : 'transparent', fontWeight: item.donate ? 700 : 400, fontSize: 14 }}>
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <button onClick={() => setMobileExpanded(mobileExpanded === i ? null : i)}
                      style={{ width: '100%', padding: '13px 20px', background: 'none', border: 'none', color: '#aabbdd', textAlign: 'left', fontFamily: 'Poppins,sans-serif', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.7, borderBottom: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {item.label}
                      <ChevronDown size={14} style={{ transform: mobileExpanded === i ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }} />
                    </button>
                    {mobileExpanded === i && item.children?.map((child, j) => (
                      <Link key={j} to={child.to} onClick={() => setMobileOpen(false)}
                        style={{ display: 'block', padding: '11px 36px', color: '#dce4f4', fontSize: 13, textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.04)' }}>
                        › {child.label}
                      </Link>
                    ))}
                  </>
                )}
              </div>
            ))}
            <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
              <a href="tel:+919876543210" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Phone size={13} /> +91-98765-43210
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Mobile donate bar */}
      <Link to="/donate" className="skm-mobile-donate"
        style={{ display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, background: '#CC2229', color: '#fff', textAlign: 'center', padding: '13px', textDecoration: 'none', fontWeight: 700, fontSize: 14, zIndex: 999 }}>
        💛 Donate Now — Support A Child Today
      </Link>

      <style>{`
        @keyframes hdrTicker { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
        :root { --skm-header-h: 128px }
        @media(min-width: 961px) { .skm-hamburger { display: none !important } }
        @media(max-width: 960px) {
          :root { --skm-header-h: 94px }
          .skm-desknav { display: none !important }
          .skm-hamburger { display: block !important }
          .skm-mobile-donate { display: block !important }
          .skm-center { display: none !important }
          .skm-brand-actions { display: none !important }
          .skm-phone { display: none !important }
        }
        @media(max-width: 480px) {
          :root { --skm-header-h: 82px }
          .skm-social { display: none !important }
          .skm-btn-member { display: none !important }
        }
      `}</style>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}
