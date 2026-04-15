import { useState, useEffect } from 'react'
import { loadTransformations } from '../services/supabase'

const STATIC_TRANSFORMATIONS = [
  { title: 'Hair Color Transformation', description: 'Stunning balayage that adds dimension and warmth', category: 'Color' },
  { title: 'Haircut Makeover', description: 'Fresh cut that perfectly frames the face', category: 'Cut' },
  { title: 'Texture Treatment', description: 'Smooth and silky results with keratin treatment', category: 'Treatment' },
  { title: 'Complete Makeover', description: 'Full hair and makeup transformation for a special event', category: 'Style' },
]

const MARQUEE_ITEMS = Array(8).fill(
  ['Premium Beauty', 'Hair Styling', 'Bridal Makeup', 'Skin Care', 'Nail Art', 'JJ Salon Pune']
).flat()

export default function Work() {
  const [adminTransformations, setAdminTransformations] = useState([])

  useEffect(() => {
    document.title = "Our Work - JJ's Salon"
    loadTransformations().then((res) => { if (res.success) setAdminTransformations(res.data) })
  }, [])

  return (
    <main>
      <div className="marquee-strip" style={{ marginTop: '60px' }}>
        <div className="marquee-inner">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>

      <section className="transformations">
        <div className="container">
          <p className="section-label" style={{ justifyContent: 'center' }}>Portfolio</p>
          <h2 className="section-title">Our Work</h2>
          <p className="section-subtitle">Witness the magic - expert treatments that speak for themselves.</p>
          <div className="transformations-grid">
            {adminTransformations.map((item) => (
              <div key={item.id} className="transformation-card">
                <div className="transformation-images">
                  <div className="transformation-before">
                    <img src={item.before_url} alt="Before" />
                    <span className="label">Before</span>
                  </div>
                  <div className="transformation-after">
                    <img src={item.after_url} alt="After" />
                    <span className="label">After</span>
                  </div>
                </div>
                <div className="transformation-info">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <span className="transformation-category">{item.category}</span>
                </div>
              </div>
            ))}
            {STATIC_TRANSFORMATIONS.map((item, i) => (
              <div key={`static-t-${i}`} className="transformation-card">
                <div className="transformation-images">
                  <div className="transformation-before">
                    <img src={`https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=250&fit=crop&sat=-100&q=${60 + i}`} alt="Before" />
                    <span className="label">Before</span>
                  </div>
                  <div className="transformation-after">
                    <img src={`https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=250&fit=crop&q=${60 + i}`} alt="After" />
                    <span className="label">After</span>
                  </div>
                </div>
                <div className="transformation-info">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <span className="transformation-category">{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
