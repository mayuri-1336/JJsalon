import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  loadAppointments, updateAppointmentStatus, deleteAppointment
} from '../services/supabase'

// ── helpers ──────────────────────────────────────────────────────────────────
function lsGet(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}
function lsSet(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

// ── sub-components ────────────────────────────────────────────────────────────
function Dashboard({ totalAppts, totalGallery, totalWorkplace }) {
  const cards = [
    { icon: 'fa-calendar-check', label: 'Appointments',    value: totalAppts },
    { icon: 'fa-images',         label: 'Our Work',        value: totalGallery },
    { icon: 'fa-building',       label: 'Workplace',       value: totalWorkplace },
    { icon: 'fa-photo-video',    label: 'Total Media',     value: totalGallery + totalWorkplace },
  ]
  return (
    <div>
      <h2 style={{ color: '#8B7355', marginBottom: '1.5rem' }}>
        <i className="fas fa-tachometer-alt" style={{ marginRight: '0.5rem' }}></i> Dashboard Overview
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {cards.map((c) => (
          <div key={c.label} style={{ background: 'linear-gradient(135deg, #B8936E, #9D7A5A)', color: '#F5E6D3', padding: '2rem', borderRadius: '10px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            <i className={`fas ${c.icon}`} style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block' }}></i>
            <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#F5E6D3' }}>{c.value}</h3>
            <p style={{ margin: 0, opacity: 0.9, color: '#F5E6D3' }}>{c.label}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '10px', boxShadow: '0 3px 10px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#8B7355', marginBottom: '1rem' }}>
          <i className="fas fa-info-circle" style={{ marginRight: '0.5rem' }}></i> Quick Guide
        </h3>
        <ul style={{ color: '#9D7A5A', lineHeight: 2, paddingLeft: '1.5rem', margin: 0 }}>
          <li><strong>Appointments:</strong> View and manage all appointment booking requests</li>
          <li><strong>Our Work:</strong> Upload photos to showcase your salon work and services</li>
          <li><strong>Workplace:</strong> Upload photos of your salon interior</li>
          <li><strong>File Support:</strong> Images (JPG, PNG, GIF, WEBP)</li>
          <li><strong>Storage:</strong> All media is uploaded to Supabase Storage and data saved to Supabase DB</li>
          <li><strong>Tip:</strong> Add descriptive titles and descriptions for better presentation</li>
        </ul>
      </div>
    </div>
  )
}

function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAppts() }, [])

  async function fetchAppts() {
    setLoading(true)
    try {
      const res = await loadAppointments()
      if (res.success) setAppointments(res.data)
    } finally { setLoading(false) }
  }

  async function handleStatus(id, status) {
    await updateAppointmentStatus(id, status)
    fetchAppts()
  }
  async function handleDelete(id) {
    if (!window.confirm('Delete this appointment?')) return
    await deleteAppointment(id)
    fetchAppts()
  }

  const counts = {
    all: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
  }
  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter)

  const statusBg = { pending: '#fcf8e3', confirmed: '#dff0d8', completed: '#d9edf7', cancelled: '#f2dede' }
  const statusTxt = { pending: '#8a6d3b', confirmed: '#3c763d', completed: '#31708f', cancelled: '#a94442' }
  const borderColor = { pending: '#f0ad4e', confirmed: '#5cb85c', completed: '#5bc0de', cancelled: '#d9534f' }

  return (
    <div>
      <h2 style={{ color: '#8B7355', marginBottom: '1.5rem' }}>
        <i className="fas fa-calendar-check" style={{ marginRight: '0.5rem' }}></i> Appointment Bookings
      </h2>

      <div style={{ background: 'linear-gradient(135deg, rgba(92,184,92,0.1), rgba(79,174,79,0.1))', borderLeft: '4px solid #5cb85c', padding: '1rem', marginBottom: '2rem', borderRadius: '8px' }}>
        <i className="fas fa-info-circle" style={{ color: '#5cb85c', marginRight: '0.5rem' }}></i>
        <strong style={{ color: '#3c763d' }}>All appointment requests from your website will appear here!</strong>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ color: '#8B7355', margin: 0 }}>
          <i className="fas fa-list" style={{ marginRight: '0.5rem' }}></i> All Appointments
        </h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={fetchAppts} style={{ background: '#5cb85c', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
            <i className="fas fa-sync-alt" style={{ marginRight: '0.4rem' }}></i> Refresh
          </button>
          {['all', 'pending', 'confirmed', 'completed'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '8px 15px', background: filter === f ? 'linear-gradient(135deg, #B8936E, #9D7A5A)' : '#F5E6D3', color: filter === f ? '#F5E6D3' : '#8B7355', border: `2px solid ${filter === f ? '#9D7A5A' : '#E8D5C4'}`, borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'capitalize' }}>
              {f} ({counts[f]})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#666' }}>Loading appointments…</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9D7A5A' }}>
          <i className="fas fa-calendar-times" style={{ fontSize: '4rem', color: '#D4AF7A', marginBottom: '1rem', display: 'block' }}></i>
          <p>No appointments found.</p>
        </div>
      ) : (
        filtered.map((a) => (
          <div key={a.id} style={{ background: '#FFFFFF', borderRadius: '10px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 3px 10px rgba(0,0,0,0.1)', borderLeft: `5px solid ${borderColor[a.status] || '#B8936E'}`, transition: 'all 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '2px solid #F5E6D3', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h4 style={{ color: '#8B7355', margin: 0, fontSize: '1.3rem' }}>{a.name}</h4>
              <span style={{ padding: '5px 15px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', background: statusBg[a.status] || '#eee', color: statusTxt[a.status] || '#666' }}>
                {a.status}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#6B5744' }}>
                <i className="fas fa-envelope" style={{ color: '#B8936E', width: '20px' }}></i>
                <span>{a.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#6B5744' }}>
                <i className="fas fa-phone" style={{ color: '#B8936E', width: '20px' }}></i>
                <span>{a.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#6B5744' }}>
                <i className="fas fa-calendar" style={{ color: '#B8936E', width: '20px' }}></i>
                <span>{a.date}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#6B5744' }}>
                <i className="fas fa-scissors" style={{ color: '#B8936E', width: '20px' }}></i>
                <span>{a.service}</span>
              </div>
            </div>
            {a.message && (
              <div style={{ background: '#FBF3E8', padding: '1rem', borderRadius: '8px', margin: '1rem 0', color: '#6B5744', fontStyle: 'italic' }}>
                "{a.message}"
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {a.status === 'pending' && (
                <button onClick={() => handleStatus(a.id, 'confirmed')} style={{ padding: '8px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', background: '#5cb85c', color: 'white', fontSize: '0.9rem' }}>
                  <i className="fas fa-check" style={{ marginRight: '0.4rem' }}></i> Confirm
                </button>
              )}
              {a.status === 'confirmed' && (
                <button onClick={() => handleStatus(a.id, 'completed')} style={{ padding: '8px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', background: '#5bc0de', color: 'white', fontSize: '0.9rem' }}>
                  <i className="fas fa-check-double" style={{ marginRight: '0.4rem' }}></i> Complete
                </button>
              )}
              <button onClick={() => handleDelete(a.id)} style={{ padding: '8px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', background: '#d9534f', color: 'white', fontSize: '0.9rem' }}>
                <i className="fas fa-trash" style={{ marginRight: '0.4rem' }}></i> Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function LocalGalleryManager({ storageKey, title, icon }) {
  const [items, setItems] = useState([])
  const [formState, setFormState] = useState({ title: '', description: '' })
  const [preview, setPreview] = useState(null)
  
  useEffect(() => {
    setItems(lsGet(storageKey))
  }, [storageKey])

  function handleFormChange(e) { setFormState(p => ({ ...p, [e.target.name]: e.target.value })) }

  function handleFile(e) {
    const f = e.target.files[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target.result)
    reader.readAsDataURL(f)
  }

  function handleAdd(e) {
    e.preventDefault()
    if (!preview) return
    
    const newItem = {
      id: Date.now().toString(),
      title: formState.title,
      description: formState.description,
      file_url: preview,
      created_at: new Date().toISOString()
    }
    
    const newItems = [newItem, ...items]
    lsSet(storageKey, newItems)
    setItems(newItems)
    
    setFormState({ title: '', description: '' })
    setPreview(null)
    e.target.reset()
  }

  function handleDelete(id) {
    if (!window.confirm('Delete this photo?')) return
    const newItems = items.filter(i => i.id !== id)
    lsSet(storageKey, newItems)
    setItems(newItems)
  }

  return (
    <div>
      <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '10px', marginBottom: '2rem', border: '2px dashed #B8936E' }}>
        <h3 style={{ color: '#8B7355', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className={`fas ${icon}`} style={{ color: '#B8936E' }}></i> Upload New {title} Photo
        </h3>
        
        <form onSubmit={handleAdd}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#8B7355', fontWeight: 'bold', marginBottom: '0.5rem' }}>Title</label>
            <input type="text" name="title" value={formState.title} onChange={handleFormChange} placeholder="e.g., Professional Haircut"
              style={{ width: '100%', padding: '12px', border: '2px solid #E8D5C4', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#8B7355', fontWeight: 'bold', marginBottom: '0.5rem' }}>Upload Image *</label>
            <input type="file" accept="image/*" onChange={handleFile} required
              style={{ width: '100%', padding: '12px', border: '2px dashed #B8936E', borderRadius: '8px', background: '#F5E6D3', boxSizing: 'border-box', cursor: 'pointer' }} />
            {preview && (
              <div style={{ marginTop: '1rem' }}>
                <img src={preview} alt="Preview" style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #B8936E' }} />
              </div>
            )}
          </div>
          <button type="submit" style={{ background: 'linear-gradient(135deg, #B8936E, #9D7A5A)', color: '#F5E6D3', padding: '12px 30px', border: 'none', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
            <i className="fas fa-plus-circle" style={{ marginRight: '0.5rem' }}></i> Add to {title}
          </button>
        </form>
      </div>

      <div>
        <h3 style={{ color: '#8B7355', marginBottom: '1rem' }}>
          <i className="fas fa-layer-group" style={{ marginRight: '0.5rem' }}></i> Current {title} Photos
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {items.map((item) => (
            <div key={item.id} style={{ background: '#FFFFFF', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 3px 10px rgba(0,0,0,0.1)' }}>
              <img src={item.file_url} alt={item.title || ''} style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '1rem' }}>
                {item.title && <h4 style={{ color: '#8B7355', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{item.title}</h4>}
                <button onClick={() => handleDelete(item.id)} style={{ background: '#d9534f', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  <i className="fas fa-trash" style={{ marginRight: '0.4rem' }}></i> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {items.length === 0 && <p style={{ color: '#9D7A5A', textAlign: 'center', padding: '3rem' }}>No photos yet.</p>}
      </div>
    </div>
  )
}

// ── Main Admin Page ────────────────────────────────────────────────────────────
const TABS = [
  { id: 'dashboard',        label: 'Dashboard',       icon: 'fa-chart-line' },
  { id: 'appointments',     label: 'Appointments',    icon: 'fa-calendar-check' },
  { id: 'our_work',         label: 'Our Work',        icon: 'fa-images' },
  { id: 'workplace',        label: 'Workplace',       icon: 'fa-building' },
]

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const navigate = useNavigate()

  const [totalAppts, setTotalAppts] = useState(0)
  const [totalGallery, setTotalGallery] = useState(lsGet('jj_salon_work_photos').length)
  const [totalWorkplace, setTotalWorkplace] = useState(lsGet('jj_salon_workplace_photos').length)
  useEffect(() => {
    document.title = "Admin Panel - JJ's Salon"
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
      navigate('/login', { replace: true })
      return
    }
    refreshStats()
  }, [navigate])

  async function refreshStats() {
    loadAppointments().then((res) => { if (res.success) setTotalAppts(res.data.length) })
    setTotalGallery(lsGet('jj_salon_work_photos').length)
    setTotalWorkplace(lsGet('jj_salon_workplace_photos').length)
  }

  function handleLogout() {
    localStorage.removeItem('adminLoggedIn')
    navigate('/login', { replace: true })
  }

  return (
    <main>
      <div style={{ maxWidth: '1400px', margin: '100px auto 50px', padding: '20px' }}>

        {/* Admin Header */}
        <div style={{ background: 'linear-gradient(135deg, #B8936E, #9D7A5A)', color: '#F5E6D3', padding: '2rem', borderRadius: '15px', marginBottom: '2rem', boxShadow: '0 5px 20px rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: '#F5E6D3' }}>
              <i className="fas fa-crown" style={{ marginRight: '0.5rem' }}></i> Welcome to JJ Salon Admin Panel
            </h1>
            <p style={{ margin: 0, opacity: 0.9 }}>Manage your gallery, transformations, and website content easily</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/" target="_blank" style={{ background: 'linear-gradient(135deg, #5cb85c, #449d44)', color: 'white', padding: '10px 25px', borderRadius: '25px', textDecoration: 'none', fontWeight: 'bold' }}>
              <i className="fas fa-external-link-alt" style={{ marginRight: '0.4rem' }}></i> View Website
            </Link>
            <button onClick={handleLogout} style={{ background: 'linear-gradient(135deg, #d9534f, #c9302c)', color: 'white', padding: '10px 25px', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>
              <i className="fas fa-sign-out-alt" style={{ marginRight: '0.4rem' }}></i> Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); if (tab.id === 'dashboard') refreshStats() }}
              style={{
                padding: '12px 30px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', border: '2px solid transparent', transition: 'all 0.3s ease',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #B8936E, #9D7A5A)' : 'linear-gradient(135deg, #F5E6D3, #E8D5C4)',
                color: activeTab === tab.id ? '#F5E6D3' : '#8B7355',
                borderColor: activeTab === tab.id ? '#9D7A5A' : 'transparent',
              }}>
              <i className={`fas ${tab.icon}`} style={{ marginRight: '0.5rem' }}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ background: 'linear-gradient(135deg, #FFFFFF, #FBF3E8)', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
          {activeTab === 'dashboard' && (
            <Dashboard
              totalAppts={totalAppts}
              totalGallery={totalGallery}
              totalWorkplace={totalWorkplace}
            />
          )}
          {activeTab === 'appointments'    && <Appointments />}
          {activeTab === 'our_work'        && <LocalGalleryManager storageKey="jj_salon_work_photos" title="Our Work" icon="fa-images" />}
          {activeTab === 'workplace'       && <LocalGalleryManager storageKey="jj_salon_workplace_photos" title="Workplace" icon="fa-building" />}
        </div>

      </div>
    </main>
  )
}
