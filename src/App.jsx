import { useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Notification from './components/Notification'
import Home from './pages/Home'
import Services from './pages/Services'
import Gallery from './pages/Gallery'
import Work from './pages/Work'
import Contact from './pages/Contact'
import Location from './pages/Location'
import Login from './pages/Login'
import Admin from './pages/Admin'

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname === '/admin' || location.pathname === '/login'

  const prevPathname = useRef(location.pathname)

  // Fade-in on page navigation (not on same-page hash changes)
  useEffect(() => {
    if (location.pathname !== prevPathname.current) {
      prevPathname.current = location.pathname
      document.body.style.opacity = '0'
      const t = setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease'
        document.body.style.opacity = '1'
      }, 50)
      return () => clearTimeout(t)
    }
  }, [location])

  // Scroll to hash section after navigation
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1)
      const tryScroll = (attempts = 0) => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        } else if (attempts < 10) {
          setTimeout(() => tryScroll(attempts + 1), 80)
        }
      }
      setTimeout(() => tryScroll(), 80)
    }
  }, [location])

  // Initialize appointment retry queue
  useEffect(() => {
    import('./services/appointmentQueue').then((mod) => {
      try { mod.initAppointmentQueue({ intervalMs: 60000 }) } catch (e) { console.error(e) }
    })
  }, [])

  return (
    <>
      {!isAdmin && <Navbar />}
      <Notification />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/work" element={<Work />} />
        <Route path="/location" element={<Location />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      {!isAdmin && <Footer />}
    </>
  )
}
