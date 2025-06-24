import { InfiniteSlider } from "@/components/ui/infinite-slider";

function LogoCarouselSection() {
  // High-quality, reliable logo sources optimized for dark themes
  const logos = [
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", alt: "React" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", alt: "Next.js" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", alt: "TypeScript" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", alt: "Node.js" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", alt: "Python" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", alt: "Docker" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg", alt: "AWS" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg", alt: "Google Cloud" },
  ];

  // Duplicate logos multiple times to ensure viewport is filled
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-black py-16">
      <InfiniteSlider gap={32} reverse duration={50} className="w-full h-full">
        {duplicatedLogos.map((logo, index) => (
          <div
            key={`${logo.alt}-${index}`}
            className="flex items-center justify-center p-4 mx-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group"
          >
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-[60px] w-auto filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-all duration-300 drop-shadow-sm"
            />
          </div>
        ))}
      </InfiniteSlider>
    </div>
  );
}

export { LogoCarouselSection };
