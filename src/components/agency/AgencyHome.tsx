'use client'

import { Header } from '@/components/layout/Header'
import { HeroSection } from '@/components/agency/HeroSection'
import { ServicesSection } from '@/components/agency/ServicesSection'
import { Footer } from '@/components/ui/footer-section'
import { Stats } from '@/components/ui/stats-section-with-text'
import { ContactSection } from '@/components/agency/ContactSection'

export function AgencyHome() {
  return (
    <div className="min-h-screen bg-black/[0.96] relative w-full">

      {/* Content */}
      <div className="relative z-10">

      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Stats Section */}
      <Stats />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </div>
    </div>
  )
}
