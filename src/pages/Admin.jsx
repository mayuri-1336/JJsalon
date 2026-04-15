import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  loadAppointments, updateAppointmentStatus, deleteAppointment,
  uploadFile,
  addGalleryItem, loadGalleryItems, deleteGalleryItem,
  addTransformation, loadTransformations, deleteTransformation,
} from '../services/supabase'

// ── helpers ──────────────────────────────────────────────────────────────────
function lsGet(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}
function lsSet(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

// ── sub-components ────────────────────────────────────────────────────────────
function Dashboard({ totalAppts, totalGallery, totalTransformations }) {
  const totalMedia = totalGallery + totalTransformations * 2
  const cards = [
    { icon: 'fa-calendar-check', label: 'Appointments',    value: totalAppts },
    { icon: 'fa-images',         label: 'Gallery Items',   value: totalGallery },
    { icon: 'fa-magic',          label: 'Transformations', value: totalTransformations },
    { icon: 'fa-photo-video',    label: 'Total Media Files', value: totalMedia },
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
          <li><strong>Gallery Management:</strong> Upload photos and videos to showcase your salon work and services</li>
          <li><strong>Transformations:</strong> Upload before &amp; after photos to show client transformations</li>
          <li><strong>File Support:</strong> Images (JPG, PNG, GIF, WEBP) and Videos (MP4, WEBM)</li>
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

function GalleryManager() {
  const [items, setItems] = useState([])
  const [formState, setFormState] = useState({ title: '', description: '' })
  const [preview, setPreview] = useState(null)
  const [previewType, setPreviewType] = useState('image')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    const res = await loadGalleryItems()
    if (res.success) setItems(res.data)
  }

  function handleFormChange(e) { setFormState((p) => ({ ...p, [e.target.name]: e.target.value })) }

  function handleFile(e) {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreviewType(f.type.startsWith('video/') ? 'video' : 'image')
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(f)
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!file || !formState.title) return
    setUploading(true)
    setUploadError('')
    try {
      const fileUrl = await uploadFile('gallery', file)
      const res = await addGalleryItem({
        title: formState.title,
        description: formState.description,
        file_url: fileUrl,
        file_type: file.type,
      })
      if (!res.success) throw new Error(res.error)
      await fetchItems()
      setFormState({ title: '', description: '' })
      setFile(null)
      setPreview(null)
      e.target.reset()
    } catch (err) {
      setUploadError(err.message || 'Upload failed. Check Supabase storage bucket "gallery" is public.')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this gallery item?')) return
    await deleteGalleryItem(id)
    fetchItems()
  }

  return (
    <div>
      <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '10px', marginBottom: '2rem', border: '2px dashed #B8936E' }}>
        <h3 style={{ color: '#8B7355', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fas fa-cloud-upload-alt" style={{ color: '#B8936E' }}></i> Upload New Gallery Item
        </h3>
        <div style={{ background: '#e7f4e7', borderLeft: '4px solid #5cb85c', padding: '1rem', marginBottom: '1.5rem', borderRadius: '5px' }}>
          <i className="fas fa-info-circle" style={{ color: '#5cb85c', marginRight: '0.5rem' }}></i>
          <strong style={{ color: '#3c763d' }}>Your uploads will be saved to Supabase and appear in the Gallery section!</strong>
        </div>
        {uploadError && (
          <div style={{ background: '#fee', color: '#c33', border: '1px solid #fcc', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
            <i className="fas fa-exclamation-circle" style={{ marginRight: '0.5rem' }}></i>{uploadError}
          </div>
        )}
        <form onSubmit={handleAdd}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#8B7355', fontWeight: 'bold', marginBottom: '0.5rem' }}>Title *</label>
            <input type="text" name="title" value={formState.title} onChange={handleFormChange} placeholder="e.g., Professional Haircut" required
              style={{ width: '100%', padding: '12px', border: '2px solid #E8D5C4', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#8B7355', fontWeight: 'bold', marginBottom: '0.5rem' }}>Description</label>
            <input type="text" name="description" value={formState.description} onChange={handleFormChange} placeholder="Brief description of this work..."
              style={{ width: '100%', padding: '12px', border: '2px solid #E8D5C4', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#8B7355', fontWeight: 'bold', marginBottom: '0.5rem' }}>Upload Image or Video *</label>
            <input type="file" accept="image/*,video/*" onChange={handleFile} required
              style={{ width: '100%', padding: '12px', border: '2px dashed #B8936E', borderRadius: '8px', background: '#F5E6D3', boxSizing: 'border-box', cursor: 'pointer' }} />
            {preview && (
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', width: '150px', height: '150px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #B8936E' }}>
                  {previewType === 'video'
                    ? <video src={preview} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
              </div>
            )}
          </div>
          <button type="submit" disabled={uploading} style={{ background: uploading ? '#ccc' : 'linear-gradient(135deg, #B8936E, #9D7A5A)', color: '#F5E6D3', padding: '12px 30px', border: 'none', borderRadius: '25px', fontWeight: 'bold', cursor: uploading ? 'not-allowed' : 'pointer', fontSize: '1rem' }}>
            <i className={`fas ${uploading ? 'fa-spinner fa-spin' : 'fa-plus-circle'}`} style={{ marginRight: '0.5rem' }}></i>
            {uploading ? 'Uploading…' : 'Add to Gallery'}
          </button>
        </form>
      </div>

      <div>
        <h3 style={{ color: '#8B7355', marginBottom: '1rem' }}>
          <i className="fas fa-layer-group" style={{ marginRight: '0.5rem' }}></i> Current Gallery Items
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {items.map((item) => (
            <div key={item.id} style={{ background: '#FFFFFF', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 3px 10px rgba(0,0,0,0.1)', transition: 'all 0.3s ease' }}>
              {item.file_type && item.file_type.startsWith('video/')
                ? <video src={item.file_url} style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                : <img src={item.file_url} alt={item.title || ''} style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />}
              <div style={{ padding: '1rem' }}>
                <h4 style={{ color: '#8B7355', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{item.title}</h4>
                {item.description && <p style={{ color: '#9D7A5A', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>{item.description}</p>}
                <button onClick={() => handleDelete(item.id)} style={{ background: '#d9534f', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <i className="fas fa-trash" style={{ marginRight: '0.4rem' }}></i> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {items.length === 0 && <p style={{ color: '#9D7A5A', textAlign: 'center', padding: '3rem' }}>No gallery items yet.</p>}
      </div>
    </div>
  )
}

function TransformationsManager() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ title: '', description: '', category: '' })
  const [beforeFile, setBeforeFile] = useState(null)
  const [afterFile, setAfterFile] = useState(null)
  const [beforePreview, setBeforePreview] = useState(null)
  const [afterPreview, setAfterPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    const res = await loadTransformations()
    if (res.success) setItems(res.data)
  }

  function handleFormChange(e) { setForm((p) => ({ ...p, [e.target.name]: e.target.value })) }

  function handleBefore(e) {
    const f = e.target.files[0]; if (!f) return; setBeforeFile(f)
    const r = new FileReader(); r.onload = (ev) => setBeforePreview(ev.target.result); r.readAsDataURL(f)
  }
  function handleAfter(e) {
    const f = e.target.files[0]; if (!f) return; setAfterFile(f)
    const r = new FileReader(); r.onload = (ev) => setAfterPreview(ev.target.result); r.readAsDataURL(f)
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!beforeFile || !afterFile || !form.title) return
    setUploading(true)
    setUploadError('')
    try {
      const [beforeUrl, afterUrl] = await Promise.all([
        uploadFile('transformations', beforeFile),
        uploadFile('transformations', afterFile),
      ])
      const res = await addTransformation({
        title: form.title,
        description: form.description,
        category: form.category,
        before_url: beforeUrl,
        after_url: afterUrl,
      })
      if (!res.success) throw new Error(res.error)
      await fetchItems()
      setForm({ title: '', description: '', category: '' })
      setBeforeFile(null); setAfterFile(null); setBeforePreview(null); setAfterPreview(null)
      e.target.reset()
    } catch (err) {
      setUploadError(err.message || 'Upload failed. Check Supabase storage bucket "transformations" is public.')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this transformation?')) return
    await deleteTransformation(id)
    fetchItems()
  }

  return (
    <div>
      <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '10px', marginBottom: '2rem', border: '2px dashed #B8936E' }}>
        <h3 style={{ color: '#8B7355', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fas fa-magic" style={{ color: '#B8936E' }}></i> Upload New Transformation
        </h3>
        <div style={{ background: '#e7f4e7', borderLeft: '4px solid #5cb85c', padding: '1rem', marginBottom: '1.5rem', borderRadius: '5px' }}>
          <i className="fas fa-info-circle" style={{ color: '#5cb85c', marginRight: '0.5rem' }}></i>
          <strong style={{ color: '#3c763d' }}>Your transformations will be saved to Supabase and appear in the Transformations section!</strong>
        </div>
        {uploadError && (
          <div style={{ background: '#fee', color: '#c33', border: '1px solid #fcc', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
            <i className="fas fa-exclamation-circle" style={{ marginRight: '0.5rem' }}></i>{uploadError}
          </div>
        )}
        <form onSubmit={handleAdd}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#8B7355', fontWeight: 'bold', marginBottom: '0.5rem' }}>Transformation Title *</label>
            <input type="text" name="title" value={form.title} onChange={handleFormChange} placeholder="e.g. Hair Color & Style Transformation" required
              style={{ width: '100%', padding: '12px', border: '2px solid #E8D5C4', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#8B7355', fontWeight: 'bold', marginBottom: '0.5rem' }}>Description *</label>
            <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Describe the transformation..." rows="3" required
              style={{ width: '100%', padding: '12px', border: '2px solid #E8D5C4', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box', resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#8B7355', fontWeight: 'bold', marginBottom: '0.5rem' }}>Before Image *</label>
            <input type="file" accept="image/*" onChange={handleBefore} required
              style={{ width: '100%', padding: '12px', border: '2px dashed #B8936E', borderRadius: '8px', background: '#F5E6D3', boxSizing: 'border-box', cursor: 'pointer' }} />
            {beforePreview && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ position: 'relative', width: '150px', height: '150px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #B8936E' }}>
                  <img src={beforePreview} alt="Before preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            )}
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#8B7355', fontWeight: 'bold', marginBottom: '0.5rem' }}>After Image *</label>
            <input type="file" accept="image/*" onChange={handleAfter} required
              style={{ width: '100%', padding: '12px', border: '2px dashed #B8936E', borderRadius: '8px', background: '#F5E6D3', boxSizing: 'border-box', cursor: 'pointer' }} />
            {afterPreview && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ position: 'relative', width: '150px', height: '150px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #B8936E' }}>
                  <img src={afterPreview} alt="After preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            )}
          </div>
          <button type="submit" disabled={uploading} style={{ background: uploading ? '#ccc' : 'linear-gradient(135deg, #B8936E, #9D7A5A)', color: '#F5E6D3', padding: '12px 30px', border: 'none', borderRadius: '25px', fontWeight: 'bold', cursor: uploading ? 'not-allowed' : 'pointer', fontSize: '1rem' }}>
            <i className={`fas ${uploading ? 'fa-spinner fa-spin' : 'fa-plus-circle'}`} style={{ marginRight: '0.5rem' }}></i>
            {uploading ? 'Uploading…' : 'Add Transformation'}
          </button>
        </form>
      </div>

      <div>
        <h3 style={{ color: '#8B7355', marginBottom: '1rem' }}>
          <i className="fas fa-layer-group" style={{ marginRight: '0.5rem' }}></i> Current Transformations
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {items.map((item) => (
            <div key={item.id} style={{ background: '#FFFFFF', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 3px 10px rgba(0,0,0,0.1)', transition: 'all 0.3s ease', position: 'relative' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <div style={{ position: 'relative' }}>
                  <img src={item.before_url} alt="Before" style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }} />
                  <span style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px' }}>Before</span>
                </div>
                <div style={{ position: 'relative' }}>
                  <img src={item.after_url} alt="After" style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }} />
                  <span style={{ position: 'absolute', bottom: '6px', right: '6px', background: '#B8936E', color: '#fff', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px' }}>After</span>
                </div>
              </div>
              <div style={{ padding: '1rem' }}>
                <h4 style={{ color: '#8B7355', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{item.title}</h4>
                {item.description && <p style={{ color: '#9D7A5A', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>{item.description}</p>}
                {item.category && <span style={{ display: 'inline-block', padding: '2px 10px', background: '#F5E6D3', color: '#B8936E', borderRadius: '12px', fontSize: '0.8rem' }}>{item.category}</span>}
                <div style={{ marginTop: '0.75rem' }}>
                  <button onClick={() => handleDelete(item.id)} style={{ background: '#d9534f', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <i className="fas fa-trash" style={{ marginRight: '0.4rem' }}></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length === 0 && <p style={{ color: '#9D7A5A', textAlign: 'center', padding: '3rem' }}>No transformations yet.</p>}
      </div>
    </div>
  )
}

// ── Main Admin Page ────────────────────────────────────────────────────────────
const TABS = [
  { id: 'dashboard',        label: 'Dashboard',       icon: 'fa-chart-line' },
  { id: 'appointments',     label: 'Appointments',    icon: 'fa-calendar-check' },
  { id: 'gallery',          label: 'Gallery',         icon: 'fa-images' },
  { id: 'transformations',  label: 'Transformations', icon: 'fa-magic' },
]

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const navigate = useNavigate()

  const [totalAppts, setTotalAppts] = useState(0)
  const [totalGallery, setTotalGallery] = useState(0)
  const [totalTransformations, setTotalTransformations] = useState(0)
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
    loadGalleryItems().then((res) => { if (res.success) setTotalGallery(res.data.length) })
    loadTransformations().then((res) => { if (res.success) setTotalTransformations(res.data.length) })
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
              totalTransformations={totalTransformations}
            />
          )}
          {activeTab === 'appointments'    && <Appointments />}
          {activeTab === 'gallery'         && <GalleryManager />}
          {activeTab === 'transformations' && <TransformationsManager />}
        </div>

      </div>
    </main>
  )
}
