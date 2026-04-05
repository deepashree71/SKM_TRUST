import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Award, Calendar, User, Loader } from 'lucide-react'
import { certificateApi } from '../../services/api'

export default function VerifyCertificate() {
  const { token } = useParams()
  const [cert, setCert] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    certificateApi.verify(token)
      .then(res => setCert(res.data))
      .catch(err => {
        // Fallback to demo tokens when backend is unavailable
        const demoDB = {
          'demo-token-1': {
            valid: true,
            certificate: {
              recipientName: 'Rahul Kumar',
              certTitle: 'Volunteer Service Certificate',
              eventName: 'Community Awareness Camp 2025',
              issueDate: 'April 10, 2025',
              certNumber: 'NGO-CERT-2025-0042',
            }
          },
          'demo-token-2': {
            valid: true,
            certificate: {
              recipientName: 'Rahul Kumar',
              certTitle: 'Participation Certificate',
              eventName: 'Skill Development Workshop',
              issueDate: 'March 20, 2025',
              certNumber: 'NGO-CERT-2025-0038',
            }
          },
        }
        if (demoDB[token]) {
          setCert(demoDB[token])
        } else {
          setError('Certificate not found')
        }
      })
      .finally(() => setLoading(false))
  }, [token])

  const isValid = cert?.valid
  const details = cert?.certificate

  return (
    <section style={{ minHeight: '80vh', background: '#F7F8FA', display: 'flex', alignItems: 'center', padding: '60px 0' }}>
      <div className="container" style={{ maxWidth: 580, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>Certificate Verification</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1B3D7A' }}>NGO Trust Digital Platform</h1>
          <p style={{ fontSize: 13, color: '#888', marginTop: 6 }}>Token: <code style={{ background: '#e8ecf4', padding: '2px 6px', borderRadius: 3, fontSize: 12 }}>{token}</code></p>
        </div>

        <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', border: '1px solid #e8ecf4' }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <Loader size={36} color="#1B3D7A" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
              <p style={{ color: '#666' }}>Verifying certificate...</p>
            </div>
          ) : (
            <>
              {/* Status bar */}
              <div style={{
                padding: '20px 28px',
                background: isValid ? 'linear-gradient(135deg, #28A745, #1e8a38)' : 'linear-gradient(135deg, #CC2229, #a01a1e)',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                {isValid ? <CheckCircle size={32} color="#fff" /> : <XCircle size={32} color="#fff" />}
                <div>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>
                    {isValid ? 'Certificate Verified ✓' : 'Certificate Not Found'}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                    {isValid ? 'This is an authentic certificate issued by NGO Trust' : 'This token does not match any certificate in our system'}
                  </div>
                </div>
              </div>

              <div style={{ padding: '28px' }}>
                {isValid && details ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {[
                      { icon: User, label: 'Recipient', value: details.recipientName || details.userId?.name },
                      { icon: Award, label: 'Certificate', value: details.certTitle || details.certNumber },
                      { icon: Calendar, label: 'Event / Program', value: details.eventName || details.eventId?.title },
                      { icon: Calendar, label: 'Issue Date', value: details.issueDate ? new Date(details.issueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
                    ].map((row, i) => {
                      const Icon = row.icon
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px', background: '#F7F8FA', borderRadius: 8 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1B3D7A15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon size={16} color="#1B3D7A" />
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>{row.label}</div>
                            <div style={{ fontWeight: 600, color: '#333', fontSize: 15 }}>{row.value}</div>
                          </div>
                        </div>
                      )
                    })}
                    <div style={{ background: '#eef4ff', borderRadius: 8, padding: '12px 16px', fontSize: 12, color: '#1B3D7A', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle size={14} />
                      Issued by: <strong>Shree Kankai Mataji Education & Charitable Trust</strong>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <XCircle size={48} color="#CC2229" style={{ margin: '0 auto 16px' }} />
                    <p style={{ color: '#555', marginBottom: 16 }}>The certificate with this verification token could not be found in our system.</p>
                    <p style={{ fontSize: 13, color: '#888' }}>If you believe this is an error, please contact us at <a href="mailto:skmectrustalindra@gmail.com" style={{ color: '#1B3D7A' }}>skmectrustalindra@gmail.com</a></p>
                  </div>
                )}

                <div style={{ marginTop: 24, textAlign: 'center' }}>
                  <Link to="/" className="btn btn-blue" style={{ textDecoration: 'none' }}>← Back to Home</Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  )
}
