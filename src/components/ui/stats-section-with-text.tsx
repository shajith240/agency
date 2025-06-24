import { Users, Clock, TrendingUp, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  change: string;
  changeColor?: string; // Made optional since we're using consistent orange styling
  label: string;
}

const StatCard = ({ icon, value, change, changeColor, label }: StatCardProps) => {
  return (
    <div className="min-h-[14rem] list-none">
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-neutral-800/50 p-2 md:rounded-[1.5rem] md:p-3 hover:border-neutral-700/50 transition-all duration-300">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={2}
        />
        <div className="relative flex h-full flex-col gap-6 overflow-hidden rounded-xl border-[0.75px] card-ambient-glow p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
          {/* Enhanced brand-colored ambient overlay following orange-to-red gradient system */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/2 via-orange-500/3 to-red-500/2 rounded-xl opacity-60" />

          <div className="relative flex flex-col gap-6">
            {/* Header Section - Icon */}
            <div className="flex items-start justify-start">
              <div className="w-fit rounded-lg border-[0.75px] border-neutral-700/50 bg-gradient-to-br from-neutral-800/60 to-neutral-700/40 p-3">
                <div className="text-orange-400">
                  {icon}
                </div>
              </div>
            </div>

            {/* Content Section - Value and Label with proper hierarchy */}
            <div className="space-y-4 flex-1">
              <div className="space-y-3">
                {/* Primary Value with consistent orange-to-red gradient system */}
                <h3 className="font-mono text-2xl md:text-3xl lg:text-4xl tracking-[-0.02em] font-bold text-neutral-50 leading-none">
                  {value}
                </h3>

                {/* Change Indicator - Simplified and consistent */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-orange-400 bg-orange-500/10 px-2 py-1 rounded-full border border-orange-500/20">
                    {change}
                  </span>
                </div>
              </div>

              {/* Label with proper spacing */}
              <p className="font-sans text-sm md:text-base leading-relaxed text-neutral-300 font-medium">
                {label}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Stats() {
  return (
    <section className="pt-8 md:pt-16 pb-16 md:pb-32 bg-black/[0.96] relative w-full overflow-hidden">
      {/* Enhanced ambient lighting for stats section following design system */}
      <div className="absolute inset-0 stats-ambient-lighting opacity-60" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-yellow-400/5 via-orange-500/4 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tl from-red-500/4 via-orange-500/3 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto space-y-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Content - Aligned with navigation positioning */}
          <div className="flex gap-8 flex-col items-start">
            <div>
              <Badge className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30 font-sans text-sm font-semibold px-4 py-2 tracking-wide uppercase">
                Impact
              </Badge>
            </div>
            <div className="flex gap-8 flex-col">
              <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 tracking-[-0.02em] lg:max-w-2xl text-left leading-tight">
                Transforming Businesses with AI
              </h2>
              <p className="font-sans text-lg md:text-xl lg:max-w-2xl leading-relaxed text-neutral-300 text-left font-medium">
                Our agency has helped hundreds of businesses automate their operations,
                reduce costs, and boost productivity. See the real impact we've made
                across industries and company sizes.
              </p>
            </div>
          </div>

          {/* Right Content - Stats Grid with 8px grid spacing */}
          <div className="flex justify-center items-center">
            <div className="grid text-left grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 w-full gap-6">
              <StatCard
                icon={<Users className="h-6 w-6" />}
                value="500+"
                change="+45%"
                changeColor="text-orange-400"
                label="Clients Served"
              />
              <StatCard
                icon={<Clock className="h-6 w-6" />}
                value="2.4M+"
                change="+32%"
                changeColor="text-orange-400"
                label="Hours Saved"
              />
              <StatCard
                icon={<TrendingUp className="h-6 w-6" />}
                value="85%"
                change="+12%"
                changeColor="text-orange-400"
                label="Cost Reduction"
              />
              <StatCard
                icon={<Award className="h-6 w-6" />}
                value="4.9"
                change="+0.3"
                changeColor="text-orange-400"
                label="Client Rating"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Stats };
