import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageBanner from '../../components/common/PageBanner'
import { Download, Award, CreditCard, Calendar, CheckCircle, Clock, Eye, LogOut, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { donationApi, certificateApi, eventApi, volunteerApi } from '../../services/api'
import LoginModal from '../Auth/LoginModal'

const tabs = ['Overview', 'Donations', 'Certificates', 'Events', 'ID Card']

export default function Dashboard() {
  const { user, loading, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Overview')
  const [showLogin, setShowLogin] = useState(false)

  const [donations, setDonations] = useState([])
  const [certificates, setCertificates] = useState([])
  const [volunteerProfile, setVolunteerProfile] = useState(null)
  const [dataLoading, setDataLoading] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShowLogin(true)
    }
  }, [loading, isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      setDataLoading(true)
      Promise.all([
        donationApi.getHistory().catch(() => ({ data: { donations: [] } })),
        certificateApi.getMyCertificates().catch(() => ({ data: { certificates: [] } })),
        volunteerApi.getProfile().catch(() => null),
      ]).then(([donRes, certRes, volRes]) => {
        setDonations(donRes.data?.donations || [])
        setCertificates(certRes.data?.certificates || [])
        if (volRes) setVolunteerProfile(volRes.data?.volunteer)
      }).finally(() => setDataLoading(false))
    }
  }, [isAuthenticated])

  const handleDownloadCert = async (id, name) => {
    try {
      const res = await certificateApi.download(id)
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url; a.download = `certificate-${name}.pdf`; a.click()
      URL.revokeObjectURL(url)
    } catch { toast.error('Download failed. Please try again.') }
  }

  const handleDownloadReceipt = async (id) => {
    try {
      const res = await donationApi.downloadReceipt(id)
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a'); a.href = url; a.download = `receipt.pdf`; a.click()
      URL.revokeObjectURL(url)
    } catch { toast.error('Receipt download failed.') }
  }

  const handleDownloadIDCard = async () => {
    try {
      const res = await volunteerApi.generateIdCard()
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a'); a.href = url; a.download = `volunteer-id-card.pdf`; a.click()
      URL.revokeObjectURL(url)
    } catch { toast.error('ID Card generation failed. Contact admin.') }
  }

  if (showLogin && !isAuthenticated) {
    return (
      <>
        <PageBanner title="My Dashboard" breadcrumbs={[{ label: 'Dashboard' }]} />
        <section style={{ padding: '80px 0', textAlign: 'center', background: '#F7F8FA' }}>
          <div className="container" style={{ maxWidth: 500 }}>
            <div style={{ background: '#fff', borderRadius: 14, padding: '50px 40px', boxShadow: '0 4px 30px rgba(0,0,0,0.08)' }}>
              <User size={50} color="#1B3D7A" style={{ marginBottom: 16 }} />
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1B3D7A', marginBottom: 8 }}>Login Required</h2>
              <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>Please log in to access your dashboard, view donations, certificates and more.</p>
              <button onClick={() => setShowLogin(true)}
                style={{ padding: '12px 32px', background: '#CC2229', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                Login / Register
              </button>
            </div>
          </div>
        </section>
        {showLogin && <LoginModal onClose={() => { if (isAuthenticated) setShowLogin(false) }} />}
      </>
    )
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px 0', color: '#666' }}>Loading...</div>
  }

  const cardStyle = { background: '#fff', borderRadius: 12, padding: '22px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 20 }

  return (
    <>
      <PageBanner title="My Dashboard" subtitle="Manage your donations, certificates, and volunteer activities." breadcrumbs={[{ label: 'Dashboard' }]} />

      <section style={{ padding: '40px 0 60px', background: '#F7F8FA' }}>
        <div className="container">
          {/* Profile card */}
          <div style={{
            background: 'linear-gradient(135deg, #1B3D7A 0%, #0D1B3E 100%)',
            borderRadius: 12, padding: '24px 28px', marginBottom: 24,
            display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
          }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 24, border: '3px solid rgba(255,255,255,0.3)', flexShrink: 0 }}>
              {user?.name?.charAt(0) || '?'}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 18, marginBottom: 2 }}>{user?.name}</h2>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{user?.email}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2, textTransform: 'capitalize' }}>Role: {user?.role}</div>
            </div>
            {volunteerProfile && (
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 14px', textAlign: 'center' }}>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Volunteer ID</div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{volunteerProfile.volunteerCode || 'Pending'}</div>
              </div>
            )}
            <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(204,34,41,0.8)', border: 'none', borderRadius: 7, padding: '8px 14px', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              <LogOut size={14} /> Logout
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 24, background: '#fff', borderRadius: 10, padding: 6, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '9px 18px', border: 'none', borderRadius: 7, fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
                background: tab === t ? '#1B3D7A' : 'transparent',
                color: tab === t ? '#fff' : '#555',
              }}>{t}</button>
            ))}
          </div>

          {/* Overview Tab */}
          {tab === 'Overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
              {[
                { icon: <CreditCard size={28} color="#1B3D7A" />, label: 'Total Donations', value: donations.length, sub: `₹${donations.reduce((a, d) => a + (d.amount || 0) / 100, 0).toLocaleString()} raised` },
                { icon: <Award size={28} color="#CC2229" />, label: 'Certificates', value: certificates.length, sub: 'Available to download' },
                { icon: <CheckCircle size={28} color="#28A745" />, label: 'Volunteer Status', value: volunteerProfile ? volunteerProfile.status : 'Not Applied', sub: volunteerProfile ? 'Profile active' : 'Apply to volunteer' },
              ].map((card, i) => (
                <div key={i} style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 52, height: 52, background: '#F0F4FF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{card.icon}</div>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: '#1B3D7A' }}>{card.value}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{card.label}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>{card.sub}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Donations Tab */}
          {tab === 'Donations' && (
            <div style={cardStyle}>
              <h3 style={{ fontWeight: 700, marginBottom: 16, color: '#1B3D7A' }}>Donation History</h3>
              {dataLoading ? <p>Loading...</p> : donations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
                  <CreditCard size={40} style={{ opacity: 0.3 }} />
                  <p style={{ marginTop: 12 }}>No donations yet. <Link to="/donate" style={{ color: '#CC2229' }}>Make your first donation</Link></p>
                </div>
              ) : donations.map(d => (
                <div key={d._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{d.programId?.title || 'General Fund'}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{new Date(d.createdAt).toLocaleDateString('en-IN')} · {d.receiptNumber}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontWeight: 800, color: '#1B3D7A', fontSize: 16 }}>₹{((d.amount || 0) / 100).toLocaleString()}</span>
                    <span style={{ background: d.status === 'success' ? '#d4edda' : '#fff3cd', color: d.status === 'success' ? '#155724' : '#856404', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                      {d.status}
                    </span>
                    {d.status === 'success' && (
                      <button onClick={() => handleDownloadReceipt(d._id)} style={{ background: 'none', border: '1px solid #1B3D7A', borderRadius: 6, padding: '4px 10px', fontSize: 12, color: '#1B3D7A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Download size={12} /> Receipt
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certificates Tab */}
          {tab === 'Certificates' && (
            <div style={cardStyle}>
              <h3 style={{ fontWeight: 700, marginBottom: 16, color: '#1B3D7A' }}>My Certificates</h3>
              {dataLoading ? <p>Loading...</p> : certificates.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
                  <Award size={40} style={{ opacity: 0.3 }} />
                  <p style={{ marginTop: 12 }}>No certificates yet. <Link to="/events" style={{ color: '#CC2229' }}>Join an event</Link> to earn one.</p>
                </div>
              ) : certificates.map(c => (
                <div key={c._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Award size={28} color="#CC2229" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{c.certificateType || 'Participation'} Certificate</div>
                      <div style={{ fontSize: 12, color: '#888' }}>{c.eventId?.title || c.programId?.title || 'NGO Activity'} · Issued: {new Date(c.issuedAt).toLocaleDateString('en-IN')}</div>
                      <div style={{ fontSize: 11, color: '#aaa' }}>ID: {c.certificateNumber}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/verify/${c.verificationToken}`} style={{ background: 'none', border: '1px solid #ddd', borderRadius: 6, padding: '5px 10px', fontSize: 12, color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Eye size={12} /> Verify
                    </Link>
                    <button onClick={() => handleDownloadCert(c._id, c.certificateNumber)} style={{ background: '#1B3D7A', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 12, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Download size={12} /> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Events Tab */}
          {tab === 'Events' && (
            <div style={cardStyle}>
              <h3 style={{ fontWeight: 700, marginBottom: 16, color: '#1B3D7A' }}>My Event Registrations</h3>
              <p style={{ color: '#888', fontSize: 14 }}>Your event registrations will appear here after you register for events.</p>
              <Link to="/events" className="btn btn-blue" style={{ marginTop: 12, display: 'inline-block' }}>Browse Events</Link>
            </div>
          )}

          {/* ID Card Tab */}
          {tab === 'ID Card' && (
            <div style={cardStyle}>
              <h3 style={{ fontWeight: 700, marginBottom: 16, color: '#1B3D7A' }}>Volunteer ID Card</h3>
              {volunteerProfile ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ background: '#F0F4FF', borderRadius: 10, padding: '16px 20px', fontSize: 14 }}>
                    <div><strong>Name:</strong> {user?.name}</div>
                    <div><strong>Volunteer Code:</strong> {volunteerProfile.volunteerCode || 'Assigned after approval'}</div>
                    <div><strong>Status:</strong> <span style={{ color: volunteerProfile.status === 'approved' ? '#28A745' : '#856404', textTransform: 'capitalize' }}>{volunteerProfile.status}</span></div>
                  </div>
                  {volunteerProfile.status === 'approved' && (
                    <button onClick={handleDownloadIDCard} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1B3D7A', border: 'none', borderRadius: 8, padding: '11px 22px', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                      <Download size={16} /> Download ID Card
                    </button>
                  )}
                  {volunteerProfile.status === 'pending' && (
                    <p style={{ color: '#856404', background: '#fff3cd', padding: '10px 14px', borderRadius: 8, fontSize: 13 }}>
                      Your volunteer application is under review. ID Card will be available after admin approval.
                    </p>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <p style={{ color: '#888', marginBottom: 16, fontSize: 14 }}>You haven't applied as a volunteer yet.</p>
                  <Link to="/volunteer" className="btn btn-blue">Apply as Volunteer</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
