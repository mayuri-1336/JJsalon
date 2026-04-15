import { Link } from 'react-router-dom'

const MARQUEE_ITEMS = Array(8).fill(
  ['Premium Beauty', 'Hair Styling', 'Bridal Makeup', 'Skin Care', 'Nail Art', 'JJ Salon Pune']
).flat()

export default function PageBanner({ title, subtitle, crumb }) {
  return (
    <section className="page-banner">
      <div className="page-banner-content">
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{crumb || title}</span>
        </nav>
      </div>

      {/* Marquee strip */}
      <div className="marquee-strip">
        <div className="marquee-inner">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
