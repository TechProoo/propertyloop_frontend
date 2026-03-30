import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  MapPin,
  ChevronDown,
  Star,
  Phone,
  MessageCircle,
  X,
  Shield,
  ShieldCheck,
  CheckCircle,
  Wrench,
  Zap,
  HardHat,
  Sparkles,
  Paintbrush,
  PipetteIcon,
  Hammer,
  Leaf,
  Wind,
  LayoutGrid,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";

/* ─── Data ─── */

interface Vendor {
  image: string;
  avatar: string;
  name: string;
  category: string;
  rating: number;
  jobs: number;
  location: string;
  price: string;
  verified: boolean;
  phone: string;
}

const categories = [
  { icon: <LayoutGrid className="w-5 h-5" />, label: "All Services", count: 1840 },
  { icon: <Wrench className="w-5 h-5" />, label: "Plumbing", count: 342 },
  { icon: <Zap className="w-5 h-5" />, label: "Electrical", count: 298 },
  { icon: <HardHat className="w-5 h-5" />, label: "Building", count: 215 },
  { icon: <Sparkles className="w-5 h-5" />, label: "Cleaning", count: 380 },
  { icon: <Paintbrush className="w-5 h-5" />, label: "Painting", count: 265 },
  { icon: <PipetteIcon className="w-5 h-5" />, label: "Plaster", count: 120 },
  { icon: <Hammer className="w-5 h-5" />, label: "Carpentry", count: 108 },
  { icon: <Leaf className="w-5 h-5" />, label: "Landscaping", count: 72 },
  { icon: <Wind className="w-5 h-5" />, label: "HVAC", count: 40 },
];

const vendors: Vendor[] = [
  {
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    name: "Chinedu Okonkwo",
    category: "Plumbing",
    rating: 4.9,
    jobs: 234,
    location: "Lekki, Lagos",
    price: "From ₦15,000",
    verified: true,
    phone: "2348012345678",
  },
  {
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    name: "Babatunde Akinola",
    category: "Electrical",
    rating: 4.8,
    jobs: 198,
    location: "Victoria Island, Lagos",
    price: "From ₦20,000",
    verified: true,
    phone: "2348023456789",
  },
  {
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face",
    name: "Emeka Uchenna",
    category: "Building",
    rating: 4.9,
    jobs: 312,
    location: "Ikoyi, Lagos",
    price: "From ₦50,000",
    verified: true,
    phone: "2348034567890",
  },
  {
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
    name: "Amina Yusuf",
    category: "Cleaning",
    rating: 4.7,
    jobs: 456,
    location: "Ajah, Lagos",
    price: "From ₦8,000",
    verified: true,
    phone: "2348045678901",
  },
  {
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face",
    name: "Segun Adeleke",
    category: "Painting",
    rating: 4.8,
    jobs: 189,
    location: "Gbagada, Lagos",
    price: "From ₦12,000",
    verified: true,
    phone: "2348056789012",
  },
  {
    image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    name: "Olu Fashola",
    category: "Plaster",
    rating: 4.6,
    jobs: 145,
    location: "Surulere, Lagos",
    price: "From ₦18,000",
    verified: true,
    phone: "2348067890123",
  },
  {
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80&h=80&fit=crop&crop=face",
    name: "Ngozi Amadi",
    category: "Cleaning",
    rating: 4.9,
    jobs: 523,
    location: "Ikeja, Lagos",
    price: "From ₦10,000",
    verified: true,
    phone: "2348078901234",
  },
  {
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face",
    name: "Yemi Ogundimu",
    category: "Electrical",
    rating: 4.7,
    jobs: 167,
    location: "Maryland, Lagos",
    price: "From ₦18,000",
    verified: true,
    phone: "2348089012345",
  },
  {
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=80&h=80&fit=crop&crop=face",
    name: "Ifeanyi Nwachukwu",
    category: "Building",
    rating: 4.8,
    jobs: 276,
    location: "Magodo, Lagos",
    price: "From ₦45,000",
    verified: true,
    phone: "2348090123456",
  },
  {
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face",
    name: "Funmi Olatunde",
    category: "Plumbing",
    rating: 4.8,
    jobs: 201,
    location: "Yaba, Lagos",
    price: "From ₦12,000",
    verified: true,
    phone: "2348001234567",
  },
  {
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
    name: "Halima Ibrahim",
    category: "Carpentry",
    rating: 4.7,
    jobs: 132,
    location: "Ojodu, Lagos",
    price: "From ₦25,000",
    verified: true,
    phone: "2348011234567",
  },
  {
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    name: "Kemi Adeyemi",
    category: "Painting",
    rating: 4.9,
    jobs: 215,
    location: "Lekki, Lagos",
    price: "From ₦15,000",
    verified: true,
    phone: "2348021234567",
  },
];

const locations = [
  "All Locations",
  "Lekki",
  "Victoria Island",
  "Ikoyi",
  "Ajah",
  "Gbagada",
  "Surulere",
  "Ikeja",
  "Maryland",
  "Yaba",
  "Magodo",
  "Ojodu",
];

const ratingFilters = ["Any Rating", "4.5+", "4.7+", "4.9+"];

/* ─── Component ─── */

const Services = () => {
  const [activeCategory, setActiveCategory] = useState("All Services");
  const [activeLocation, setActiveLocation] = useState("All Locations");
  const [activeRating, setActiveRating] = useState("Any Rating");
  const [searchQuery, setSearchQuery] = useState("");
  const [contactCard, setContactCard] = useState<number | null>(null);

  const getFiltered = () => {
    return vendors.filter((v) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === "All Services" || v.category === activeCategory;
      const matchesLocation =
        activeLocation === "All Locations" ||
        v.location.includes(activeLocation);
      const matchesRating =
        activeRating === "Any Rating" ||
        v.rating >= parseFloat(activeRating.replace("+", ""));
      return matchesSearch && matchesCategory && matchesLocation && matchesRating;
    });
  };

  const filtered = getFiltered();

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />

      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">Service Loop</span>
          </div>

          {/* ─── Hero ─── */}
          <div className="relative overflow-hidden rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-10">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1400&h=600&fit=crop)",
              }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-primary-dark/90 via-primary-dark/75 to-primary-dark/40" />
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5" />

            <div className="relative z-10 p-8 sm:p-10 lg:p-14">
              <h1 className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3.5rem] leading-[1.1] font-bold text-white tracking-tight">
                The Service <span className="text-white/70">Loop</span>
              </h1>
              <p className="text-white/60 text-sm leading-relaxed mt-3 max-w-xl">
                Hire verified plumbers, electricians, builders, cleaners, and
                more — all with escrow-protected payments via Paystack. Funds
                only release when you confirm the job is done.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  { value: "1,840+", label: "Verified Vendors" },
                  { value: "Escrow", label: "Protected" },
                  { value: "4.8", label: "Avg. Rating" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-sm"
                  >
                    <span className="font-heading font-bold text-white">
                      {s.value}
                    </span>
                    <span className="text-white/50">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Search bar */}
              <div className="mt-8 bg-white/10 backdrop-blur-md border border-white/15 rounded-[18px] p-3 flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by service, vendor name, or location..."
                    className="w-full h-12 pl-11 pr-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
                <button className="shrink-0 h-12 px-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white text-sm font-medium hover:bg-white/20 transition-all duration-300 inline-flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
                <button className="shrink-0 h-12 px-8 rounded-full bg-white text-primary-dark text-sm font-bold hover:bg-white/90 transition-colors duration-300 inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* ─── Sidebar + Grid ─── */}
          <div className="flex flex-col lg:flex-row gap-8 mb-10">
            {/* Left — sidebar */}
            <div className="lg:w-70 shrink-0 lg:sticky lg:top-8 lg:self-start">
              {/* Service categories */}
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="px-5 py-4 border-b border-border-light">
                  <h3 className="font-heading font-bold text-primary-dark text-sm">
                    Services
                  </h3>
                </div>
                <div className="p-2 max-h-[420px] overflow-y-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => setActiveCategory(cat.label)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200 ${
                        activeCategory === cat.label
                          ? "bg-primary/10 text-primary"
                          : "text-primary-dark hover:bg-bg-accent"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          activeCategory === cat.label
                            ? "bg-primary text-white"
                            : "bg-white/80 border border-border-light text-text-secondary"
                        }`}
                      >
                        {cat.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold text-[14px] leading-tight">
                          {cat.label}
                        </p>
                        <p className="text-text-secondary text-xs mt-0.5">
                          {cat.count} vendors
                        </p>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 -rotate-90 ${
                          activeCategory === cat.label
                            ? "text-primary"
                            : "text-text-subtle"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Location filter */}
              <div className="mt-5 bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="px-5 py-4 border-b border-border-light">
                  <h3 className="font-heading font-bold text-primary-dark text-sm">
                    Location
                  </h3>
                </div>
                <div className="p-3 flex flex-wrap gap-2">
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setActiveLocation(loc)}
                      className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-all duration-200 ${
                        activeLocation === loc
                          ? "bg-primary text-white border-primary"
                          : "bg-white/60 text-primary-dark border-border-light hover:border-primary hover:text-primary"
                      }`}
                    >
                      {loc === "All Locations" ? "All" : loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating filter */}
              <div className="mt-5 bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="px-5 py-4 border-b border-border-light">
                  <h3 className="font-heading font-bold text-primary-dark text-sm">
                    Rating
                  </h3>
                </div>
                <div className="p-3 flex flex-wrap gap-2">
                  {ratingFilters.map((rf) => (
                    <button
                      key={rf}
                      onClick={() => setActiveRating(rf)}
                      className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-all duration-200 inline-flex items-center gap-1.5 ${
                        activeRating === rf
                          ? "bg-primary text-white border-primary"
                          : "bg-white/60 text-primary-dark border-border-light hover:border-primary hover:text-primary"
                      }`}
                    >
                      {rf !== "Any Rating" && (
                        <Star
                          className={`w-3 h-3 ${
                            activeRating === rf
                              ? "text-white fill-white"
                              : "text-[#F5A623] fill-[#F5A623]"
                          }`}
                        />
                      )}
                      {rf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick stats */}
              <div className="mt-5 bg-white/60 backdrop-blur-sm border border-border-light rounded-[20px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <h4 className="font-heading font-bold text-primary-dark text-sm mb-3">
                  Service Loop Stats
                </h4>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Total vendors", value: "1,840+" },
                    { label: "Jobs completed", value: "12,500+" },
                    { label: "Avg. response time", value: "< 1hr" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-text-secondary text-xs">
                        {stat.label}
                      </span>
                      <span className="font-heading font-bold text-primary-dark text-sm">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — vendor cards */}
            <div className="flex-1">
              {/* Results header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-text-secondary text-sm">
                  Showing{" "}
                  <span className="font-bold text-primary-dark">
                    {filtered.length}
                  </span>{" "}
                  vendors in{" "}
                  <span className="font-bold text-primary-dark">
                    {activeCategory === "All Services"
                      ? "All Services"
                      : activeCategory}
                  </span>
                </p>
                <select className="h-9 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-xs focus:outline-none focus:border-primary transition-colors appearance-none pr-8">
                  <option>Top rated</option>
                  <option>Most jobs</option>
                  <option>Price: Low to High</option>
                  <option>Newest</option>
                </select>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                {filtered.map((vendor, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      setContactCard(contactCard === i ? null : i)
                    }
                    className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    {/* Cover image */}
                    <div className="h-44 overflow-hidden rounded-t-[20px] relative">
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
                      {/* Vendor header */}
                      <div className="flex items-center gap-3 mb-3">
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
                              <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                            )}
                          </div>
                          <p className="text-text-secondary text-xs flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {vendor.location}
                          </p>
                        </div>
                      </div>

                      <div className="h-px bg-border-light mb-3" />

                      {/* Stats row */}
                      <div className="flex items-center justify-between text-xs pr-10">
                        <div className="flex items-center gap-4 text-text-secondary">
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" />
                            {vendor.rating}
                          </span>
                          <span>{vendor.jobs} jobs</span>
                          <span className="flex items-center gap-1 text-primary font-medium">
                            <Shield className="w-3.5 h-3.5" />
                            Escrow
                          </span>
                        </div>
                      </div>

                      {/* Price */}
                      <p className="font-heading font-bold text-primary-dark text-sm mt-2.5">
                        {vendor.price}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="w-20 h-20 bg-[#1a1a1a] rounded-full absolute -right-5 -bottom-5 z-20 group-hover:bg-primary transition-colors duration-300">
                      <ArrowUpRight className="absolute top-4 left-5 w-5 h-5 text-white" />
                    </div>

                    {/* Contact overlay */}
                    <AnimatePresence>
                      {contactCard === i && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-[#1a3d2a]/80 backdrop-blur-md rounded-[20px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <motion.button
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: 0.15,
                              duration: 0.3,
                              ease: [0.23, 1, 0.32, 1],
                            }}
                            onClick={() => setContactCard(null)}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>

                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.1,
                              duration: 0.35,
                              ease: [0.23, 1, 0.32, 1],
                            }}
                            className="text-center"
                          >
                            <p className="text-white/60 text-xs">
                              Hire Vendor
                            </p>
                            <p className="font-heading font-bold text-white text-base mt-1">
                              {vendor.name}
                            </p>
                            <p className="text-white/40 text-xs mt-0.5">
                              {vendor.category} · {vendor.price}
                            </p>
                          </motion.div>

                          <div className="flex gap-4">
                            <motion.a
                              initial={{ opacity: 0, scale: 0.5, y: 20 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{
                                delay: 0.2,
                                duration: 0.4,
                                ease: [0.23, 1, 0.32, 1],
                              }}
                              href={`tel:+${vendor.phone}`}
                              className="flex flex-col items-center gap-2"
                            >
                              <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-primary-dark transition-all duration-300">
                                <Phone className="w-6 h-6" />
                              </div>
                              <span className="text-white/70 text-xs">
                                Call
                              </span>
                            </motion.a>
                            <motion.a
                              initial={{ opacity: 0, scale: 0.5, y: 20 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{
                                delay: 0.3,
                                duration: 0.4,
                                ease: [0.23, 1, 0.32, 1],
                              }}
                              href={`https://wa.me/${vendor.phone}?text=Hi ${vendor.name}, I found your profile on PropertyLoop and need ${vendor.category.toLowerCase()} services.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-col items-center gap-2"
                            >
                              <div className="w-14 h-14 rounded-full bg-[#25D366]/20 backdrop-blur-sm border border-[#25D366]/30 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300">
                                <MessageCircle className="w-6 h-6" />
                              </div>
                              <span className="text-white/70 text-xs">
                                WhatsApp
                              </span>
                            </motion.a>
                          </div>

                          <motion.button
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.4,
                              duration: 0.35,
                              ease: [0.23, 1, 0.32, 1],
                            }}
                            className="mt-1 h-10 px-6 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-medium hover:bg-white hover:text-primary-dark transition-all duration-300 inline-flex items-center gap-2"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                            Book job
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Empty state */}
              {filtered.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-bg-accent border border-border-light flex items-center justify-center mx-auto mb-4">
                    <Wrench className="w-7 h-7 text-text-subtle" />
                  </div>
                  <h3 className="font-heading font-bold text-primary-dark text-lg">
                    No vendors found
                  </h3>
                  <p className="text-text-secondary text-sm mt-2 max-w-sm mx-auto">
                    Try adjusting your filters or search query.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("All Services");
                      setActiveLocation("All Locations");
                      setActiveRating("Any Rating");
                    }}
                    className="mt-4 h-10 px-6 rounded-full border border-border-light bg-white/80 backdrop-blur-sm text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Load more */}
              {filtered.length > 0 && (
                <div className="mt-10 text-center">
                  <button className="h-11 px-8 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                    Load more vendors
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ─── Escrow Trust Banner ─── */}
          <div className="mb-20 bg-white/60 backdrop-blur-sm border border-border-light rounded-[20px] px-8 py-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-heading font-bold text-primary-dark text-lg">
                Every payment is escrow-protected
              </h3>
              <p className="text-text-secondary text-sm mt-1">
                Your money is held securely via Paystack escrow. Vendors only
                get paid when you confirm the job is complete. Every completed
                job is auto-logged to the Property Logbook.
              </p>
            </div>
            <Link
              to="/onboarding"
              className="shrink-0 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors duration-300 inline-flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Become a vendor
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
