import { useState, useEffect } from 'react'

let _showNotification = null

export function showNotification(message, type = 'success') {
  if (_showNotification) _showNotification(message, type)
}

export default function Notification() {
  const [notif, setNotif] = useState(null)

  useEffect(() => {
    _showNotification = (message, type) => {
      setNotif({ message, type })
      setTimeout(() => setNotif(null), 5000)
    }
    return () => { _showNotification = null }
  }, [])

  if (!notif) return null

  const icon =
    notif.type === 'success' ? 'fa-check-circle' :
    notif.type === 'error'   ? 'fa-exclamation-circle' :
    'fa-info-circle'

  return (
    <div className={`custom-notification ${notif.type} show`}>
      <i className={`fas ${icon}`}></i>
      <div
        className="notification-content"
        dangerouslySetInnerHTML={{ __html: notif.message }}
      />
      <button className="notification-close" onClick={() => setNotif(null)}>
        <i className="fas fa-times"></i>
      </button>
    </div>
  )
}
