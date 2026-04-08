import { Link } from "react-router-dom";
import AuthGate from "../ui/AuthGate";
import {
  ArrowUpRight,
  Wrench,
  Zap,
  Paintbrush,
  HardHat,
  Sparkles,
  PipetteIcon,
  Star,
  Shield,
  CheckCircle,
} from "lucide-react";

const categories = [
  { icon: <Wrench className="w-5 h-5" />, label: "Plumbing" },
  { icon: <Zap className="w-5 h-5" />, label: "Electrical" },
  { icon: <HardHat className="w-5 h-5" />, label: "Building" },
  { icon: <Sparkles className="w-5 h-5" />, label: "Cleaning" },
  { icon: <Paintbrush className="w-5 h-5" />, label: "Painting" },
  { icon: <PipetteIcon className="w-5 h-5" />, label: "Plaster" },
];

const vendors = [
  {
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    name: "Adewale Plumbing Co.",
    category: "Plumbing",
    rating: 4.9,
    jobs: 234,
    location: "Lekki, Lagos",
    price: "From ₦15,000",
    verified: true,
  },
  {
    image:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    name: "BrightSpark Electricals",
    category: "Electrical",
    rating: 4.8,
    jobs: 189,
    location: "Victoria Island, Lagos",
    price: "From ₦20,000",
    verified: true,
  },
  {
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    name: "Solid Foundation Builders",
    category: "Building",
    rating: 4.7,
    jobs: 156,
    location: "Ikoyi, Lagos",
    price: "From ₦50,000",
    verified: true,
  },
  {
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    name: "CleanSpace Services",
    category: "Cleaning",
    rating: 4.9,
    jobs: 312,
    location: "Ajah, Lagos",
    price: "From ₦10,000",
    verified: true,
  },
  {
    image:
      "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600&h=400&fit=crop",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face",
    name: "ProFinish Painters",
    category: "Painting",
    rating: 4.6,
    jobs: 98,
    location: "Gbagada, Lagos",
    price: "From ₦25,000",
    verified: true,
  },
  {
    image:
      "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=600&h=400&fit=crop",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face",
    name: "QuickFix Maintenance",
    category: "Plumbing",
    rating: 4.8,
    jobs: 275,
    location: "Surulere, Lagos",
    price: "From ₦12,000",
    verified: true,
  },
];

const ServiceLoop = () => {
  return (
    <section className="w-full px-6 md:px-12 lg:px-20 py-20 lg:py-28 bg-bg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-primary text-sm font-medium tracking-wide uppercase mb-2">
              Service Loop
            </p>
            <h2 className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
              Verified Home <span className="text-primary">Services</span>
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mt-3 max-w-lg">
              Book trusted, KYC-verified vendors for any home service. Every
              payment is protected by escrow — funds release only when the job
              is done.
            </p>
          </div>
          <a
            href="/services"
            className="shrink-0 h-10 px-6 rounded-full border border-border bg-white/80 backdrop-blur-sm text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 inline-flex items-center"
          >
            Browse all vendors
          </a>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat, i) => (
            <button
              key={i}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-text-secondary text-sm hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Vendor cards — 3 per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {vendors.slice(0, 3).map((vendor, i) => (
            <AuthGate
              key={i}
              href="/services"
              className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer block"
            >
              {/* Cover image */}
              <div className="relative h-44 overflow-hidden rounded-t-[20px]">
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Category badge */}
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-primary-dark text-xs font-medium">
                  {vendor.category}
                </span>
              </div>

              {/* Glass content panel */}
              <div className="mx-3 mb-3 -mt-6 relative z-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-5 pt-4 pb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                {/* Vendor header — avatar + name + verified */}
                <div className="flex items-center gap-3">
                  <img
                    src={vendor.avatar}
                    alt={vendor.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-heading font-bold text-primary-dark text-[15px] leading-snug truncate">
                        {vendor.name}
                      </h3>
                      {vendor.verified && (
                        <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-text-secondary text-xs">
                      {vendor.location}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-border-light mt-3 mb-3" />

                {/* Stats row */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4 text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" />
                      {vendor.rating}
                    </span>
                    <span>{vendor.jobs} jobs</span>
                    <span className="flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" />
                      Escrow
                    </span>
                  </div>
                  <span className="font-heading font-bold text-primary-dark text-sm">
                    {vendor.price}
                  </span>
                </div>
              </div>

              {/* Arrow — clipped circle at bottom-right corner */}
              <div className="w-20 h-20 bg-[#1a1a1a] rounded-full absolute -right-5 -bottom-5 z-20 group-hover:bg-primary transition-colors duration-300">
                <ArrowUpRight className="absolute top-4 left-5 w-5 h-5 text-white" />
              </div>
            </AuthGate>
          ))}
        </div>

        {/* Escrow trust banner */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm border border-border-light rounded-[20px] px-8 py-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-heading font-bold text-primary-dark text-lg">
              Every payment is escrow-protected
            </h3>
            <p className="text-text-secondary text-sm mt-1">
              Your money is held securely via Paystack. Funds are only released
              to the vendor when you confirm the job is complete. No surprises.
            </p>
          </div>
          <Link
            to="/how-it-works"
            className="shrink-0 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors duration-300 inline-flex items-center"
          >
            Learn how it works
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceLoop;
