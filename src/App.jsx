import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import ScrollProgress from './components/ScrollProgress'
import HeroSection from './sections/HeroSection'
import IntroductionSection from './sections/IntroductionSection'
import CompositionSection from './sections/CompositionSection'
import EvidenceSection from './sections/EvidenceSection'
import CosmicWebSection from './sections/CosmicWebSection'
import CandidatesSection from './sections/CandidatesSection'
import MysteriesSection from './sections/MysteriesSection'
import Footer from './components/Footer'

function App() {
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'hero',
        'introduction',
        'composition',
        'evidence',
        'cosmic-web',
        'candidates',
        'mysteries',
      ]
      const scrollPos = window.scrollY + 250

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="dark-matter-app" style={{ position: 'relative', width: '100%', minHeight: '100vh', background: 'var(--bg-deep)' }}>
      <ScrollProgress />
      <Navbar activeSection={activeSection} />
      <main>
        <HeroSection />
        <IntroductionSection />
        <CompositionSection />
        <EvidenceSection />
        <CosmicWebSection />
        <CandidatesSection />
        <MysteriesSection />
      </main>
      <Footer />
    </div>
  )
}

export default App
