import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const navStyle = {
    background: scrolled
      ? 'rgba(14, 12, 10, 0.92)'
      : 'transparent',
    backdropFilter: scrolled ? 'blur(16px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(201,168,108,0.15)' : '1px solid transparent',
    boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
  }

  return (
    <header>
      <nav className="navbar" style={navStyle}>
        <div className="container">
          <Link to="/" className="logo" onClick={closeMenu}>
            <h1>JJ's</h1>
            <p className="tagline">S A L O N</p>
          </Link>

          <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <li><NavLink to="/" end className={({ isActive }) => isActive && location.hash === '' ? 'active' : ''} onClick={closeMenu}>Home</NavLink></li>
            <li><NavLink to="/services" onClick={closeMenu}>Services</NavLink></li>
            <li><NavLink to="/gallery" end onClick={closeMenu}>Our Workplace</NavLink></li>
            <li><NavLink to="/work" end onClick={closeMenu}>Our Work</NavLink></li>
            <li><NavLink to="/location" onClick={closeMenu}>Location</NavLink></li>
            <li><NavLink to="/contact" end onClick={closeMenu}>Contact</NavLink></li>
          </ul>

          <div
            className={`menu-toggle ${menuOpen ? 'active' : ''}`}
            id="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>
    </header>
  )
}
