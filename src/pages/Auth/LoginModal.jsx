import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../services/api'
import toast from 'react-hot-toast'
import { X, Eye, EyeOff } from 'lucide-react'

export default function LoginModal({ onClose, defaultTab = 'login' }) {
  const { login } = useAuth()
  const [tab, setTab] = useState(defaultTab) // 'login' | 'register'
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [regForm, setRegForm] = useState({ name: '', email: '', phone: '', password: '', role: 'donor' })

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!loginForm.email || !loginForm.password) return toast.error('Email and password required.')
    setLoading(true)
    try {
      const user = await login(loginForm.email, loginForm.password)
      toast.success(`Welcome back, ${user.name}!`)
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!regForm.name || !regForm.email || !regForm.password) return toast.error('Name, email and password required.')
    if (regForm.password.length < 6) return toast.error('Password must be at least 6 characters.')
    setLoading(true)
    try {
      await authApi.register(regForm)
      toast.success('Registered! Please log in.')
      setTab('login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }
  const box = { background: '#fff', borderRadius: 14, width: '100%', maxWidth: 440, padding: '36px 32px', position: 'relative' }
  const inp = { width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginTop: 4 }
  const lbl = { display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginTop: 14 }
  const btn = { width: '100%', padding: '11px', background: '#CC2229', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 20 }

  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={box}>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
          <X size={20} />
        </button>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '2px solid #eee' }}>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '10px', border: 'none', background: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: 14, color: tab === t ? '#CC2229' : '#888',
              borderBottom: tab === t ? '2px solid #CC2229' : '2px solid transparent',
              marginBottom: -2, textTransform: 'capitalize'
            }}>
              {t === 'login' ? 'Login' : 'Register'}
            </button>
          ))}
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1B3D7A', marginBottom: 4 }}>Welcome Back</h2>
            <p style={{ fontSize: 13, color: '#777', marginBottom: 8 }}>Login to your NGO Trust account</p>

            <label style={lbl}>Email Address</label>
            <input style={inp} type="email" placeholder="you@example.com" value={loginForm.email}
              onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))} required />

            <label style={lbl}>Password</label>
            <div style={{ position: 'relative', marginTop: 4 }}>
              <input style={{ ...inp, marginTop: 0, paddingRight: 40 }} type={showPass ? 'text' : 'password'}
                placeholder="••••••••" value={loginForm.password}
                onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))} required />
              <button type="button" onClick={() => setShowPass(p => !p)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" style={btn} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 13, marginTop: 14, color: '#777' }}>
              Don't have an account?{' '}
              <span onClick={() => setTab('register')} style={{ color: '#CC2229', cursor: 'pointer', fontWeight: 700 }}>Register here</span>
            </p>

            {/* Admin hint */}
            <div style={{ marginTop: 16, background: '#FFF3CD', border: '1px solid #FFEAA7', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#856404' }}>
              <strong>Admin Login:</strong> admin@ngotrust.org / Admin@1234
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1B3D7A', marginBottom: 4 }}>Create Account</h2>
            <p style={{ fontSize: 13, color: '#777', marginBottom: 8 }}>Join the NGO Trust community</p>

            <label style={lbl}>Full Name</label>
            <input style={inp} type="text" placeholder="Your full name" value={regForm.name}
              onChange={e => setRegForm(p => ({ ...p, name: e.target.value }))} required />

            <label style={lbl}>Email Address</label>
            <input style={inp} type="email" placeholder="you@example.com" value={regForm.email}
              onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))} required />

            <label style={lbl}>Phone Number</label>
            <input style={inp} type="tel" placeholder="+91 98765 43210" value={regForm.phone}
              onChange={e => setRegForm(p => ({ ...p, phone: e.target.value }))} />

            <label style={lbl}>I want to join as</label>
            <select style={inp} value={regForm.role} onChange={e => setRegForm(p => ({ ...p, role: e.target.value }))}>
              <option value="donor">Donor</option>
              <option value="volunteer">Volunteer</option>
            </select>

            <label style={lbl}>Password</label>
            <input style={inp} type="password" placeholder="Min 6 characters" value={regForm.password}
              onChange={e => setRegForm(p => ({ ...p, password: e.target.value }))} required />

            <button type="submit" style={btn} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 13, marginTop: 14, color: '#777' }}>
              Already have an account?{' '}
              <span onClick={() => setTab('login')} style={{ color: '#CC2229', cursor: 'pointer', fontWeight: 700 }}>Login here</span>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
