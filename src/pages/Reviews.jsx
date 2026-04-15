import { useState, useEffect } from 'react'
import PageBanner from '../components/PageBanner'
import { loadReviews } from '../services/supabase'

const STATIC_REVIEWS = [
  { name: 'Sarah Johnson',    role: 'Regular Client',          rating: 5, text: 'Absolutely love JJ Salon! The staff is incredibly talented and the atmosphere is so welcoming. My hair has never looked better!' },
  { name: 'Emily Rodriguez',  role: 'Bride',                   rating: 5, text: 'Had my bridal makeup done here and it was absolutely perfect. The team understood exactly what I wanted and exceeded my expectations.' },
  { name: 'Michael Chen',     role: 'First-time Client',       rating: 5, text: 'I was nervous coming to a new salon but the team made me feel so comfortable. The haircut was exactly what I wanted. Will definitely be back!' },
  { name: 'Amanda Williams',  role: 'Regular Client',          rating: 5, text: 'The skin care treatments here are amazing! My skin has improved dramatically. The facials are relaxing and incredibly effective.' },
  { name: 'Jessica Martinez', role: 'Loyal Client',            rating: 5, text: 'I have been coming to JJ Salon for years and have never been disappointed. The team always goes above and beyond.' },
  { name: 'Lisa Thompson',    role: 'Special Occasion Client', rating: 5, text: 'Got my hair and makeup done for a special event and received so many compliments. The stylists here are true artists!' },
]

function Stars({ rating }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} className={`fas fa-star${i > rating ? ' empty' : ''}`}></i>
      ))}
    </div>
  )
}

export default function Reviews() {
  const [adminReviews, setAdminReviews] = useState([])

  useEffect(() => {
    document.title = "Reviews - JJ's Salon"
    loadReviews().then((res) => { if (res.success) setAdminReviews(res.data) })
  }, [])

  const allReviews = [...adminReviews, ...STATIC_REVIEWS]

  return (
    <main>
      <PageBanner
        title="Client Reviews"
        subtitle="What our valued clients say about their JJ Salon experience"
        crumb="Reviews"
      />

      <section className="reviews">
        <div className="container">
          <p className="section-label" style={{ justifyContent: 'center' }}>Testimonials</p>
          <h2 className="section-title">Loved by Clients</h2>
          <p className="section-subtitle">Real experiences from real people — unfiltered and genuine.</p>

          <div className="reviews-grid">
            {allReviews.map((review, i) => (
              <div key={i} className="review-card">
                <Stars rating={review.rating} />
                <p className="review-text">"{review.text}"</p>
                <div className="reviewer-info">
                  <div className="reviewer-avatar">{review.name.charAt(0)}</div>
                  <div className="reviewer-details">
                    <h4>{review.name}</h4>
                    <p>{review.role}</p>
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
