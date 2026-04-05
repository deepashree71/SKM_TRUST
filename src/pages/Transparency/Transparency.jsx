import { useState } from 'react'
import PageBanner from '../../components/common/PageBanner'
import SectionHeading from '../../components/common/SectionHeading'
import { FileText, Download, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

const documents = [
  { id: 1, title: 'Annual Report 2024-25', type: 'Annual Report', year: '2025', size: '2.4 MB', date: 'March 2025' },
  { id: 2, title: 'Annual Report 2023-24', type: 'Annual Report', year: '2024', size: '2.1 MB', date: 'March 2024' },
  { id: 3, title: 'Audited Financial Statement 2024-25', type: 'Financial', year: '2025', size: '1.8 MB', date: 'April 2025' },
  { id: 4, title: 'Audited Financial Statement 2023-24', type: 'Financial', year: '2024', size: '1.6 MB', date: 'April 2024' },
  { id: 5, title: '12A Registration Certificate', type: 'Legal', year: '2023', size: '0.5 MB', date: 'June 2023' },
  { id: 6, title: '80G Tax Exemption Certificate', type: 'Legal', year: '2023', size: '0.4 MB', date: 'June 2023' },
  { id: 7, title: 'Trust Registration Deed', type: 'Legal', year: '2020', size: '1.2 MB', date: 'Jan 2020' },
  { id: 8, title: 'NITI Aayog NGO Darpan Certificate', type: 'Legal', year: '2022', size: '0.3 MB', date: 'Aug 2022' },
  { id: 9, title: 'Impact Assessment Report 2024', type: 'Impact', year: '2024', size: '3.2 MB', date: 'Dec 2024' },
  { id: 10, title: 'CSR Utilization Report Q1 2025', type: 'CSR', year: '2025', size: '0.9 MB', date: 'Jan 2025' },
]

const docTypes = ['All', 'Annual Report', 'Financial', 'Legal', 'Impact', 'CSR']
const docColors = { 'Annual Report': '#1B3D7A', 'Financial': '#28A745', 'Legal': '#CC2229', 'Impact': '#f5a623', 'CSR': '#6c5ce7' }

export default function Transparency() {
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'All' ? documents : documents.filter(d => d.type === filter)

  const handleDownload = (doc) => {
    toast.success(`Downloading: ${doc.title}`)
  }

  return (
    <>
      <PageBanner title="Transparency Documents" subtitle="We believe in full transparency. All our documents are publicly accessible." breadcrumbs={[{ label: 'Transparency' }]} />

      <section style={{ padding: '60px 0', background: '#F7F8FA' }}>
        <div className="container">
          <SectionHeading title="Public Documents" subtitle="Our financial statements, legal registrations, and impact reports — open to all." />

          {/* Filters */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 36 }}>
            {docTypes.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                style={{
                  padding: '7px 18px', borderRadius: 20, border: '1px solid #1B3D7A',
                  background: filter === t ? '#1B3D7A' : '#fff',
                  color: filter === t ? '#fff' : '#1B3D7A',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                }}>
                {t}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(doc => (
              <div key={doc.id} style={{
                background: '#fff', borderRadius: 10, padding: '18px 22px',
                border: '1px solid #e8ecf4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex', alignItems: 'center', gap: 16,
                transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor='#1B3D7A'; e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.08)' }}
              onMouseOut={e => { e.currentTarget.style.borderColor='#e8ecf4'; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 8,
                  background: `${docColors[doc.type] || '#1B3D7A'}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <FileText size={22} color={docColors[doc.type] || '#1B3D7A'} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#1B3D7A', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.title}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{doc.date} · {doc.size}</div>
                </div>
                <span style={{
                  fontSize: 11, padding: '4px 12px', borderRadius: 20, fontWeight: 600,
                  background: `${docColors[doc.type] || '#1B3D7A'}18`,
                  color: docColors[doc.type] || '#1B3D7A',
                  border: `1px solid ${docColors[doc.type] || '#1B3D7A'}33`,
                  whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                  {doc.type}
                </span>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => toast.success('Opening document...')}
                    style={{ width: 36, height: 36, borderRadius: 6, border: '1px solid #e8ecf4', background: '#F7F8FA', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Eye size={16} color="#666" />
                  </button>
                  <button onClick={() => handleDownload(doc)} className="btn btn-blue"
                    style={{ padding: '7px 14px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Download size={13} /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
