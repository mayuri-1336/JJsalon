// ─── Web3Forms Configuration ─────────────────────────────────────────────────
// To activate email notifications to jjsalon.15@gmail.com:
// 1. Go to https://web3forms.com
// 2. Enter "jjsalon.15@gmail.com" and click "Create your Access Key"
// 3. Check jjsalon.15@gmail.com inbox for the access key
// 4. Paste the key below replacing YOUR_ACCESS_KEY
//
// That's it! No backend, no credit card, 250 free emails/month.

const ACCESS_KEY = 'f6bd07d8-4af1-473b-a5cb-106b67a9cb67'   // e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

const WEB3FORMS_URL = 'https://api.web3forms.com/submit'

function submitForm(fields) {
  if (typeof document === 'undefined') {
    return Promise.reject(new Error('Document is not available'))
  }

  return new Promise((resolve, reject) => {
    const iframeName = `web3forms-iframe-${Date.now()}`
    const iframe = document.createElement('iframe')
    iframe.name = iframeName
    iframe.style.display = 'none'
    document.body.appendChild(iframe)

    const form = document.createElement('form')
    form.action = WEB3FORMS_URL
    form.method = 'POST'
    form.target = iframeName
    form.style.display = 'none'

    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = name
      input.value = value
      form.appendChild(input)
    })

    document.body.appendChild(form)

    const cleanup = () => {
      form.remove()
      iframe.remove()
    }

    iframe.onload = () => {
      cleanup()
      resolve({ success: true })
    }

    form.submit()

    setTimeout(() => {
      cleanup()
      resolve({ success: true })
    }, 3000)
  })
}

/**
 * Send appointment notification email to jjsalon.15@gmail.com via Web3Forms.
 * Returns { success: true } or { success: false, error: string }
 */
export async function sendAppointmentEmail({ name, email, phone, date, service, message }) {
  if (ACCESS_KEY === 'YOUR_ACCESS_KEY') {
    console.warn('⚠️ Web3Forms not configured – skipping email. See src/services/emailjs.js')
    return { success: true, skipped: true }
  }

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
    : date

  const fields = {
    access_key: ACCESS_KEY,
    subject: `New Appointment Request from ${name}`,
    from_name: name,
    replyto: email,
    message:
      `New Appointment Request\n\n` +
      `Client Details:\n` +
      `  Name:    ${name}\n` +
      `  Email:   ${email}\n` +
      `  Phone:   ${phone}\n\n` +
      `Appointment Details:\n` +
      `  Date:    ${formattedDate}\n` +
      `  Service: ${service}\n\n` +
      `Additional Notes:\n${message || 'None'}\n\n` +
      `Please contact the client to confirm the appointment.`,
  }

  try {
    return await submitForm(fields)
  } catch (err) {
    console.error('❌ Appointment email send failed:', err)
    return { success: false, error: err?.message || 'Email send failed' }
  }
}

/**
 * Send a general contact message to jjsalon.15@gmail.com via Web3Forms.
 * Returns { success: true } or { success: false, error: string }
 */
export async function sendContactEmail({ name, email, phone, subject, message }) {
  if (ACCESS_KEY === 'YOUR_ACCESS_KEY') {
    console.warn('⚠️ Web3Forms not configured – skipping email. See src/services/emailjs.js')
    return { success: true, skipped: true }
  }

  const fields = {
    access_key: ACCESS_KEY,
    subject: subject || `New Contact Message from ${name}`,
    from_name: name,
    replyto: email,
    message:
      `New Contact Message\n\n` +
      `From:    ${name}\n` +
      `Email:   ${email}\n` +
      `Phone:   ${phone || 'Not provided'}\n\n` +
      `Message:\n${message}`,
  }

  try {
    return await submitForm(fields)
  } catch (err) {
    console.error('❌ Contact email send failed:', err)
    return { success: false, error: err?.message || 'Email send failed' }
  }
}
