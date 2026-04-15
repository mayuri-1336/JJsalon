import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          {/* Brand */}
          <div className="footer-section">
            <Link to="/" className="logo" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>
              <h1>JJ's</h1>
              <p className="tagline" style={{ alignSelf: 'flex-end', paddingBottom: '4px', marginLeft: '4px' }}>S A L O N</p>
            </Link>
            <p>Your destination for luxury beauty in Pune. Premium services in a welcoming, artisan environment.</p>
            <div className="social-links">
              <a
                href="https://www.instagram.com/jjsalon.15?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3>Navigate</h3>
            <ul>
              <li><a href="/#about">About Us</a></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/gallery">Our Workplace</Link></li>
              <li><Link to="/work">Our Work</Link></li>
              <li><Link to="/location">Location</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h3>Services</h3>
            <ul>
              <li><Link to="/services">Hair Styling</Link></li>
              <li><Link to="/services">Hair Treatment</Link></li>
              <li><Link to="/services">Skin Care</Link></li>
              <li><Link to="/services">Bridal Makeup</Link></li>
              <li><Link to="/services">Nail Services</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h3>Contact</h3>
            <ul>
              <li>
                <i className="fas fa-phone"></i>
                <a href="tel:9657311509">9657311509</a>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <a href="mailto:jjsalon.15@gmail.com">jjsalon.15@gmail.com</a>
              </li>
              <li>
                <i className="fas fa-map-marker-alt"></i>
                Shop no.5, Suncity Ambegaon, near Bhumkar Petrol pump, Pune 411046
              </li>
              <li>
                <i className="fas fa-clock"></i>
                Mon – Sun: 10 AM – 9 PM
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {year} JJ Salon. All rights reserved.</p>
          <Link
            to="/login"
            style={{ color: 'var(--text-3)', textDecoration: 'none', fontSize: '0.75rem', transition: 'color 0.3s' }}
            onMouseOver={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseOut={e => (e.currentTarget.style.color = 'var(--text-3)')}
          >
            <i className="fas fa-lock"></i> Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
