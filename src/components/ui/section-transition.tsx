import { cn } from "@/lib/utils"

interface SectionTransitionProps {
  className?: string
  height?: "sm" | "md" | "lg" | "xl"
  variant?: "hero-to-features" | "features-to-stats" | "dark-to-dark" | "to-footer" | "default"
}

export function SectionTransition({
  className,
  height = "md",
  variant = "hero-to-features"
}: SectionTransitionProps) {
  const heightClasses = {
    sm: "h-8 md:h-12",
    md: "h-16 md:h-24",
    lg: "h-24 md:h-32",
    xl: "h-32 md:h-40"
  }

  const getVariantClasses = () => {
    switch (variant) {
      case "hero-to-features":
        return "bg-gradient-to-b from-black/[0.96] via-black/[0.98] to-black/[0.96]"
      case "features-to-stats":
        return "bg-gradient-to-b from-black/[0.96] via-black/[0.8] to-black/[0.96]"
      case "dark-to-dark":
        return "bg-gradient-to-b from-black/[0.96] via-black to-black/[0.96]"
      case "to-footer":
        return "bg-gradient-to-b from-yellow-400/[0.02] via-orange-500/[0.03] via-black/[0.9] to-black/[0.96]"
      default:
        return "bg-gradient-to-b from-black/[0.96] via-black/[0.98] to-black/[0.96]"
    }
  }

  return (
    <div
      className={cn(
        "w-full relative overflow-hidden backdrop-blur-sm",
        heightClasses[height],
        getVariantClasses(),
        className
      )}
    >
      {/* Primary smooth blending overlay with edge fading */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/[0.3] to-transparent" />

      {/* Secondary depth layer for enhanced blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/[0.1] via-black/[0.4] to-black/[0.1]" />

      {/* Subtle dark shimmer effect for premium feel */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/[0.05] to-transparent animate-pulse" />

      {/* Enhanced noise texture with dark theme optimization */}
      <div
        className="absolute inset-0 opacity-[0.012] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Soft edge blur for ultra-smooth transitions */}
      <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-transparent to-black/[0.15] blur-sm" />
      <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-transparent to-black/[0.15] blur-sm" />
    </div>
  )
}
