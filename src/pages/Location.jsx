import { useEffect } from 'react'
import PageBanner from '../components/PageBanner'

export default function Location() {
  useEffect(() => {
    document.title = "Location - JJ's Salon"
  }, [])

  return (
    <main>
      <PageBanner
        title="Our Location"
        subtitle="Visit us in Pune for premium beauty services"
        crumb="Location"
      />

      <section className="location">
        <div className="container">
          <p className="section-label" style={{ justifyContent: 'center' }}>Visit Us</p>
          <h2 className="section-title">Find Us</h2>
          <div className="location-content">
            <div className="location-info">
              <div className="info-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h4>Address</h4>
                  <p>Shop no.5, Suncity Ambegaon,<br />near Bhumkar Petrol pump<br />Pune - 411046</p>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-phone"></i>
                <div>
                  <h4>Phone</h4>
                  <p><a href="tel:9657311509">9657311509</a></p>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <h4>Email</h4>
                  <p><a href="mailto:jjsalon.15@gmail.com">jjsalon.15@gmail.com</a></p>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-clock"></i>
                <div>
                  <h4>Working Hours</h4>
                  <p>Monday - Sunday: 10:00 AM - 9:00 PM</p>
                </div>
              </div>
              <div className="info-item">
                <i className="fab fa-instagram"></i>
                <div>
                  <h4>Instagram</h4>
                  <p>
                    <a href="https://www.instagram.com/jjsalon.15" target="_blank" rel="noopener noreferrer">
                      @jjsalon.15
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.5!2d73.8541!3d18.4564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc295fca687f0c7:0x66c91e646429ff3!2sJJ&#39;s%20Salon!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                width="100%"
                height="400"
                style={{ border: 'none', borderRadius: '12px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="JJ Salon Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
