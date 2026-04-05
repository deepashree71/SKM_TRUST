import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('sr-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  )

  // Observe all eligible elements
  const targets = document.querySelectorAll(
    'section, .card, [class*="card"], [class*="Card"], ' +
    '[class*="section"], [class*="Section"], ' +
    'article, aside, .box, .panel, ' +
    'main > div > div, main > div > section'
  )

  targets.forEach((el) => {
    if (!el.classList.contains('sr-ready') && !el.closest('header') && !el.closest('nav')) {
      el.classList.add('sr-ready')
      observer.observe(el)
    }
  })

  return observer
}

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  useEffect(() => {
    // Small delay to let page render first
    const timer = setTimeout(() => {
      const observer = initScrollReveal()
      return () => observer.disconnect()
    }, 100)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      {/* paddingTop = topbar(36) + brand row(64) + nav(44) = 144px */}
      <main style={{ flex: 1, paddingTop: 144 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
