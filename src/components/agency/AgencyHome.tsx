'use client'

import { Header } from '@/components/layout/Header'
import { HeroSection } from '@/components/agency/HeroSection'
import { ServicesSection } from '@/components/agency/ServicesSection'
import { SectionTransition } from '@/components/ui/section-transition'
import { Footer } from '@/components/ui/footer-section'
import { Stats } from '@/components/ui/stats-section-with-text'
import { ContactSection } from '@/components/agency/ContactSection'

export function AgencyHome() {
  return (
    <div className="min-h-screen bg-black/[0.96] relative w-full overflow-hidden">
      {/* Optimized ambient background lighting */}
      <div className="absolute inset-0 ambient-gradient-overlay opacity-40 performance-optimized" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-br from-yellow-400/2 via-orange-500/1 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-tl from-red-500/2 via-orange-500/1 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-yellow-400/1 via-orange-500/0.5 to-red-500/1 rounded-full blur-3xl animate-pulse performance-optimized" style={{ animationDuration: '12s' }} />

      {/* Content */}
      <div className="relative z-10">

      <Header />

      {/* New Hero Section */}
      <HeroSection />

      {/* Smooth Transition from Hero to Services - Eliminated gap */}

      {/* Services Section */}
      <ServicesSection />

      {/* Smooth Transition from Services to Stats */}
      <SectionTransition
        height="md"
        variant="dark-to-dark"
        className="relative z-10"
      />

      {/* Stats Section */}
      <Stats />

      {/* Smooth Transition from Stats to Contact */}
      <SectionTransition
        height="lg"
        variant="dark-to-dark"
        className="relative z-10"
      />

      {/* Contact Section */}
      <ContactSection />

      {/* Smooth Transition to Footer */}
      <SectionTransition
        height="lg"
        variant="to-footer"
        className="relative z-10"
      />

      {/* Footer */}
      <Footer />
    </div>
    </div>
  )
}
