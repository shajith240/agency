"use client";

import { Bot, Workflow, Database, Mail, Target, Users } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

// Service data for the agency - Optimized for readability
const services = [
  {
    id: 1,
    icon: Bot,
    title: "AI Chatbot Development",
    description: "Intelligent chatbots that handle customer support and lead generation automatically.",
    benefits: ["24/7 Customer Support", "Lead Qualification", "Natural Conversations"],
    category: "Customer Service",
    featured: true
  },
  {
    id: 2,
    icon: Workflow,
    title: "Workflow Automation",
    description: "Connect your tools and automate repetitive business processes seamlessly.",
    benefits: ["Process Integration", "Task Automation", "System Connectivity"],
    category: "Process Optimization",
    featured: true
  },
  {
    id: 3,
    icon: Mail,
    title: "Email Marketing Automation",
    description: "Personalized email campaigns with intelligent segmentation and follow-ups.",
    benefits: ["Smart Segmentation", "Automated Sequences", "Performance Tracking"],
    category: "Marketing",
    featured: true
  },
  {
    id: 4,
    icon: Database,
    title: "Data Processing & Analytics",
    description: "Transform raw data into actionable insights with automated reporting.",
    benefits: ["Real-time Dashboards", "Automated Reports", "Data Visualization"],
    category: "Data & Analytics",
    featured: true
  },
  {
    id: 5,
    icon: Target,
    title: "Lead Generation Systems",
    description: "Capture, qualify, and nurture prospects into paying customers.",
    benefits: ["Lead Capture", "Qualification Scoring", "Nurture Campaigns"],
    category: "Sales",
    featured: true
  },
  {
    id: 6,
    icon: Users,
    title: "CRM Integration & Automation",
    description: "Streamline customer management with automated CRM workflows.",
    benefits: ["Contact Management", "Pipeline Tracking", "Follow-up Automation"],
    category: "Customer Management",
    featured: true
  }
];

export function ServicesSection() {
  const getGridArea = (index: number): string => {
    const areas = [
      "md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]",
      "md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]",
      "md:[grid-area:2/1/3/7] xl:[grid-area:1/5/2/9]",
      "md:[grid-area:2/7/3/13] xl:[grid-area:1/9/2/13]",
      "md:[grid-area:3/1/4/7] xl:[grid-area:2/5/3/9]",
      "md:[grid-area:3/7/4/13] xl:[grid-area:2/9/3/13]",
    ];
    return areas[index] || "";
  };

  return (
    <section id="services" className="pt-16 md:pt-24 lg:pt-32 pb-16 md:pb-32 bg-black/[0.96] relative w-full overflow-hidden">
      {/* Seamless background transition from hero */}
      <div className="absolute top-0 left-0 w-full h-24 md:h-32 lg:h-40 bg-gradient-to-b from-black/[0.96] to-transparent" />

      {/* Enhanced ambient background for services */}
      <div className="absolute inset-0 ambient-gradient-overlay-center opacity-60" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-yellow-400/5 via-orange-500/4 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tl from-red-500/4 via-orange-500/3 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto space-y-16 relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Section Header - Enhanced spacing for better visual separation */}
        <div className="relative z-10 grid items-center gap-6 md:grid-cols-2 md:gap-12 pt-8 md:pt-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Our Services
          </h2>
          <p className="max-w-lg sm:ml-auto text-neutral-300 leading-relaxed text-lg md:text-xl">
            Comprehensive AI automation solutions designed to transform your business operations, increase efficiency, and drive growth across all departments.
          </p>
        </div>

        {/* Services Grid - Enhanced spacing and layout */}
        <div className="relative z-10">
          <ul className="grid grid-cols-1 grid-rows-none gap-6 md:grid-cols-12 md:grid-rows-3 lg:gap-8 xl:max-h-[40rem] xl:grid-rows-2">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <ServiceItem
                  key={service.id}
                  area={getGridArea(index)}
                  icon={<IconComponent className="h-6 w-6" />}
                  title={service.title}
                  description={service.description}
                  category={service.category}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

interface ServiceItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
}

const ServiceItem = ({
  area,
  icon,
  title,
  description,
  category
}: ServiceItemProps) => {
  return (
    <li className={cn("min-h-[18rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-neutral-800/50 p-3 md:rounded-[1.5rem] md:p-4 hover:border-neutral-700/50 transition-all duration-300 group cursor-pointer">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={2}
        />
        <div className="relative flex h-full flex-col gap-8 overflow-hidden rounded-xl border-[0.75px] card-ambient-glow p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
          {/* Subtle brand-colored ambient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/2 via-orange-500/3 to-red-500/2 rounded-xl opacity-60" />

          <div className="relative flex flex-col gap-8">
            {/* Header Section - Icon and Category */}
            <div className="flex items-start justify-between">
              <div className="w-fit rounded-xl border-[0.75px] border-neutral-700/50 bg-gradient-to-br from-neutral-800/60 to-neutral-700/40 p-4">
                <div className="text-orange-400">
                  {icon}
                </div>
              </div>
              <div className="text-xs text-neutral-500 font-medium bg-neutral-800/40 px-3 py-1.5 rounded-full border border-neutral-700/30">
                {category}
              </div>
            </div>

            {/* Content Section - Title and Description */}
            <div className="space-y-4">
              <h3 className="text-xl leading-tight font-semibold font-sans tracking-[-0.02em] md:text-2xl md:leading-tight text-balance text-neutral-50">
                {title}
              </h3>
              <p className="font-sans text-base leading-relaxed md:text-lg md:leading-relaxed text-neutral-300">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
