const LOCAL_WORKPLACE_IMAGES = [
  { name: 'salon.jpeg', alt: 'Salon interior' },
  { name: 'WhatsApp Image 2026-04-13 at 7.58.25 PM (1).jpeg', alt: 'Workplace photo' },
  { name: 'WhatsApp Image 2026-04-13 at 7.58.26 PM.jpeg', alt: 'Workplace photo' },
  { name: 'WhatsApp Image 2026-04-13 at 7.58.26 PM (1).jpeg', alt: 'Workplace photo' },
  { name: 'WhatsApp Image 2026-04-13 at 7.58.26 PM (2).jpeg', alt: 'Workplace photo' },
  { name: 'WhatsApp Image 2026-04-13 at 7.58.27 PM.jpeg', alt: 'Workplace photo' },
  { name: 'WhatsApp Image 2026-04-13 at 7.58.27 PM (1).jpeg', alt: 'Workplace photo' },
  { name: 'WhatsApp Image 2026-04-13 at 7.58.27 PM (2).jpeg', alt: 'Workplace photo' },
]

export default function Gallery() {
  return (
    <main>
      {/* Gallery Grid */}
      <section className="gallery">
        <div className="container">
          <p className="section-label" style={{ justifyContent: 'center' }}>Our Space</p>
          <h2 className="section-title">Our Workplace</h2>
          <p className="section-subtitle">A glimpse into the artistry we bring to every client.</p>
          <div className="gallery-mosaic">
            {LOCAL_WORKPLACE_IMAGES.map((item, i) => (
              <div key={`local-g-${i}`} className="gallery-item">
                <a href={`/images/${encodeURIComponent(item.name)}`} target="_blank" rel="noopener noreferrer">
                  <img src={`/images/${encodeURIComponent(item.name)}`} alt={item.alt} loading="lazy" />
                </a>
                <div className="gallery-overlay">
                  <div className="overlay-content">
                    <i className="fas fa-expand"></i>
                    <p>{item.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
