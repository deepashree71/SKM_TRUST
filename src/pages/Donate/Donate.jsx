import { useState, useEffect } from 'react'
import PageBanner from '../../components/common/PageBanner'
import { CheckCircle, Lock, Heart, Share2, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { donationApi, programApi, donationPosterApi } from '../../services/api'
import LoginModal from '../Auth/LoginModal'

const PRESET_AMOUNTS = [500, 1000, 2000, 5000, 10000, 25000]

export default function Donate() {
  const { user, isAuthenticated } = useAuth()
  const [step, setStep] = useState(1)
  const [programs, setPrograms] = useState([])
  const [program, setProgram] = useState('')
  const [programId, setProgramId] = useState('')
  const [amount, setAmount] = useState(1000)
  const [custom, setCustom] = useState('')
  const [donor, setDonor] = useState({ name: '', email: '', phone: '', message: '' })
  const [success, setSuccess] = useState(null)
  const [poster, setPoster] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    programApi.getAll({ status: 'active' })
      .then(res => {
        const progs = res.data?.programs || []
        setPrograms(progs)
        if (progs.length > 0) { setProgram(progs[0].title); setProgramId(progs[0]._id) }
        else { setProgram('General Fund'); setProgramId('') }
      })
      .catch(() => { setProgram('General Fund'); setProgramId('') })
  }, [])

  useEffect(() => {
    if (isAuthenticated && user) {
      setDonor(d => ({ ...d, name: d.name || user.name || '', email: d.email || user.email || '' }))
    }
  }, [isAuthenticated, user])

  const finalAmount = custom ? parseInt(custom) || 0 : amount

  const loadRazorpay = () => new Promise(resolve => {
    if (window.Razorpay) return resolve(true)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })

  const handlePay = async (e) => {
    e.preventDefault()
    if (!donor.name || !donor.email) return toast.error('Name and email required.')
    if (finalAmount < 1) return toast.error('Please enter a valid amount.')
    if (!isAuthenticated) { setShowLogin(true); return }

    setPaying(true)
    try {
      const loaded = await loadRazorpay()
      if (!loaded) { toast.error('Payment gateway failed to load. Please check your internet.'); setPaying(false); return }

      const orderRes = await donationApi.createOrder({
        amount: finalAmount * 100, // paise
        programId: programId || undefined,
        donorMessage: donor.message,
      })
      const { order, donationId } = orderRes.data

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'NGO Trust',
        description: `Donation - ${program}`,
        order_id: order.id,
        prefill: { name: donor.name, email: donor.email, contact: donor.phone },
        theme: { color: '#1B3D7A' },
        handler: async (response) => {
          try {
            const verifyRes = await donationApi.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            setSuccess({ ...verifyRes.data.donation, donorName: donor.name, donorEmail: donor.email, programName: program })
            toast.success('Payment successful! Thank you for your donation.')
            // Generate poster
            donationPosterApi.generate({ donationId, privacyMode: 'full_name' })
              .then(r => setPoster(r.data?.poster)).catch(() => {})
          } catch { toast.error('Payment verification failed. Contact support if amount was deducted.') }
          finally { setPaying(false) }
        },
        modal: { ondismiss: () => { toast('Payment cancelled.'); setPaying(false) } }
      }
      new window.Razorpay(options).open()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment initiation failed.')
      setPaying(false)
    }
  }

  if (success) {
    return (
      <>
        <PageBanner title="Donate" breadcrumbs={[{ label: 'Donate' }]} />
        <section style={{ padding: '80px 0', background: '#F7F8FA' }}>
          <div className="container" style={{ maxWidth: 560, textAlign: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 14, padding: '50px 40px', boxShadow: '0 4px 30px rgba(0,0,0,0.08)' }}>
              <CheckCircle size={60} color="#28A745" style={{ marginBottom: 20 }} />
              <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1B3D7A', marginBottom: 12 }}>Thank You! 🙏</h2>
              <p style={{ fontSize: 15, color: '#555', marginBottom: 10 }}>
                Your donation of <strong style={{ color: '#CC2229' }}>₹{finalAmount.toLocaleString()}</strong> has been received.
              </p>
              <p style={{ fontSize: 14, color: '#666', marginBottom: 28 }}>
                A receipt will be sent to <strong>{success.donorEmail}</strong>. Check your <a href="/dashboard" style={{ color: '#CC2229' }}>dashboard</a> for receipt download.
              </p>
              <div style={{ background: '#F7F8FA', borderRadius: 10, padding: '16px', marginBottom: 28, fontSize: 13, color: '#555', lineHeight: 1.9, textAlign: 'left' }}>
                <div><strong>Program:</strong> {success.programName}</div>
                <div><strong>Amount:</strong> ₹{finalAmount.toLocaleString()}</div>
                <div><strong>Donor:</strong> {success.donorName}</div>
                <div><strong>Receipt No.:</strong> {success.receiptNumber || 'Processing...'}</div>
              </div>
              {poster && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 13, color: '#555', marginBottom: 8 }}>Share your contribution:</p>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a href={`https://wa.me/?text=${encodeURIComponent(`I just donated ₹${finalAmount} to ${program}! Join me: https://ngotrust.org`)}`}
                      target="_blank" rel="noreferrer"
                      style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 7, padding: '8px 16px', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                      Share on WhatsApp
                    </a>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-blue" onClick={() => { setSuccess(null); setStep(1) }}>Donate Again</button>
                <a href="/dashboard" className="btn btn-red">View Dashboard</a>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }

  const inp = { width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginTop: 4 }

  return (
    <>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      <PageBanner title="Make a Donation" subtitle="Your generosity fuels our mission to transform lives." breadcrumbs={[{ label: 'Donate' }]} />
      <section style={{ padding: '60px 0', background: '#F7F8FA' }}>
        <div className="container" style={{ maxWidth: 700 }}>
          {/* Step indicator */}
          <div style={{ display: 'flex', marginBottom: 32, background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            {[{ n: 1, label: 'Select Program' }, { n: 2, label: 'Donor Details' }, { n: 3, label: 'Payment' }].map(s => (
              <div key={s.n} style={{ flex: 1, padding: '14px', textAlign: 'center', background: step === s.n ? '#1B3D7A' : step > s.n ? '#E8F0FE' : '#fff', transition: 'background .3s' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: step >= s.n ? (step === s.n ? '#CC2229' : '#1B3D7A') : '#ddd', color: '#fff', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px' }}>{s.n}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: step === s.n ? '#fff' : step > s.n ? '#1B3D7A' : '#999' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: '32px 28px', boxShadow: '0 2px 14px rgba(0,0,0,0.06)' }}>
            {/* Step 1: Choose program + amount */}
            {step === 1 && (
              <div>
                <h3 style={{ fontWeight: 800, color: '#1B3D7A', marginBottom: 20, fontSize: 18 }}>Choose a Cause</h3>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#444', marginBottom: 6 }}>Select Program</label>
                <select style={inp} value={program} onChange={e => {
                  setProgram(e.target.value)
                  const found = programs.find(p => p.title === e.target.value)
                  setProgramId(found?._id || '')
                }}>
                  {programs.length > 0 ? programs.map(p => (
                    <option key={p._id} value={p.title}>{p.title}</option>
                  )) : <option value="General Fund">General Fund (Where Most Needed)</option>}
                </select>

                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#444', marginTop: 20, marginBottom: 8 }}>Select Donation Amount</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
                  {PRESET_AMOUNTS.map(a => (
                    <button key={a} onClick={() => { setAmount(a); setCustom('') }} style={{
                      padding: '12px', border: `2px solid ${amount === a && !custom ? '#1B3D7A' : '#ddd'}`,
                      borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer',
                      background: amount === a && !custom ? '#1B3D7A' : '#fff',
                      color: amount === a && !custom ? '#fff' : '#333',
                    }}>₹{a.toLocaleString()}</button>
                  ))}
                </div>
                <input style={{ ...inp, fontWeight: 700 }} type="number" placeholder="Or enter custom amount (₹)" value={custom}
                  onChange={e => setCustom(e.target.value)} min="1" />

                <button onClick={() => { if (finalAmount < 1) return toast.error('Please select or enter an amount.'); setStep(2) }}
                  className="btn btn-red" style={{ width: '100%', marginTop: 24, padding: '12px' }}>
                  Continue — ₹{finalAmount > 0 ? finalAmount.toLocaleString() : '—'}
                </button>
              </div>
            )}

            {/* Step 2: Donor details */}
            {step === 2 && (
              <form onSubmit={e => { e.preventDefault(); setStep(3) }}>
                <h3 style={{ fontWeight: 800, color: '#1B3D7A', marginBottom: 20, fontSize: 18 }}>Your Information</h3>
                {[
                  { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'As per your ID' },
                  { label: 'Email Address *', key: 'email', type: 'email', placeholder: 'Receipt will be sent here' },
                  { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+91 XXXXX XXXXX' },
                  { label: 'Message (optional)', key: 'message', type: 'text', placeholder: 'A note of encouragement...' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#444', marginBottom: 4 }}>{f.label}</label>
                    <input style={inp} type={f.type} placeholder={f.placeholder} value={donor[f.key]}
                      onChange={e => setDonor(d => ({ ...d, [f.key]: e.target.value }))}
                      required={f.label.includes('*')} />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                  <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '12px', background: '#fff', border: '2px solid #ddd', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Back</button>
                  <button type="submit" className="btn btn-red" style={{ flex: 2, padding: '12px' }}>Proceed to Payment</button>
                </div>
              </form>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <form onSubmit={handlePay}>
                <h3 style={{ fontWeight: 800, color: '#1B3D7A', marginBottom: 20, fontSize: 18 }}>Confirm Payment</h3>
                <div style={{ background: '#F7F8FA', borderRadius: 10, padding: '18px', marginBottom: 22, fontSize: 14, lineHeight: 1.9 }}>
                  <div><strong>Program:</strong> {program}</div>
                  <div><strong>Donor:</strong> {donor.name}</div>
                  <div><strong>Email:</strong> {donor.email}</div>
                  <div style={{ fontWeight: 800, color: '#CC2229', fontSize: 18, marginTop: 8 }}>Total: ₹{finalAmount.toLocaleString()}</div>
                </div>
                {!isAuthenticated && (
                  <div style={{ background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: 8, padding: '12px 14px', marginBottom: 14, fontSize: 13, color: '#856404' }}>
                    <strong>Note:</strong> Please <span onClick={() => setShowLogin(true)} style={{ color: '#CC2229', cursor: 'pointer', fontWeight: 700 }}>login or register</span> to complete your donation and receive a receipt.
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13, color: '#555' }}>
                  <Lock size={14} color="#28A745" /> 100% Secure · SSL Encrypted · Powered by Razorpay
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" onClick={() => setStep(2)} style={{ flex: 1, padding: '12px', background: '#fff', border: '2px solid #ddd', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Back</button>
                  <button type="submit" className="btn btn-red" style={{ flex: 2, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} disabled={paying}>
                    <Heart size={16} /> {paying ? 'Processing...' : `Donate ₹${finalAmount.toLocaleString()}`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
