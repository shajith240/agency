'use client'

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <div className="pt-16 md:pt-20 relative">
      <section className="w-full h-[600px] sm:h-[650px] md:h-[700px] lg:h-[750px] relative overflow-hidden">



        <div className="flex flex-col lg:flex-row h-full">
          {/* Left content - Mobile optimized layout */}
          <div className="flex-1 relative z-10 flex flex-col justify-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="lg:grid lg:grid-cols-3">
                <div className="lg:col-span-3 lg:ml-[4cm] max-w-4xl">
            {/* Badge - Mobile optimized */}
            <div className="inline-flex items-center px-3 py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 w-fit">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-yellow-400" />
              <span className="text-white">Trusted by 500+ Businesses</span>
            </div>

            {/* Main heading - Mobile responsive font sizes */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 block mb-2 sm:mb-3">
                  AI Automation
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 block">
                  Agency
                </span>
              </h1>
            </div>

            {/* Description - Mobile optimized font size and spacing */}
            <div className="mb-6 sm:mb-8 lg:mb-10">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-300 max-w-2xl leading-relaxed">
                Transform your business with custom AI automation solutions.
                We design, build, and deploy intelligent workflows that save time,
                reduce costs, and boost productivity.
              </p>
            </div>

            {/* CTA Buttons - Mobile responsive sizing and touch targets */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Button
                size="lg"
                className="text-white hover:text-white font-semibold text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 min-h-[44px] transition-all duration-300 ease-out rounded-xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 shadow-lg hover:shadow-xl hover:shadow-orange-500/25 border border-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]"
                asChild
              >
                <Link href="#contact">
                  Get Free Consultation
                  <ArrowRight className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-white hover:text-white font-medium text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 min-h-[44px] transition-all duration-300 border border-white/30 hover:border-primary/60 backdrop-blur-sm bg-gradient-to-r from-white/5 to-white/10 hover:from-primary/20 hover:to-primary/30 shadow-sm hover:shadow-md"
                asChild
              >
                <Link href="#services">
                  View Our Services
                </Link>
              </Button>
            </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right content - Mobile optimized 3D Scene */}
          <div className="flex-1 relative performance-optimized lg:block hidden">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full spline-scene-enhanced"
            />
          </div>

          {/* Mobile 3D Scene - Smaller and positioned differently */}
          <div className="lg:hidden absolute top-4 right-4 w-32 h-32 sm:w-40 sm:h-40 performance-optimized">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full spline-scene-enhanced spline-mobile-scale"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
