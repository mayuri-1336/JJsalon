// Usage: node send-queued.js path/to/appointments.json
// Requires node-fetch v2: `npm install node-fetch@2`
const fs = require('fs')
const fetch = require('node-fetch')

const ACCESS_KEY = 'f6bd07d8-4af1-473b-a5cb-106b67a9cb67'
const FILE = process.argv[2] || 'appointments-queue-1776224534774.json'

function formatDate(d) {
  if (!d) return ''
  try { return new Date(d).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }
  catch (e) { return d }
}

async function sendOne(p) {
  const formattedDate = formatDate(p.date)
  const message = [
    'New Appointment Request',
    '',
    'Client Details:',
    `  Name: ${p.name}`,
    `  Email: ${p.email}`,
    `  Phone: ${p.phone}`,
    '',
    'Appointment Details:',
    `  Date: ${formattedDate}`,
    `  Service: ${p.service}`,
    '',
    'Additional Notes:',
    p.message || 'None',
    '',
    'Please contact the client to confirm the appointment.'
  ].join('\n')

  const params = new URLSearchParams({
    access_key: ACCESS_KEY,
    subject: `Queued Appointment from ${p.name}`,
    from_name: p.name || 'Unknown',
    replyto: p.email || '',
    message
  })

  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: params,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  })

  const text = await res.text()
  return { status: res.status, text }
}

async function main() {
  if (!fs.existsSync(FILE)) { console.error('File not found:', FILE); process.exit(1) }
  const raw = fs.readFileSync(FILE, 'utf8')
  const q = JSON.parse(raw)
  console.log(`Found ${q.length} queued items in ${FILE}`)

  for (const rec of q) {
    const p = rec.payload || {}
    try {
      const r = await sendOne(p)
      console.log(rec.id, r.status, r.text)
    } catch (err) {
      console.error('Error sending', rec.id, err)
    }
  }
}

main().catch(err => { console.error(err); process.exit(1) })
