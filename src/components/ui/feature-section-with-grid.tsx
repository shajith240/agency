import { Badge } from "@/components/ui/badge";

function BrowseByCategorySection() {
  const categories = [
    {
      id: 1,
      title: "E-commerce Automation",
      description: "Streamline your online store operations with automated workflows for inventory, orders, and customer service.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=225&fit=crop&crop=center"
    },
    {
      id: 2,
      title: "Marketing Automation",
      description: "Boost your marketing campaigns with automated email sequences, social media posting, and lead nurturing.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop&crop=center"
    },
    {
      id: 3,
      title: "Data Processing",
      description: "Automate data collection, analysis, and reporting to make informed business decisions faster.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop&crop=center"
    },
    {
      id: 4,
      title: "Customer Support",
      description: "Enhance customer experience with automated ticket routing, chatbots, and response systems.",
      image: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=225&fit=crop&crop=center"
    },
    {
      id: 5,
      title: "Finance & Accounting",
      description: "Automate invoicing, expense tracking, and financial reporting to save time and reduce errors.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=225&fit=crop&crop=center"
    },
    {
      id: 6,
      title: "HR & Recruitment",
      description: "Streamline hiring processes, employee onboarding, and performance tracking with smart automation.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop&crop=center"
    }
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-black/[0.96] relative">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-start">
            <div>
              <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30">
                Categories
              </Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-semibold text-left bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                Browse by Category
              </h2>
              <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-neutral-300 text-left">
                Find the perfect automation template for your specific needs
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.map((category) => (
              <div key={category.id} className="group flex flex-col gap-4 p-6 rounded-xl bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 backdrop-blur-sm border border-neutral-800/50 hover:border-neutral-700/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer">
                <div className="relative overflow-hidden rounded-lg aspect-video mb-2">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
                <h3 className="text-xl tracking-tight font-medium text-white group-hover:text-blue-300 transition-colors duration-300">
                  {category.title}
                </h3>
                <p className="text-neutral-400 text-base leading-relaxed">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export { BrowseByCategorySection };
