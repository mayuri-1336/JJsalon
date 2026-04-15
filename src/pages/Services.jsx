import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageBanner from '../components/PageBanner'

const SERVICES = [
  {
    icon: 'fa-tint',
    title: 'Hair Wash',
    description: 'Professional hair wash with premium shampoos.',
    items: ['Matrix Hair wash - ₹180/₹200', 'L\'Oréal Hair wash - ₹270/₹300'],
    featured: true,
    tag: 'Essentials',
  },
  {
    icon: 'fa-cut',
    title: 'Haircut',
    description: 'Expert cuts tailored to your style and hair length.',
    items: [
      'Bangs / Fringes - ₹90/₹100',
      'Trim - ₹180/₹200',
      'Kids Haircut - ₹270/₹300',
      'Any Haircut - ₹270/₹300',
      'Haircut with Matrix shampoo - ₹360/₹400',
      'Haircut with L\'Oréal shampoo wash - ₹450/₹500',
    ],
  },
  {
    icon: 'fa-wind',
    title: 'Blow Dry',
    description: 'Professional blow-dry styling services.',
    items: [
      'Blow dry - ₹225/₹250',
      'Blow dry with Matrix Hair wash - ₹315/₹350',
      'Blow dry with L\'Oréal Hair wash - ₹405/₹450',
    ],
  },
  {
    icon: 'fa-magic',
    title: 'Hair Styling',
    description: 'Professional ironing and tong styling for all hair lengths.',
    items: [
      'Ironing (Short Hair) - ₹180/₹200',
      'Tong (Short Hair) - ₹180/₹200',
      'Ironing (Shoulder Length) - ₹270/₹300',
      'Tong (Shoulder Length) - ₹270/₹300',
      'Ironing (Upper Midback Length) - ₹360/₹400',
      'Tong (Upper Midback Length) - ₹360/₹400',
      'Ironing (Midback Length) - ₹450/₹500',
      'Tong (Midback Length) - ₹450/₹500',
      'Ironing (Upper Waist Length) - ₹540/₹600',
      'Tong (Upper Waist Length) - ₹540/₹600',
      'Ironing (Waist length) - ₹630/₹700',
      'Tong (Waist Length) - ₹630/₹700',
      'Ironing (Below Waist Length) - ₹720/₹800',
      'Tong (Below Waist Length) - ₹720/₹800',
    ],
  },
  {
    icon: 'fa-spa',
    title: 'Hair Spa',
    description: 'Luxurious spa treatments with premium brands.',
    items: [
      'L\'Oréal Hair Spa - Short hair - ₹540/₹600',
      'L\'Oréal Hair Spa - Shoulder Length - ₹720/₹800',
      'L\'Oréal Hair Spa - Upper Midback - ₹900/₹1000',
      'L\'Oréal Hair Spa - Midback - ₹1080/₹1200',
      'L\'Oréal Hair Spa - Upper Waist - ₹1260/₹1400',
      'L\'Oréal Hair Spa - Waist Length - ₹1440/₹1600',
      'L\'Oréal Hair Spa - Lower Waist - ₹1620/₹1800',
      'Premium Hair Spa (Biotop) - Short Hair - ₹900/₹1000',
      'Premium Hair Spa (Biotop) - Shoulder Length - ₹1080/₹1200',
      'Premium Hair Spa (Biotop) - Upper Midback - ₹1260/₹1400',
      'Premium Hair Spa (Biotop) - Midback - ₹1440/₹1600',
      'Premium Hair Spa (Biotop) - Upper Waist - ₹1620/₹1800',
      'Premium Hair Spa (Biotop) - Waist Length - ₹1800/₹2000',
      'Premium Hair Spa (Biotop) - Lower Waist - ₹1980/₹2200',
    ],
  },
  {
    icon: 'fa-droplet',
    title: 'Hair Colour',
    description: 'Professional hair colouring with premium products.',
    items: [
      'Global Hair Colour (Oreal) - Short Length - ₹1080/₹1200',
      'Global Hair Colour (Oreal) - Shoulder Length - ₹1440/₹1600',
      'Global Hair Colour (Oreal) - Upper Midback - ₹1800/₹2000',
      'Global Hair Colour (Oreal) - Midback - ₹2160/₹2400',
      'Global Hair Colour (Oreal) - Upper Waist - ₹2520/₹2800',
      'Global Hair Colour (Oreal) - Waist Length - ₹2880/₹3200',
      'Global Hair Colour (Oreal) - Lower Waist - ₹3240/₹3600',
    ],
  },
  {
    icon: 'fa-stars',
    title: 'Highlights & Prelightening',
    description: 'Transform your look with highlights and color gradients.',
    items: [
      'Global Change with Prelightening - Per Chunk - ₹315/₹350',
      'Crown Portion Highlights (7-8 Streaks) - ₹1800/₹2000',
      'Short Length - ₹1800/₹2000',
      'Shoulder Length - ₹2250/₹2500',
      'Upper Midback Length - ₹2700/₹3000',
      'Midback Length - ₹3150/₹3500',
      'Upper Waist Length - ₹3600/₹4000',
      'Waist Length - ₹4050/₹4500',
      'Highlights - Per Chunk - ₹270/₹300',
      'Crown Portion - ₹1350/₹1500',
      'Short Hair - ₹1080/₹1200',
      'Shoulder Length - ₹1530/₹1700',
      'Upper Midback Length - ₹1980/₹2200',
      'Midback Length - ₹2430/₹2700',
      'Upper Waist Length - ₹2880/₹3200',
      'Waist Length - ₹3330/₹3700',
    ],
  },
  {
    icon: 'fa-swatchbook',
    title: 'Balayage',
    description: 'Hand-painted hair coloring for a natural, dimensional look.',
    items: [
      'Balayage - Short Hair - ₹1800/₹2000',
      'Balayage - Shoulder Length - ₹2250/₹2500',
      'Balayage - Midback Length - ₹2700/₹3000',
      'Balayage - Waist Length - ₹3150/₹3500',
    ],
  },
  {
    icon: 'fa-bolt',
    title: 'Hair Straightening & Smoothening',
    description: 'Advanced treatments for smooth, straight hair.',
    items: [
      'Hair Straightening/Smoothening - Short Hair - ₹1800/₹2000',
      'Hair Straightening/Smoothening - Shoulder Length - ₹2250/₹2500',
      'Hair Straightening/Smoothening - Upper Midback - ₹2700/₹3000',
      'Hair Straightening/Smoothening - Midback - ₹3150/₹3500',
      'Hair Straightening/Smoothening - Above Waist - ₹3600/₹4000',
      'Hair Straightening/Smoothening - Waist Length - ₹4050/₹4500',
      'Hair Straightening/Smoothening - Lower Waist - ₹4900/₹5000',
    ],
  },
  {
    icon: 'fa-heart',
    title: 'Hair Protein Treatment',
    description: 'Premium protein treatments for strength and shine.',
    items: [
      'Nanoplastia - Short Hair - ₹3600/₹4000',
      'Nanoplastia - Shoulder Length - ₹4050/₹4500',
      'Nanoplastia - Upper Midback - ₹4500/₹5000',
      'Nanoplastia - Midback - ₹4950/₹5500',
      'Nanoplastia - Above Waist - ₹5400/₹6000',
      'Nanoplastia - Waist Length - ₹5850/₹6500',
      'Nanoplastia - Lower Waist - ₹6300/₹7000',
    ],
  },
  {
    icon: 'fa-palette',
    title: 'Colour Application',
    description: 'Professional application of your chosen hair colour.',
    items: [
      'Colour Application with Client\'s Product - ₹360/₹400',
    ],
  },
  {
    icon: 'fa-hand-sparkles',
    title: 'Mehendi Application',
    description: 'Beautiful mehendi designs for hair beautification.',
    items: [
      'Mehendi Application - Short Hair - ₹180/₹200',
      'Mehendi Application - Shoulder Length - ₹270/₹300',
      'Mehendi Application - Upper Midback - ₹360/₹400',
      'Mehendi Application - Midback - ₹450/₹500',
      'Mehendi Application - Upper Waist - ₹540/₹600',
      'Mehendi Application - Waist Length - ₹630/₹700',
      'Mehendi Application - Upper Waist Length - ₹720/₹800',
    ],
  },
  {
    icon: 'fa-spa',
    title: 'Facial',
    description: 'Luxurious facials to rejuvenate and protect your skin with professional-grade products.',
    tag: 'Glow Up',
    items: [
      'Herbal Facial (VLCC) - ₹540/₹600',
      'Richfeel Whitening Facial - ₹990/₹1200',
      'Gold Facial (24 Carat Shehnaz) - ₹1260/₹1400',
      'O3+ Whitening with single mask - ₹1530/₹1700',
      'O3+ Seaweed with single mask - ₹1530/₹1700',
      'O3+ Whitening with double mask - ₹1800/₹2000',
      'O3+ Seaweed with double mask - ₹1800/₹2000',
      'Hydra Facial - ₹2520/₹2800',
      'Glass Glow Facial - ₹2520/₹2800',
    ],
  },
  {
    icon: 'fa-seedling',
    title: 'Clean-up',
    description: 'Quick and effective clean-up treatments to brighten and refresh your complexion.',
    items: [
      'Herbal Clean up - ₹360/₹400',
      'O3+ Clean up - ₹540/₹600',
    ],
  },
  {
    icon: 'fa-droplet',
    title: 'De-tan',
    description: 'Remove tan and rejuvenate your skin with our de-tan treatments.',
    items: [
      'De-tan (face & neck) - ₹270/₹300',
      'O3+ Peel of mask - ₹360/₹400',
    ],
  },
  {
    icon: 'fa-tint',
    title: 'Bleach',
    description: 'Gentle skin brightening bleach treatments for face and body areas.',
    items: [
      'Oxy Bleach (Face) - ₹315/₹300',
      'Herbal Bleach (Face) - ₹225/₹250',
      'Herbal Bleach (Underarms) - ₹180/₹200',
      'Herbal Bleach (Half back) - ₹180/₹200',
      'Herbal Bleach (face, neck, half back) - ₹360/₹400',
      'Herbal Bleach (Full hands) - ₹360/₹400',
      'Herbal Bleach (Half legs) - ₹360/₹400',
      'Herbal Bleach (Full back) - ₹360/₹400',
      'Herbal Bleach (Stomach & chest) - ₹360/₹400',
      'Herbal Bleach (Full legs) - ₹450/₹500',
      'Full Body Bleach - ₹1350/₹1500',
    ],
  },
  {
    icon: 'fa-leaf',
    title: 'Threading',
    description: 'Precisely shaped brows and smooth skin with expert threading techniques.',
    items: [
      'Eyebrows - ₹36/₹40',
      'Upper Lips - ₹18/₹20',
      'Jawline - ₹18/₹20',
      'Chin - ₹18/₹20',
      'Forehead - ₹18/₹20',
      'Sidelocks - ₹18/₹20',
      'Lower Lip - ₹18/₹20',
      'Full Face - ₹135/₹150',
    ],
  },
  {
    icon: 'fa-feather-alt',
    title: 'Waxing - Honey Wax',
    description: 'Silky smooth skin with honey wax for various body areas.',
    items: [
      'Nose - ₹18/₹20',
      'Chin - ₹36/₹40',
      'Sidelocks - ₹72/₹80',
      'Underarms - ₹90/₹100',
      'Full Face - ₹135/₹150',
      'Half Back - ₹180/₹200',
      'Full Hands - ₹180/₹200',
      'Half Legs - ₹225/₹250',
      'Full Back - ₹315/₹350',
      'Stomach & Chest - ₹315/₹350',
      'Full Legs - ₹360/₹400',
      'Full Body - ₹1350/₹1500',
    ],
  },
  {
    icon: 'fa-feather-alt',
    title: 'Waxing - Liposoluble / 2G Wax',
    description: 'Premium liposoluble wax for longer-lasting smoothness.',
    items: [
      'Full Hands - ₹270/₹300',
      'Half Legs - ₹270/₹300',
      'Stomach & Chest - ₹360/₹400',
      'Full Legs - ₹540/₹600',
      'Full Body - ₹1800/₹2000',
    ],
  },
  {
    icon: 'fa-fire',
    title: 'Brazilian / 3G Wax',
    description: 'Long-lasting smoothness with premium Brazilian and 3G waxing for sensitive areas.',
    tag: 'Premium',
    items: [
      'Nose - ₹90/₹100',
      'Chin - ₹90/₹100',
      'Forehead - ₹90/₹100',
      'Upper Lips - ₹90/₹100',
      'Sidelocks - ₹135/₹150',
      'Underarms - ₹180/₹200',
      'Full Face - ₹315/₹350',
      'Bikini Wax - ₹720/₹800',
    ],
  },
  {
    icon: 'fa-hand-sparkles',
    title: 'Manicure',
    description: 'Complete nail care for hands — relaxing, cleansing, and beautifying.',
    items: [
      'Regular Manicure - ₹360/₹400',
      'Deluxe Manicure - ₹540/₹600',
    ],
  },
  {
    icon: 'fa-hands',
    title: 'Pedicure',
    description: 'Complete nail care for feet — relaxing, cleansing, and beautifying.',
    items: [
      'Regular Pedicure - ₹450/₹500',
      'Deluxe Pedicure - ₹630/₹700',
    ],
  },
  {
    icon: 'fa-hands',
    title: 'Head Massage',
    description: 'Relaxing head massage with aromatic essential oils for mind relaxation.',
    items: [
      'Aroma Essential Oil Head Massage - ₹360/₹400',
    ],
  },
  {
    icon: 'fa-hands',
    title: 'Body Massage',
    description: 'Targeted body massage with aromatic essential oils for complete rejuvenation.',
    items: [
      'Foot Massage - ₹180/₹200',
      'Hand Massage - ₹180/₹200',
      'Half Leg Massage - ₹270/₹300',
      'Stomach & Chest Massage - ₹360/₹400',
      'Back Massage - ₹360/₹400',
      'Full Leg Massage - ₹450/₹500',
      'Full Body Massage - ₹1080/₹1200',
    ],
  },
  {
    icon: 'fa-gem',
    title: 'Polishing',
    description: 'Exfoliating body polishing treatments for radiant, glowing, and smooth skin.',
    items: [
      'Half Leg Polishing - ₹360/₹400',
      'Stomach & Chest Polishing - ₹450/₹500',
      'Back Polishing - ₹450/₹500',
      'Hand Polishing - ₹450/₹500',
      'Leg Polishing - ₹720/₹800',
      'Full Body Polishing - ₹2250/₹2500',
    ],
  },
  {
    icon: 'fa-star',
    title: 'Make-up & Hairstyle',
    description: 'Event-ready makeup and hairstyle services with member and non-member pricing.',
    items: [
      'Any Hairstyle - ₹270/₹300',
      'Saree Draping - ₹270/₹300',
      'Only Makeup - ₹900/₹1000',
      'Sider Makeup - ₹1350/₹1500',
      'Party Makeup - ₹1350/₹1500',
      'Photoshoot Makeup - ₹1350/₹1500',
      'Bridal Makeup - ₹4500/₹5000',
      'Add-on: On Location Travel Fee - ₹270/₹300',
    ],
    tag: 'Bridal',
  },
]

export default function Services() {
  useEffect(() => {
    document.title = "Our Services - JJ's Salon"
  }, [])

  // Categorize services into three main sections
  const hairServices = SERVICES.filter(s => ['Hair Wash', 'Haircut', 'Blow Dry', 'Hair Styling', 'Hair Spa', 'Hair Colour', 'Highlights & Prelightening', 'Balayage', 'Hair Straightening & Smoothening', 'Hair Protein Treatment', 'Colour Application', 'Mehendi Application'].includes(s.title))
  const beautyTreatments = SERVICES.filter(s => ['Facial', 'Clean-up', 'De-tan', 'Bleach', 'Threading', 'Waxing - Honey Wax', 'Waxing - Liposoluble / 2G Wax', 'Brazilian / 3G Wax', 'Head Massage', 'Body Massage', 'Polishing'].includes(s.title))
  const makeupNailServices = SERVICES.filter(s => ['Make-up & Hairstyle', 'Manicure', 'Pedicure'].includes(s.title))

  const ServiceCard = ({ service }) => (
    <div key={service.title} className="bento-card">
      {service.tag && <span className="bento-tag">{service.tag}</span>}
      <div className="bento-icon">
        <i className={`fas ${service.icon}`}></i>
      </div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <div className="service-price" style={{ fontSize: '0.85rem' }}>
        {service.items.map(item => {
          const [name, prices] = item.split(' - ')
          const [memberPrice, nonMemberPrice] = prices.split('/')
          return (
            <div key={item} className="price-item" style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '8px', alignItems: 'center', paddingBottom: '6px', borderBottom: '1px solid rgba(201,168,108,0.1)' }}>
              <span style={{ fontSize: '0.9rem' }}>{name}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: '500' }}>M: {memberPrice}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>{nonMemberPrice}</span>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <main>
      <PageBanner
        title="Our Services"
        subtitle="Premium beauty treatments tailored to you"
        crumb="Services"
      />

      <section className="services">
        <div className="container">
          <p className="section-label" style={{ justifyContent: 'center' }}>What We Offer</p>
          <h2 className="section-title">Crafted for You</h2>
          <p className="section-subtitle">Each service designed with care, using the finest products and techniques.</p>
          <p className="section-subtitle" style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.75 }}>
            <i className="fas fa-tag" style={{ marginRight: '6px' }}></i>
            Prices shown as <strong>Member / Non-member</strong>. <strong>Members enjoy exclusive rates</strong> on all services.
          </p>

          {/* Hair Services Section */}
          <div style={{ marginTop: '3rem', marginBottom: '2rem' }}>
            <h3 className="section-subtitle" style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--gold)' }}>
              <i className="fas fa-cut" style={{ marginRight: '10px' }}></i>Hair Services
            </h3>
            <div className="bento-grid">
              {hairServices.map(service => (
                <ServiceCard key={service.title} service={service} />
              ))}
            </div>
          </div>

          {/* Beauty Treatments Section */}
          <div style={{ marginTop: '3rem', marginBottom: '2rem' }}>
            <h3 className="section-subtitle" style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--gold)' }}>
              <i className="fas fa-spa" style={{ marginRight: '10px' }}></i>Beauty Treatments
            </h3>
            <div className="bento-grid">
              {beautyTreatments.map(service => (
                <ServiceCard key={service.title} service={service} />
              ))}
            </div>
          </div>

          {/* Makeup & Nail Services Section */}
          <div style={{ marginTop: '3rem', marginBottom: '2rem' }}>
            <h3 className="section-subtitle" style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--gold)' }}>
              <i className="fas fa-star" style={{ marginRight: '10px' }}></i>Makeup & Nail Services
            </h3>
            <div className="bento-grid">
              {makeupNailServices.map(service => (
                <ServiceCard key={service.title} service={service} />
              ))}
            </div>
          </div>

          <div className="services-cta">
            <p>Ready to experience premium beauty care?</p>
            <Link to="/contact" className="btn-primary">Book an Appointment</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
