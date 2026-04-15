import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import PageBanner from '../components/PageBanner'
import { saveAppointment } from '../services/supabase'
import { sendAppointmentEmail } from '../services/emailjs'
import { enqueueAppointment, flushQueue, getQueueLength, getQueue } from '../services/appointmentQueue'
import { showNotification } from '../components/Notification'

const SERVICES_LIST = [
  'Hair Styling', 'Hair Treatment', 'Skin Care',
  'Makeup Services', 'Nail Services', 'Waxing & Threading',
]

const EMPTY_FORM = { name: '', email: '', phone: '', date: '', service: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [queuedCount, setQueuedCount] = useState(0)

  const [selectedDate, setSelectedDate] = useState(null)
  const today = new Date()

  useEffect(() => {
    document.title = "Contact & Book - JJ's Salon"
    try { setQueuedCount(getQueueLength()) } catch (e) { /* ignore */ }
  }, [])

  function handleDateChange(date) {
    setSelectedDate(date)
    const iso = date ? date.toISOString().split('T')[0] : ''
    setForm((prev) => ({ ...prev, date: iso }))
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.name || !form.email || !form.phone || !form.date || !form.service) {
      showNotification('Please fill in all required fields.', 'error')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      showNotification('Please enter a valid email address.', 'error')
      return
    }

    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(form.phone.replace(/\s/g, ''))) {
      showNotification('Please enter a valid 10-digit phone number.', 'error')
      return
    }

    setLoading(true)
    try {
      // 1. Save to Supabase (log for diagnostics)
      console.debug('Saving appointment to Supabase', { name: form.name, email: form.email, phone: form.phone, date: form.date, service: form.service })
      const result = await saveAppointment({
        name: form.name,
        email: form.email,
        phone: form.phone,
        date: form.date,
        service: form.service,
        message: form.message,
        status: 'pending',
      })

      console.debug('Supabase save result', result)
      if (!result.success) {
        // Save to local queue for retry
        enqueueAppointment({
          name: form.name,
          email: form.email,
          phone: form.phone,
          date: form.date,
          service: form.service,
          message: form.message,
          status: 'pending',
        })
        showNotification('Appointment saved locally and will be retried when network is available.', 'success')
        setForm(EMPTY_FORM)
        setSelectedDate(null)
        return
      }

      // 2. Send email notification to salon owner via Web3Forms (hidden form submit)
      console.debug('Sending appointment email via Web3Forms')
      const emailResult = await sendAppointmentEmail({
        name: form.name,
        email: form.email,
        phone: form.phone,
        date: form.date,
        service: form.service,
        message: form.message,
      })

      console.debug('Email send result', emailResult)
      if (!emailResult || emailResult.success === false) {
        // enqueue an email-only retry so owner notification will be attempted later
        enqueueAppointment({
          name: form.name,
          email: form.email,
          phone: form.phone,
          date: form.date,
          service: form.service,
          message: form.message,
          __emailOnly: true,
        })
        showNotification('Appointment saved but owner notification failed; will retry automatically.', 'success')
        setForm(EMPTY_FORM)
        setSelectedDate(null)
        return
      }

      const formattedDate = new Date(form.date).toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })

      showNotification(
        `<strong>Appointment Booked!</strong><br>Thank you, ${form.name}!<br><br>` +
        `<strong>Service:</strong> ${form.service}<br>` +
        `<strong>Date:</strong> ${formattedDate}<br><br>` +
        `We will contact you at <strong>${form.email}</strong> to confirm.`,
        'success'
      )
      setForm(EMPTY_FORM)
      setSelectedDate(null)
    } catch (err) {
      console.error('Booking flow error', err)
      showNotification(
        `Booking failed: ${err?.message || 'Please try again or call us directly.'}`,
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <PageBanner
        title="Contact & Book"
        subtitle="Reach out to us or book your appointment directly online"
        crumb="Contact"
      />

      {/* Booking Form */}
      <section id="contact" className="contact">
        <div className="container">
          <p className="section-label" style={{ justifyContent: 'center' }}>Appointments</p>
          <h2 className="section-title">Book a Session</h2>
          <div className="contact-form-container">
            <div className="contact-intro">
              <h3>Ready for a transformation?</h3>
              <p>Fill out the form and we'll confirm your booking within 24 hours. Walk-ins also welcome during working hours.</p>
              <div>
                <div className="contact-feat-item"><i className="fas fa-check-circle"></i> Same-day confirmation</div>
                <div className="contact-feat-item"><i className="fas fa-check-circle"></i> Flexible scheduling</div>
                <div className="contact-feat-item"><i className="fas fa-check-circle"></i> All services available</div>
                <div className="contact-feat-item"><i className="fas fa-check-circle"></i> Open 7 days a week</div>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="appointment-date">Preferred Date *</label>
                  <DatePicker
                    id="appointment-date"
                    selected={selectedDate}
                    onChange={handleDateChange}
                    minDate={today}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select a date"
                    required
                    autoComplete="off"
                    className="datepicker-input"
                    calendarClassName="jj-calendar"
                    showPopperArrow={false}
                    isClearable
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="service">Service Required *</label>
                <select
                  id="service"
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a service</option>
                  {SERVICES_LIST.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="message">Additional Notes</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Any specific requirements or questions?"
                ></textarea>
              </div>
              <button type="submit" className="btn-primary submit-btn" disabled={loading}>
                {loading ? 'Booking...' : 'Book Appointment'}
              </button>
            </form>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ color: '#B8A899' }}>Queued appointments: <strong style={{ color: '#fff' }}>{queuedCount}</strong></div>
              <button className="btn-outline" onClick={async () => {
                try {
                  setLoading(true)
                  const res = await flushQueue()
                  setQueuedCount(getQueueLength())
                  showNotification(`Retry executed. Flushed: ${res?.flushed || 0}`, 'success')
                } catch (err) {
                  showNotification(`Retry failed: ${err?.message || err}`, 'error')
                } finally { setLoading(false) }
              }}>Retry queued appointments</button>
              <button className="btn-outline" onClick={() => {
                try {
                  const q = getQueue()
                  const blob = new Blob([JSON.stringify(q, null, 2)], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `appointments-queue-${Date.now()}.json`
                  document.body.appendChild(a)
                  a.click()
                  a.remove()
                  URL.revokeObjectURL(url)
                  showNotification('Downloaded queued appointments JSON.', 'success')
                } catch (err) {
                  showNotification(`Export failed: ${err?.message || err}`, 'error')
                }
              }}>Download queued appointments</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
