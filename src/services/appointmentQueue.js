import { saveAppointment } from './supabase'
import { sendAppointmentEmail } from './emailjs'

const QUEUE_KEY = 'jj_appointments_queue'
let retryTimer = null

function readQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.error('Failed to read appointment queue', err)
    return []
  }
}

function writeQueue(q) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q))
  } catch (err) {
    console.error('Failed to write appointment queue', err)
  }
}

export function enqueueAppointment(item) {
  const q = readQueue()
  const record = { id: Date.now() + '-' + Math.random().toString(36).slice(2), created_at: new Date().toISOString(), payload: item }
  q.push(record)
  writeQueue(q)
  console.debug('Enqueued appointment', record)
  return record.id
}

export function getQueue() {
  return readQueue()
}

export function getQueueLength() {
  return readQueue().length
}

export async function flushQueue() {
  const q = readQueue()
  if (!q.length) return { flushed: 0 }

  let flushed = 0
  // attempt sequential flush
  for (const item of q) {
    try {
      // If the payload is marked as email-only, only send the email
      if (item.payload && item.payload.__emailOnly) {
        const emailRes = await sendAppointmentEmail(item.payload)
        if (emailRes && emailRes.success) {
          flushed += 1
          const current = readQueue()
          const remaining = current.filter((r) => r.id !== item.id)
          writeQueue(remaining)
          console.debug('Flushed email-only appointment from queue', item.id)
        } else {
          console.warn('Failed to flush queued email-only appointment', item.id, emailRes)
        }
        continue
      }

      const res = await saveAppointment(item.payload)
      if (res && res.success) {
        // After saving to DB, attempt to send the owner email
        const emailRes = await sendAppointmentEmail(item.payload)
        if (emailRes && emailRes.success) {
          flushed += 1
          // remove from queue
          const current = readQueue()
          const remaining = current.filter((r) => r.id !== item.id)
          writeQueue(remaining)
          console.debug('Flushed appointment from queue (saved + emailed)', item.id)
        } else {
          console.warn('Saved appointment but failed to send email for queued item', item.id, emailRes)
          // keep in queue to retry email later
        }
      } else {
        console.warn('Failed to flush queued appointment (save failed)', item.id, res)
        // keep in queue
      }
    } catch (err) {
      console.error('Error flushing queued appointment', item.id, err)
      // stop trying further to avoid repeated failures
      break
    }
  }

  return { flushed }
}

export function initAppointmentQueue({ intervalMs = 60000 } = {}) {
  if (typeof window === 'undefined' || !window.localStorage) return
  // initial flush
  flushQueue().then((r) => console.debug('Initial appointment queue flush', r))
  // avoid multiple timers
  if (retryTimer) clearInterval(retryTimer)
  retryTimer = setInterval(() => {
    flushQueue().then((r) => {
      if (r.flushed) console.info(`Flushed ${r.flushed} queued appointment(s)`)
    })
  }, intervalMs)
}

export default { enqueueAppointment, flushQueue, initAppointmentQueue }
