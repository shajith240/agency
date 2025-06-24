'use client'

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { CursorSpotlight } from "@/components/ui/cursor-spotlight"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <div className="pt-20 relative">
      <Card className="w-full h-[650px] md:h-[700px] lg:h-[750px] bg-black/[0.96] relative overflow-hidden border-none shadow-none">
        {/* Optimized ambient lighting background */}
        <div className="absolute inset-0 hero-ambient-lighting opacity-60 performance-optimized" />

        {/* Optimized brand-colored gradients for depth */}
        <div className="absolute top-0 left-0 w-full h-full performance-optimized">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-r from-yellow-400/4 via-orange-500/3 to-red-500/2 rounded-full blur-3xl opacity-50" />
        </div>

        {/* Optimized spotlight with brand colors */}
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20 performance-optimized"
          fill="rgba(251, 191, 36, 0.6)"
        />

        {/* Interactive cursor spotlight with brand colors */}
        <CursorSpotlight
          className="z-[2] performance-optimized"
          size={400}
          springOptions={{ bounce: 0, damping: 20, stiffness: 120 }}
        />

        <div className="flex h-full">
          {/* Left content - Aligned with navigation */}
          <div className="flex-1 relative z-10 flex flex-col justify-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="lg:grid lg:grid-cols-3">
                <div className="lg:col-span-3 ml-[4cm] max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 w-fit">
              <Zap className="w-4 h-4 mr-2 text-yellow-400" />
              <span className="text-white">Trusted by 500+ Businesses</span>
            </div>

            {/* Main heading - Enhanced font sizes for better prominence */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 block mb-3">
                  AI Automation
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 block">
                  Agency
                </span>
              </h1>
            </div>

            {/* Description - Enhanced font size for better readability */}
            <div className="mb-10">
              <p className="text-lg md:text-xl lg:text-2xl text-neutral-300 max-w-2xl leading-relaxed">
                Transform your business with custom AI automation solutions.
                We design, build, and deploy intelligent workflows that save time,
                reduce costs, and boost productivity.
              </p>
            </div>

            {/* CTA Buttons - Enhanced sizing to match increased headline prominence */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="text-white hover:text-white font-semibold text-lg md:text-xl px-8 md:px-10 py-4 md:py-5 transition-all duration-300 ease-out rounded-xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 shadow-lg hover:shadow-xl hover:shadow-orange-500/25 border border-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]"
                asChild
              >
                <Link href="#contact">
                  Get Free Consultation
                  <ArrowRight className="ml-3 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-white hover:text-white font-medium text-lg md:text-xl px-8 md:px-10 py-4 md:py-5 transition-all duration-300 border border-white/30 hover:border-primary/60 backdrop-blur-sm bg-gradient-to-r from-white/5 to-white/10 hover:from-primary/20 hover:to-primary/30 shadow-sm hover:shadow-md"
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

          {/* Right content - Optimized 3D Scene */}
          <div className="flex-1 relative performance-optimized">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full spline-scene-enhanced"
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
