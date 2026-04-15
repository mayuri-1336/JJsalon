import { useEffect, useRef } from 'react'

/**
 * Attaches an IntersectionObserver that animates elements into view.
 * Pass a CSS selector string — every matching element inside the component
 * will fade + slide up when it enters the viewport.
 *
 * Usage:
 *   const ref = useScrollReveal('.service-card, .review-card, .stat-item')
 *   return <div ref={ref}>...</div>
 */
export function useScrollReveal(selector = '.service-card, .review-card, .stat-item, .info-item, .gallery-item, .transformation-card') {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const elements = container.querySelectorAll(selector)
    elements.forEach((el) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(30px)'
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1'
            entry.target.style.transform = 'translateY(0)'
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [selector])

  return containerRef
}
