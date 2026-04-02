import { ArrowRight, Globe, Star, Building } from "lucide-react";

const stats = [
  { value: "8,000+", label: "Happy users" },
  { value: "2,500+", label: "Client reviews" },
  { value: "4.8", label: "Positive Rating" },
];

const features = [
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Explore\ngreat neighbourhoods",
    description:
      "Explore video tours, in-depth research, and articles on 20,000 neighbourhoods.",
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: "Find highly\nrated best property",
    description:
      "Find the very best properties with in-depth reviews and ratings from multiple experts.",
  },
  {
    icon: <Building className="w-5 h-5" />,
    title: "Discover\ncondo quality buildings",
    description:
      "Explore video tours, in-depth research, and articles on 20,000 neighbourhoods.",
  },
];

const avatars = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
];

const TrustedSection = () => {
  return (
    <section className="w-full px-6 md:px-12 lg:px-20 py-20 lg:py-28 bg-bg">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 max-w-7xl mx-auto">
        {/* Left side */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
              Trusted by
              <br />
              <span className="text-primary">Thousands</span> of Nigerians
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mt-6 max-w-md">
              Only we connect you directly to the person that knows the most
              about a property for sale, the listing agent.
            </p>
          </div>

          {/* Avatars + Stats */}
          <div className="mt-12 lg:mt-auto">
            {/* Avatar stack */}
            <div className="flex -space-x-3 mb-8">
              {avatars.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Happy client"
                  className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-md"
                />
              ))}
            </div>

            {/* Stats row */}
            <div className="flex gap-10">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading font-bold text-primary-dark text-2xl">
                    {stat.value}
                  </p>
                  <p className="text-text-secondary text-xs mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vertical divider — desktop */}
        <div className="hidden lg:block w-px bg-border self-stretch" />

        {/* Right side — feature cards */}
        <div className="flex-1 flex flex-col gap-8 pl-4 pt-4">
          {features.map((feature, i) => (
            <div key={i} className="group relative">
              {/* Concave notch — page-bg circle behind the icon */}
              <div className="absolute -top-3.5 -left-3.5 w-17 h-17 rounded-full bg-bg z-1" />

              {/* Icon — sits in the notch */}
              <div className="absolute -top-1.5 -left-1.5 z-2 w-13 h-13 rounded-full bg-[#FFF3E6] flex items-center justify-center shadow-[0_2px_8px_rgba(245,166,35,0.15)]">
                <div className="w-9 h-9 rounded-full bg-[#FFE4B8] flex items-center justify-center text-[#F5A623]">
                  {feature.icon}
                </div>
              </div>

              {/* Main card */}
              <div className="bg-white/85 backdrop-blur-sm rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] pt-5 pb-4 pl-14 pr-5">
                <h3 className="font-heading font-bold text-primary-dark text-[17px] leading-snug whitespace-pre-line">
                  {feature.title}
                </h3>
              </div>

              {/* Description bubble + Arrow */}
              <div className="flex items-end gap-3 mt-1.5 pl-2 pr-1">
                <div className="bg-bg-accent rounded-[18px] rounded-tl-[5px] px-4 py-3 flex-1">
                  <p className="text-text-secondary text-[13px] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <button className="shrink-0 h-9 px-4 rounded-full border border-border-light bg-white/90 backdrop-blur-sm flex items-center justify-center text-text-subtle group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300 mb-0.5">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedSection;
