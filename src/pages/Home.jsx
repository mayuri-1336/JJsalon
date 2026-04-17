import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const MARQUEE_ITEMS = Array(8).fill(
  ['Premium Beauty', 'Hair Styling', 'Bridal Makeup', 'Skin Care', 'Nail Art', 'JJ Salon Pune']
).flat()

export default function Home() {
  useEffect(() => {
    document.title = "JJ's Salon - Premium Hair & Beauty Services"
  }, [])

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="hero">
        <div className="marquee-strip" style={{ top: '72px', bottom: 'auto', zIndex: 10 }}>
          <div className="marquee-inner">
            {MARQUEE_ITEMS.map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </div>
        <div className="container hero-inner">
          {/* Left: text */}
          <div className="hero-text">
            <p className="hero-eyebrow">Pune's Premium Beauty Studio</p>
            <h1 className="hero-title">
              <em>Luxury</em>
              <strong>Beauty.</strong>
            </h1>
            <p className="hero-subtitle">
              ✨ Enhancing your natural beauty with expert care, premium products, and a touch of luxury.
            </p>
            <div className="hero-actions">
              <Link to="/contact" className="btn-primary">Book Appointment</Link>
              <Link to="/services" className="btn-outline">Our Services</Link>
            </div>
          </div>

          {/* Right: image panel */}
          <div className="hero-visual">
            <div className="hero-img-wrap">
              <img src="\images\salon.jpeg" alt="JJ's Salon" />
              <div className="hero-badge">
                <span>50+</span>
                services offered
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="hero-stats">
          {[
            { num: '500+', label: 'Happy Clients', i: 0 },
            { num: '1',   label: 'Years Active',  i: 1 },
            { num: '250+',  label: '5-Star Reviews', i: 2 },
            { num: '50+',    label: 'Services',       i: 3 },
          ].map(s => (
            <div key={s.label} className="hero-stat" style={{ '--i': s.i }}>
              <div className="hero-stat-num">{s.num}</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────── */}
      <section id="about" className="about">
        <div className="container">
          <div className="about-layout">
            {/* Image side */}
            <div className="about-image-side">
              <div className="about-img-stack">
                <img src="/images/jj%20salon%20ad.jpeg" alt="JJ Salon interior" />
              </div>
            </div>

            {/* Text side */}
            <div className="about-text-side">
              <p className="section-label">Our Story</p>
              <h2 className="section-title" style={{ textAlign: 'left' }}>
                About JJ Salon
              </h2>

              <p>
                Janhvi Jana, the founder and creative force behind our salon, is known for a refined approach to beauty and style. With extensive experience and a keen eye for detail, she specializes in creating sophisticated, customized looks that reflect each client’s personality. Passionate about excellence, Janhvi Jana is committed to offering a luxurious and unforgettable salon experience.
              </p>
              <p>
                Janhvi Jana's philosophy is simple: every person deserves to feel confident and beautiful. Her dedication to continuous learning and staying ahead of beauty trends ensures that JJ Salon remains at the forefront of the industry.
              </p>

              {/* Owner card */}
              <div className="owner-card">
                <img
                  src="/images/jj%20salon%20ad.jpeg"
                  alt="Janhvi Jana"
                  className="owner-card-img"
                />
                <div className="owner-card-info">
                  <h3>Janhvi Jana</h3>
                  <p className="owner-role">Founder &amp; Master Stylist</p>
                  <p>
                    Janhvi founded JJ Salon
                    with a vision to create a space where artistry meets expertise.
                  </p>
                </div>
              </div>

              {/* Stat pills */}
              <div className="stat-pills">
                {[
                  { icon: 'fa-users',  num: '500+', label: 'Clients' },
                  { icon: 'fa-star',   num: '250+',  label: '5-Star Reviews' },
                ].map(s => (
                  <div key={s.label} className="stat-pill">
                    <i className={`fas ${s.icon}`}></i>
                    <div>
                      <div className="stat-pill-num">{s.num}</div>
                      <div className="stat-pill-label">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
