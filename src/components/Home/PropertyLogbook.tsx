import {
  ArrowUpRight,
  Wrench,
  Zap,
  Paintbrush,
  ShieldCheck,
  Droplets,
  ThermometerSun,
  FileCheck,
  Home,
} from "lucide-react";

const timelineEntries = [
  {
    date: "Mar 2026",
    icon: <Wrench className="w-4 h-4" />,
    title: "Plumbing Repair",
    vendor: "Adewale Plumbing Co.",
    description: "Kitchen sink replacement and pipe rerouting for ground floor",
    cost: "₦45,000",
    status: "Verified",
  },
  {
    date: "Jan 2026",
    icon: <Zap className="w-4 h-4" />,
    title: "Electrical Rewiring",
    vendor: "BrightSpark Electricals",
    description:
      "Full rewiring of second floor bedrooms and new circuit breaker",
    cost: "₦120,000",
    status: "Verified",
  },
  {
    date: "Nov 2025",
    icon: <Paintbrush className="w-4 h-4" />,
    title: "Interior Painting",
    vendor: "ProFinish Painters",
    description: "Complete repaint of living room, hallway, and master bedroom",
    cost: "₦85,000",
    status: "Verified",
  },
  {
    date: "Sep 2025",
    icon: <Droplets className="w-4 h-4" />,
    title: "Waterproofing",
    vendor: "SealTight Solutions",
    description: "Roof and terrace waterproofing with 5-year warranty coating",
    cost: "₦200,000",
    status: "Verified",
  },
  {
    date: "Jun 2025",
    icon: <ThermometerSun className="w-4 h-4" />,
    title: "AC Installation",
    vendor: "CoolBreeze HVAC",
    description:
      "Installed 3 split-unit air conditioners across main living areas",
    cost: "₦350,000",
    status: "Verified",
  },
  {
    date: "Mar 2025",
    icon: <FileCheck className="w-4 h-4" />,
    title: "Property Inspection",
    vendor: "PropertyLoop Verified",
    description: "Initial property inspection and logbook creation on platform",
    cost: "—",
    status: "Verified",
  },
];

const PropertyLogbook = () => {
  return (
    <section className="w-full px-6 md:px-12 lg:px-20 py-20 lg:py-28 bg-bg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">
          {/* Left — intro (sticky on desktop) */}
          <div className="lg:w-95 shrink-0 lg:sticky lg:top-8 lg:self-start">
            <p className="text-primary text-sm font-medium tracking-wide uppercase mb-2">
              Property Logbook
            </p>
            <h2 className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
              Every Repair. <span className="text-primary">Every Record.</span>
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mt-4">
              Every property on PropertyLoop gets a permanent digital logbook.
              All maintenance, repairs, and services are recorded with verified
              vendor details — building trust and transparency for buyers,
              tenants, and owners.
            </p>

            {/* Sample property card */}
            <div className="mt-8 relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Home className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-primary-dark text-[15px]">
                    4-Bed Villa, Lekki Phase 1
                  </h3>
                  <p className="text-text-secondary text-xs">
                    Property ID: PL-00482
                  </p>
                </div>
              </div>
              <div className="h-px bg-border-light my-4" />
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span>6 service records</span>
                <span>Last updated: Mar 2026</span>
              </div>

              {/* Clipped circle */}
              <div className="w-16 h-16 bg-primary/10 rounded-full absolute -right-3 -top-3">
                <ShieldCheck className="absolute bottom-4 left-4 w-5 h-5 text-primary" />
              </div>
            </div>

            <button className="mt-6 h-10 px-6 rounded-full border border-border bg-white/80 backdrop-blur-sm text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
              Learn about logbooks
            </button>
          </div>

          {/* Right — timeline */}
          <div className="flex-1 relative">
            {/* Vertical line */}
            <div className="absolute left-5.75 top-0 bottom-0 w-px bg-border-light" />

            <div className="flex flex-col gap-5">
              {timelineEntries.slice(0, 3).map((entry, i) => (
                <div key={i} className="flex gap-5 relative group">
                  {/* Timeline dot */}
                  <div className="shrink-0 relative z-10 mt-5">
                    <div className="w-11.5 h-11.5 rounded-full bg-white/80 backdrop-blur-sm border border-border-light shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center text-primary">
                      {entry.icon}
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-300">
                    {/* Glass content */}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                          {entry.date}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-primary">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {entry.status}
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-primary-dark text-[15px] mt-2">
                        {entry.title}
                      </h3>
                      <p className="text-text-secondary text-xs mt-0.5">
                        by {entry.vendor}
                      </p>
                      <p className="text-text-secondary text-[13px] leading-relaxed mt-2">
                        {entry.description}
                      </p>
                      <div className="h-px bg-border-light mt-3 mb-3" />
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-primary-dark text-sm">
                          {entry.cost}
                        </span>
                        <span className="text-text-secondary text-xs">
                          Escrow protected
                        </span>
                      </div>
                    </div>

                    {/* Clipped arrow circle */}
                    <div className="w-16 h-16 bg-[#1a1a1a] rounded-full absolute -right-4 -bottom-4 z-20 group-hover:bg-primary transition-colors duration-300">
                      <ArrowUpRight className="absolute top-3 left-4 w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyLogbook;
