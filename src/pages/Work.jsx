import { useState, useEffect } from 'react'
import { loadTransformations } from '../services/supabase'

const GALLERY_IMAGES = Array.from({ length: 19 }, (_, i) => `/images/work-${i + 1}.jpeg`)



export default function Work() {
  const [dynamicWork, setDynamicWork] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    document.title = "Our Work - JJ's Salon"
    try {
      const stored = JSON.parse(localStorage.getItem('jj_salon_work_photos') || '[]')
      setDynamicWork(stored)
    } catch { setDynamicWork([]) }
  }, [])

  return (
    <main>


      <section className="transformations">
        <div className="container">
          <p className="section-label" style={{ justifyContent: 'center' }}>Portfolio</p>
          <h2 className="section-title">Our Work</h2>
          <p className="section-subtitle">Witness the magic - expert treatments that speak for themselves.</p>
          <div className="transformations-grid">
            {dynamicWork.map((item) => (
              <div key={item.id} className="transformation-card">
                <div className="transformation-images" style={{ display: 'block' }}>
                  <img src={item.file_url} alt={item.title || 'Work'} style={{ width: '100%', height: '300px', objectFit: 'cover', cursor: 'pointer' }} className="clickable-image" onClick={() => setSelectedImage(item.file_url)} />
                </div>
                <div className="transformation-info">
                  <h4>{item.title || 'Client Style'}</h4>
                  <p>{item.description || 'Beautiful results from our recent session.'}</p>
                  <span className="transformation-category">Latest Work</span>
                </div>
              </div>
            ))}
            {GALLERY_IMAGES.map((src, i) => (
              <div key={`gallery-img-${i}`} className="transformation-card">
                <div className="transformation-images" style={{ display: 'block' }}>
                  <img src={src} alt={`Work ${i + 1}`} style={{ width: '100%', height: '300px', objectFit: 'cover', cursor: 'pointer' }} className="clickable-image" onClick={() => setSelectedImage(src)} />
                </div>
                <div className="transformation-info">
                  <h4>Client Style</h4>
                  <p>Beautiful results from our recent session.</p>
                  <span className="transformation-category">Gallery</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedImage && (
        <div className="image-modal-overlay" onClick={() => setSelectedImage(null)}>
          <span className="image-modal-close" onClick={() => setSelectedImage(null)}>&times;</span>
          <img src={selectedImage} alt="Fullscreen Work" className="image-modal-content" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </main>
  )
}
