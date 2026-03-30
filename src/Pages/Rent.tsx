import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Bed,
  Bath,
  Maximize,
  Search,
  SlidersHorizontal,
  MapPin,
  Building2,
  Home,
  LandPlot,
  Store,
  LayoutGrid,
  ChevronDown,
  Star,
  Phone,
  MessageCircle,
  X,
  Zap,
  Droplets,
  ShieldCheck,
  GraduationCap,
  Car,
  TrendingDown,
  ArrowDown,
  Calendar,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";

const categories = [
  {
    icon: <Building2 className="w-5 h-5" />,
    label: "Flats & Apartments",
    count: 4820,
  },
  { icon: <Home className="w-5 h-5" />, label: "Houses", count: 1950 },
  {
    icon: <Store className="w-5 h-5" />,
    label: "Office Space",
    count: 1120,
  },
  { icon: <LandPlot className="w-5 h-5" />, label: "Land Lease", count: 680 },
  {
    icon: <LayoutGrid className="w-5 h-5" />,
    label: "All Property",
    count: 8570,
  },
];

const listings = {
  "Flats & Apartments": [
    {
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
      price: "₦3,500,000",
      period: "year",
      title: "Serviced 3-Bed Flat with Pool",
      address: "Lekki Phase 1, Lagos",
      beds: 3,
      baths: 3,
      sqft: "2,400",
      rating: 4.8,
      agent: "Prime Realty",
    },
    {
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
      price: "₦8,000,000",
      period: "year",
      title: "Luxury Penthouse with Ocean View",
      address: "Victoria Island, Lagos",
      beds: 4,
      baths: 3,
      sqft: "3,800",
      rating: 4.9,
      agent: "Island Properties",
    },
    {
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
      price: "₦2,800,000",
      period: "year",
      title: "Modern 2-Bed Apartment",
      address: "Ikoyi, Lagos",
      beds: 2,
      baths: 2,
      sqft: "1,600",
      rating: 4.7,
      agent: "Prestige Homes",
    },
  ],
  Houses: [
    {
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
      price: "₦12,000,000",
      period: "year",
      title: "4-Bed Detached Villa with Garden",
      address: "Lekki Phase 1, Lagos",
      beds: 4,
      baths: 3,
      sqft: "6,800",
      rating: 4.9,
      agent: "Prime Realty",
    },
    {
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
      price: "₦25,000,000",
      period: "year",
      title: "Waterfront Mansion with Pool",
      address: "Banana Island, Lagos",
      beds: 6,
      baths: 5,
      sqft: "12,000",
      rating: 4.9,
      agent: "Royal Estate Advisors",
    },
    {
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
      price: "₦5,500,000",
      period: "year",
      title: "Semi-Detached Duplex with BQ",
      address: "Gbagada, Lagos",
      beds: 4,
      baths: 3,
      sqft: "5,200",
      rating: 4.7,
      agent: "Cityscape Properties",
    },
  ],
  "Office Space": [
    {
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
      price: "₦18,000,000",
      period: "year",
      title: "Open-Plan Office on Allen Avenue",
      address: "Ikeja, Lagos",
      beds: 0,
      baths: 4,
      sqft: "8,500",
      rating: 4.7,
      agent: "Cityscape Properties",
    },
    {
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
      price: "₦10,000,000",
      period: "year",
      title: "Co-Working Hub on Admiralty Way",
      address: "Lekki Phase 1, Lagos",
      beds: 0,
      baths: 2,
      sqft: "4,200",
      rating: 4.8,
      agent: "Prime Realty",
    },
    {
      image:
        "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=600&h=400&fit=crop",
      price: "₦6,000,000",
      period: "year",
      title: "Private Office Suite with Reception",
      address: "Victoria Island, Lagos",
      beds: 0,
      baths: 2,
      sqft: "2,800",
      rating: 4.6,
      agent: "Island Properties",
    },
  ],
  "Land Lease": [
    {
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop",
      price: "₦2,000,000",
      period: "year",
      title: "500sqm Plot in Gated Estate",
      address: "Ajah, Lagos",
      beds: 0,
      baths: 0,
      sqft: "500",
      rating: 4.6,
      agent: "Metro Living Realty",
    },
    {
      image:
        "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=600&h=400&fit=crop",
      price: "₦5,500,000",
      period: "year",
      title: "1000sqm Waterfront Land Lease",
      address: "Lekki Phase 2, Lagos",
      beds: 0,
      baths: 0,
      sqft: "1,000",
      rating: 4.8,
      agent: "Island Properties",
    },
    {
      image:
        "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=600&h=400&fit=crop",
      price: "₦8,000,000",
      period: "year",
      title: "Prime Corner Plot on Long Lease",
      address: "Victoria Island, Lagos",
      beds: 0,
      baths: 0,
      sqft: "800",
      rating: 4.9,
      agent: "Prestige Homes",
    },
  ],
};

type CategoryKey = keyof typeof listings;

const Rent = () => {
  const [activeCategory, setActiveCategory] = useState("All Property");
  const [searchQuery, setSearchQuery] = useState("");
  const [contactCard, setContactCard] = useState<number | null>(null);

  const getListings = () => {
    if (activeCategory === "All Property") {
      return Object.values(listings).flat();
    }
    return listings[activeCategory as CategoryKey] || [];
  };

  const currentListings = getListings();

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
            <span className="text-primary-dark font-medium">
              Property For Rent
            </span>
          </div>

          {/* Hero header — with bg image */}
          <div className="relative overflow-hidden rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-10">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&h=600&fit=crop)",
              }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-primary-dark/90 via-primary-dark/75 to-primary-dark/40" />
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5" />

            <div className="relative z-10 p-8 sm:p-10 lg:p-14">
              <h1 className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3.5rem] leading-[1.1] font-bold text-white tracking-tight">
                Property <span className="text-white/70">For Rent</span>
              </h1>
              <p className="text-white/60 text-sm leading-relaxed mt-3 max-w-xl">
                Find your next rental from verified agents. Every listing
                includes verified documents, rental history, and
                escrow-protected deposit payments.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  { value: "8,570+", label: "Rentals" },
                  { value: "1,200+", label: "Agents" },
                  { value: "Escrow", label: "Deposits" },
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

              <div className="mt-8 bg-white/10 backdrop-blur-md border border-white/15 rounded-[18px] p-3 flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by location, property name, or keyword..."
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

          {/* ─── Neighbourhood Intelligence ─── */}
          <div className="mb-10 bg-white/60 backdrop-blur-sm border border-border-light rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-text-subtle text-[10px] uppercase tracking-widest">
                    Neighbourhood Intelligence
                  </p>
                  <h3 className="font-heading font-bold text-primary-dark text-base">
                    Lekki Phase 1, Lagos
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Overall: 8.3/10
                </span>
                <button className="h-9 px-4 rounded-full border border-border-light bg-white/80 backdrop-blur-sm text-primary-dark text-xs font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                  Change area
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                {
                  icon: <Zap className="w-4 h-4" />,
                  label: "Power Supply",
                  score: 7.8,
                  max: 10,
                  color: "#F5A623",
                  bg: "bg-[#FFF8ED]",
                  desc: "Moderate — 16-20hrs daily",
                },
                {
                  icon: <Droplets className="w-4 h-4" />,
                  label: "Flood Risk",
                  score: 2.1,
                  max: 10,
                  color: "#1f6f43",
                  bg: "bg-primary/5",
                  desc: "Very low — no history",
                },
                {
                  icon: <Car className="w-4 h-4" />,
                  label: "Road Quality",
                  score: 8.4,
                  max: 10,
                  color: "#1f6f43",
                  bg: "bg-primary/5",
                  desc: "Tarred, well-maintained",
                },
                {
                  icon: <ShieldCheck className="w-4 h-4" />,
                  label: "Safety Index",
                  score: 8.0,
                  max: 10,
                  color: "#1f6f43",
                  bg: "bg-primary/5",
                  desc: "Gated, 24hr security",
                },
                {
                  icon: <GraduationCap className="w-4 h-4" />,
                  label: "Schools Nearby",
                  score: 9.2,
                  max: 10,
                  color: "#1f6f43",
                  bg: "bg-primary/5",
                  desc: "12 schools within 3km",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="group relative bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl p-4 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center`}
                      style={{ color: item.color }}
                    >
                      {item.icon}
                    </div>
                    <span
                      className="font-heading font-bold text-xl"
                      style={{ color: item.color }}
                    >
                      {item.score}
                    </span>
                  </div>
                  <p className="font-heading font-semibold text-primary-dark text-[13px] leading-tight">
                    {item.label}
                  </p>
                  <div className="w-full h-1 rounded-full bg-border-light overflow-hidden mt-2.5 mb-2">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.score / item.max) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                  <p className="text-text-subtle text-[11px] leading-snug">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Category sidebar + listings */}
          <div className="flex flex-col lg:flex-row gap-8 mb-10">
            {/* Left — category nav */}
            <div className="lg:w-70 shrink-0 lg:sticky lg:top-8 lg:self-start">
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="px-5 py-4 border-b border-border-light">
                  <h3 className="font-heading font-bold text-primary-dark text-sm">
                    Categories
                  </h3>
                </div>
                <div className="p-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => setActiveCategory(cat.label)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all duration-200 ${
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
                          {cat.label} For Rent
                        </p>
                        <p className="text-text-secondary text-xs mt-0.5">
                          {cat.count.toLocaleString()} listings
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

              {/* Quick stats */}
              <div className="mt-5 bg-white/60 backdrop-blur-sm border border-border-light rounded-[20px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <h4 className="font-heading font-bold text-primary-dark text-sm mb-3">
                  Rental Snapshot
                </h4>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Avg. rent (Lagos)", value: "₦4.2M/yr" },
                    { label: "New this week", value: "518" },
                    { label: "Escrow deposits", value: "Active" },
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

            {/* Right — listing cards */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-text-secondary text-sm">
                  Showing{" "}
                  <span className="font-bold text-primary-dark">
                    {currentListings.length}
                  </span>{" "}
                  rentals in{" "}
                  <span className="font-bold text-primary-dark">
                    {activeCategory === "All Property"
                      ? "All Categories"
                      : activeCategory}
                  </span>
                </p>
                <select className="h-9 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-xs focus:outline-none focus:border-primary transition-colors appearance-none pr-8">
                  <option>Newest first</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Most popular</option>
                </select>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                {currentListings.map((listing, i) => (
                  <div
                    key={i}
                    onClick={() => setContactCard(contactCard === i ? null : i)}
                    className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    {/* Image */}
                    <div className="h-44 overflow-hidden rounded-t-[20px] relative">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-primary-dark">
                        <Star className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" />
                        {listing.rating}
                      </span>
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-white text-xs font-medium">
                        For Rent
                      </span>
                    </div>

                    {/* Glass content */}
                    <div className="mx-3 mb-3 -mt-6 relative z-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-5 pt-4 pb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                      <p className="font-heading font-bold text-primary-dark text-[18px]">
                        {listing.price}
                        <span className="text-text-subtle text-sm font-normal">
                          {" "}
                          /{listing.period}
                        </span>
                      </p>
                      <h3 className="font-heading font-bold text-primary-dark text-[15px] leading-snug mt-1 truncate">
                        {listing.title}
                      </h3>
                      <p className="text-text-secondary text-xs mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {listing.address}
                      </p>

                      <div className="h-px bg-border-light mt-3 mb-3" />

                      <div className="flex items-center gap-4 text-text-secondary text-xs pr-10">
                        {listing.beds > 0 && (
                          <span className="flex items-center gap-1.5">
                            <Bed className="w-3.5 h-3.5" />
                            {listing.beds} Beds
                          </span>
                        )}
                        {listing.baths > 0 && (
                          <span className="flex items-center gap-1.5">
                            <Bath className="w-3.5 h-3.5" />
                            {listing.baths} Baths
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Maximize className="w-3.5 h-3.5" />
                          {listing.sqft}m²
                        </span>
                      </div>
                    </div>

                    {/* Arrow — clipped circle */}
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
                          className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-primary-dark/80 backdrop-blur-md rounded-[20px]"
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
                              Contact Agent
                            </p>
                            <p className="font-heading font-bold text-white text-base mt-1">
                              {listing.agent}
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
                              href="tel:+2341234567890"
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
                              href={`https://wa.me/2341234567890?text=Hi, I'm interested in renting ${listing.title} at ${listing.address}`}
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
                            View details
                          </motion.button>

                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.3 }}
                            className="text-white/40 text-xs text-center px-6 mt-1 truncate max-w-full"
                          >
                            {listing.title}
                          </motion.p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Load more */}
              <div className="mt-10 text-center">
                <button className="h-11 px-8 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                  Load more rentals
                </button>
              </div>
            </div>
          </div>

          {/* ─── Rent Trends / Recently Reduced ─── */}
          <div className="mb-20">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#e74c3c]/10 flex items-center justify-center">
                    <TrendingDown className="w-4 h-4 text-[#e74c3c]" />
                  </div>
                  <p className="text-[#e74c3c] text-sm font-medium tracking-wide uppercase">
                    Rent Drops
                  </p>
                </div>
                <h2 className="font-heading text-[1.5rem] sm:text-[2rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
                  Recently <span className="text-primary">Reduced</span>
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed mt-2 max-w-lg">
                  Rentals with verified price reductions. Full rent history on
                  every listing — no hidden inflation.
                </p>
              </div>
              <button className="shrink-0 h-10 px-6 rounded-full border border-border bg-white/80 backdrop-blur-sm text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                View all reductions
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  image:
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
                  title: "3-Bed Flat, Lekki Phase 1",
                  address: "Lekki Phase 1, Lagos",
                  current: "₦3,000,000/yr",
                  history: [
                    { price: "₦3.8M", date: "Jan 2026" },
                    { price: "₦3.5M", date: "Feb 2026" },
                    { price: "₦3.0M", date: "Mar 2026" },
                  ],
                  drop: "21%",
                },
                {
                  image:
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
                  title: "2-Bed Flat, Victoria Island",
                  address: "Victoria Island, Lagos",
                  current: "₦5,500,000/yr",
                  history: [
                    { price: "₦6.5M", date: "Dec 2025" },
                    { price: "₦6.0M", date: "Feb 2026" },
                    { price: "₦5.5M", date: "Mar 2026" },
                  ],
                  drop: "15%",
                },
                {
                  image:
                    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
                  title: "4-Bed Duplex, Ikoyi",
                  address: "Ikoyi, Lagos",
                  current: "₦10,000,000/yr",
                  history: [
                    { price: "₦12M", date: "Nov 2025" },
                    { price: "₦11M", date: "Jan 2026" },
                    { price: "₦10M", date: "Mar 2026" },
                  ],
                  drop: "17%",
                },
                {
                  image:
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
                  title: "1-Bed Studio, Ajah",
                  address: "Ajah, Lagos",
                  current: "₦1,200,000/yr",
                  history: [
                    { price: "₦1.5M", date: "Oct 2025" },
                    { price: "₦1.3M", date: "Jan 2026" },
                    { price: "₦1.2M", date: "Mar 2026" },
                  ],
                  drop: "20%",
                },
              ].map((prop, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="h-36 overflow-hidden rounded-t-[20px] relative">
                    <img
                      src={prop.image}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#e74c3c]/90 backdrop-blur-sm text-white text-xs font-bold">
                      <ArrowDown className="w-3 h-3" />
                      {prop.drop}
                    </span>
                  </div>

                  <div className="mx-3 mb-3 -mt-5 relative z-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-4 pt-4 pb-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                    <p className="font-heading font-bold text-primary-dark text-[17px]">
                      {prop.current}
                    </p>
                    <h3 className="font-heading font-bold text-primary-dark text-[13px] leading-snug mt-1 truncate">
                      {prop.title}
                    </h3>
                    <p className="text-text-secondary text-xs mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {prop.address}
                    </p>

                    <div className="h-px bg-border-light mt-3 mb-3" />

                    <div className="relative">
                      <p className="text-text-subtle text-[10px] uppercase tracking-wide mb-2">
                        Rent History
                      </p>
                      <div className="flex flex-col gap-2">
                        {prop.history.map((h, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                  j === prop.history.length - 1
                                    ? "bg-primary"
                                    : "bg-border-light"
                                }`}
                              />
                              {j < prop.history.length - 1 && (
                                <div className="w-px h-3 bg-border-light" />
                              )}
                            </div>
                            <div className="flex items-center justify-between flex-1 min-w-0">
                              <span
                                className={`text-xs font-medium ${
                                  j === prop.history.length - 1
                                    ? "text-primary-dark font-bold"
                                    : "text-text-subtle line-through"
                                }`}
                              >
                                {h.price}
                              </span>
                              <span className="text-text-subtle text-[10px] flex items-center gap-1">
                                <Calendar className="w-2.5 h-2.5" />
                                {h.date}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-16 h-16 bg-[#1a1a1a] rounded-full absolute -right-4 -bottom-4 z-20 group-hover:bg-primary transition-colors duration-300">
                    <ArrowUpRight className="absolute top-3 left-4 w-4 h-4 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Rent;
