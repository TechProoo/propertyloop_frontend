import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Bed,
  Bath,
  Maximize,
  Search,
  SlidersHorizontal,
  MapPin,
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
  Calendar,
  Wifi,
  ParkingCircle,
  UtensilsCrossed,
  Dumbbell,
  Waves,
  Coffee,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import BookmarkButton from "../components/ui/BookmarkButton";

/* ─── Data ─── */

const categories = [
  { icon: <Waves className="w-5 h-5" />, label: "Luxury Stays", count: 1240 },
  { icon: <Coffee className="w-5 h-5" />, label: "Studios", count: 2180 },
  { icon: <Wifi className="w-5 h-5" />, label: "Work-Friendly", count: 980 },
  {
    icon: <UtensilsCrossed className="w-5 h-5" />,
    label: "Self-Catering",
    count: 1560,
  },
  {
    icon: <Star className="w-5 h-5" />,
    label: "All Shortlets",
    count: 5960,
  },
];

const listings = {
  "Luxury Stays": [
    {
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
      price: "₦85,000",
      period: "night",
      title: "Luxury Penthouse with City View",
      address: "Victoria Island, Lagos",
      beds: 3,
      baths: 2,
      sqft: "2,400",
      rating: 4.9,
      agent: "Island Properties",
      amenities: ["WiFi", "Pool", "Gym", "Parking"],
    },
    {
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
      price: "₦150,000",
      period: "night",
      title: "Waterfront Villa with Private Pool",
      address: "Banana Island, Lagos",
      beds: 4,
      baths: 3,
      sqft: "4,200",
      rating: 4.9,
      agent: "Royal Estate Advisors",
      amenities: ["WiFi", "Pool", "Chef", "Security"],
    },
    {
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
      price: "₦120,000",
      period: "night",
      title: "Designer Duplex with Rooftop Terrace",
      address: "Ikoyi, Lagos",
      beds: 3,
      baths: 3,
      sqft: "3,200",
      rating: 4.8,
      agent: "Prestige Homes",
      amenities: ["WiFi", "Terrace", "Gym", "Parking"],
    },
  ],
  Studios: [
    {
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
      price: "₦35,000",
      period: "night",
      title: "Chic Studio in the Heart of Lekki",
      address: "Lekki Phase 1, Lagos",
      beds: 1,
      baths: 1,
      sqft: "550",
      rating: 4.7,
      agent: "Prime Realty",
      amenities: ["WiFi", "Kitchen", "AC"],
    },
    {
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
      price: "₦28,000",
      period: "night",
      title: "Modern Studio with Workspace",
      address: "Yaba, Lagos",
      beds: 1,
      baths: 1,
      sqft: "480",
      rating: 4.6,
      agent: "Sapphire Homes",
      amenities: ["WiFi", "Desk", "Kitchen"],
    },
    {
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
      price: "₦42,000",
      period: "night",
      title: "Premium Studio with Balcony",
      address: "Victoria Island, Lagos",
      beds: 1,
      baths: 1,
      sqft: "620",
      rating: 4.8,
      agent: "Island Properties",
      amenities: ["WiFi", "Balcony", "Pool"],
    },
  ],
  "Work-Friendly": [
    {
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
      price: "₦55,000",
      period: "night",
      title: "Executive Apartment with Office",
      address: "Ikeja GRA, Lagos",
      beds: 2,
      baths: 1,
      sqft: "1,200",
      rating: 4.8,
      agent: "Horizon Properties",
      amenities: ["WiFi", "Office", "Printer", "Parking"],
    },
    {
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
      price: "₦48,000",
      period: "night",
      title: "Tech-Ready Flat Near Airport",
      address: "Ikeja, Lagos",
      beds: 2,
      baths: 2,
      sqft: "1,100",
      rating: 4.7,
      agent: "Horizon Properties",
      amenities: ["WiFi", "Desk", "Kitchen", "AC"],
    },
    {
      image:
        "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=600&h=400&fit=crop",
      price: "₦65,000",
      period: "night",
      title: "Business Suite with Meeting Room",
      address: "Victoria Island, Lagos",
      beds: 2,
      baths: 2,
      sqft: "1,500",
      rating: 4.9,
      agent: "Island Properties",
      amenities: ["WiFi", "Meeting Room", "Concierge"],
    },
  ],
  "Self-Catering": [
    {
      image:
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop",
      price: "₦45,000",
      period: "night",
      title: "Family Apartment with Full Kitchen",
      address: "Ajah, Lagos",
      beds: 2,
      baths: 2,
      sqft: "1,400",
      rating: 4.7,
      agent: "Metro Living Realty",
      amenities: ["WiFi", "Kitchen", "Washer", "Parking"],
    },
    {
      image:
        "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=400&fit=crop",
      price: "₦65,000",
      period: "night",
      title: "Spacious 3-Bed with Chef's Kitchen",
      address: "Lekki Phase 1, Lagos",
      beds: 3,
      baths: 2,
      sqft: "2,100",
      rating: 4.8,
      agent: "Prime Realty",
      amenities: ["WiFi", "Kitchen", "Garden", "BBQ"],
    },
    {
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
      price: "₦38,000",
      period: "night",
      title: "Cosy 1-Bed with Kitchenette",
      address: "Gbagada, Lagos",
      beds: 1,
      baths: 1,
      sqft: "700",
      rating: 4.6,
      agent: "Cityscape Properties",
      amenities: ["WiFi", "Kitchenette", "AC"],
    },
  ],
};

type CategoryKey = keyof typeof listings;

/* ─── Component ─── */

const Shortlet = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All Shortlets");
  const [searchQuery, setSearchQuery] = useState("");
  const [contactCard, setContactCard] = useState<number | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const getListings = () => {
    if (activeCategory === "All Shortlets") {
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
              Shortlet Stays
            </span>
          </div>

          {/* ─── Hero ─── */}
          <div className="relative overflow-hidden rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-10">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1400&h=600&fit=crop)",
              }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-primary-dark/90 via-primary-dark/75 to-primary-dark/40" />
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5" />

            <div className="relative z-10 p-8 sm:p-10 lg:p-14">
              <h1 className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3.5rem] leading-[1.1] font-bold text-white tracking-tight">
                Shortlet <span className="text-white/70">Stays</span>
              </h1>
              <p className="text-white/60 text-sm leading-relaxed mt-3 max-w-xl">
                Book verified short-term apartments by the night. Instant
                booking, transparent pricing, and Paystack-powered payments.
                Every stay is managed by a verified agent.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  { value: "5,960+", label: "Shortlets" },
                  { value: "Instant", label: "Booking" },
                  { value: "Paystack", label: "Payments" },
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
                    placeholder="Search by location or property name..."
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

          {/* ─── Date Picker Bar ─── */}
          <div className="mb-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] px-6 py-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2 text-primary shrink-0">
                <Calendar className="w-5 h-5" />
                <span className="font-heading font-bold text-primary-dark text-sm">
                  Your Dates
                </span>
              </div>
              <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
                <div className="flex-1 relative">
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full h-11 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="Check-in"
                  />
                </div>
                <div className="flex-1 relative">
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full h-11 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="Check-out"
                  />
                </div>
                <select className="h-11 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors appearance-none sm:w-48">
                  <option>All Lagos</option>
                  <option>Victoria Island</option>
                  <option>Lekki</option>
                  <option>Ikoyi</option>
                  <option>Ajah</option>
                  <option>Banana Island</option>
                  <option>Ikeja</option>
                  <option>Yaba</option>
                  <option>Gbagada</option>
                </select>
              </div>
              <button className="shrink-0 h-11 px-6 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors duration-300 inline-flex items-center gap-2 shadow-lg shadow-glow/40">
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>

          {/* ─── Neighbourhood Intelligence ─── */}
          <div className="mb-10 bg-white/60 backdrop-blur-sm border border-border-light rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-text-subtle text-[10px] uppercase tracking-widest">
                    Neighbourhood Intelligence
                  </p>
                  <h3 className="font-heading font-bold text-primary-dark text-base">
                    Victoria Island, Lagos
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Overall: 8.7/10
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
                  score: 9.2,
                  max: 10,
                  color: "#1f6f43",
                  bg: "bg-primary/5",
                  desc: "Excellent — 22-24hrs daily",
                },
                {
                  icon: <Droplets className="w-4 h-4" />,
                  label: "Flood Risk",
                  score: 3.5,
                  max: 10,
                  color: "#F5A623",
                  bg: "bg-[#FFF8ED]",
                  desc: "Low — minor seasonal",
                },
                {
                  icon: <Car className="w-4 h-4" />,
                  label: "Road Quality",
                  score: 8.8,
                  max: 10,
                  color: "#1f6f43",
                  bg: "bg-primary/5",
                  desc: "Excellent, well-paved",
                },
                {
                  icon: <ShieldCheck className="w-4 h-4" />,
                  label: "Safety Index",
                  score: 9.0,
                  max: 10,
                  color: "#1f6f43",
                  bg: "bg-primary/5",
                  desc: "High security presence",
                },
                {
                  icon: <GraduationCap className="w-4 h-4" />,
                  label: "Nightlife & Dining",
                  score: 9.5,
                  max: 10,
                  color: "#1f6f43",
                  bg: "bg-primary/5",
                  desc: "Restaurants, bars, lounges",
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

          {/* ─── Mobile Category Strip ─── */}
          <div className="lg:hidden overflow-x-auto -mx-6 px-6 pb-4 mb-6">
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border whitespace-nowrap transition-all ${
                    activeCategory === cat.label
                      ? "bg-primary text-white border-primary"
                      : "bg-white/80 text-primary-dark border-border-light hover:border-primary"
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* ─── Category sidebar + listings ─── */}
          <div className="flex flex-col lg:flex-row gap-8 mb-10">
            {/* Left — category nav */}
            <div className="hidden lg:block lg:w-70 shrink-0 lg:sticky lg:top-8 lg:self-start">
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
                          {cat.label}
                        </p>
                        <p className="text-text-secondary text-xs mt-0.5">
                          {cat.count.toLocaleString()} stays
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
                  Shortlet Snapshot
                </h4>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Avg. nightly rate", value: "₦65,000" },
                    { label: "New this week", value: "124" },
                    { label: "Instant booking", value: "Available" },
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

              {/* Amenities filter */}
              <div className="mt-5 bg-white/60 backdrop-blur-sm border border-border-light rounded-[20px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <h4 className="font-heading font-bold text-primary-dark text-sm mb-3">
                  Popular Amenities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: <Wifi className="w-3 h-3" />, label: "WiFi" },
                    {
                      icon: <Waves className="w-3 h-3" />,
                      label: "Pool",
                    },
                    {
                      icon: <ParkingCircle className="w-3 h-3" />,
                      label: "Parking",
                    },
                    {
                      icon: <Dumbbell className="w-3 h-3" />,
                      label: "Gym",
                    },
                    {
                      icon: <UtensilsCrossed className="w-3 h-3" />,
                      label: "Kitchen",
                    },
                  ].map((a) => (
                    <button
                      key={a.label}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border-light bg-white/60 text-text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all"
                    >
                      {a.icon}
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — listing cards */}
            <div className="flex-1">
              {/* Results header */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
                <p className="text-text-secondary text-sm">
                  Showing{" "}
                  <span className="font-bold text-primary-dark">
                    {currentListings.length}
                  </span>{" "}
                  stays in{" "}
                  <span className="font-bold text-primary-dark">
                    {activeCategory === "All Shortlets"
                      ? "All Categories"
                      : activeCategory}
                  </span>
                </p>
                <select className="h-9 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-xs focus:outline-none focus:border-primary transition-colors appearance-none pr-8">
                  <option>Top rated</option>
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
                    <div className="h-48 overflow-hidden rounded-t-[20px] relative">
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
                        {listing.price}
                        <span className="text-white/60">/{listing.period}</span>
                      </span>
                      <BookmarkButton
                        id={`shortlet-${listing.title.replace(/\s/g, "-").toLowerCase()}`}
                        type="property"
                        className="absolute bottom-3 right-3"
                        size="sm"
                      />
                    </div>

                    {/* Glass content */}
                    <div className="mx-3 mb-3 -mt-6 relative z-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-5 pt-4 pb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                      <h3 className="font-heading font-bold text-primary-dark text-[15px] leading-snug truncate">
                        {listing.title}
                      </h3>
                      <p className="text-text-secondary text-xs mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {listing.address}
                      </p>

                      <div className="h-px bg-border-light mt-3 mb-3" />

                      <div className="flex items-center justify-between text-xs pr-10">
                        <div className="flex items-center gap-4 text-text-secondary">
                          <span className="flex items-center gap-1.5">
                            <Bed className="w-3.5 h-3.5" />
                            {listing.beds} Bed{listing.beds > 1 ? "s" : ""}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Bath className="w-3.5 h-3.5" />
                            {listing.baths} Bath{listing.baths > 1 ? "s" : ""}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Maximize className="w-3.5 h-3.5" />
                            {listing.sqft}m²
                          </span>
                        </div>
                      </div>

                      {/* Amenity pills */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {listing.amenities.slice(0, 3).map((a) => (
                          <span
                            key={a}
                            className="px-2 py-0.5 rounded-full bg-bg-accent text-text-secondary text-[10px] font-medium border border-border-light"
                          >
                            {a}
                          </span>
                        ))}
                        {listing.amenities.length > 3 && (
                          <span className="px-2 py-0.5 rounded-full bg-bg-accent text-text-subtle text-[10px] font-medium border border-border-light">
                            +{listing.amenities.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="w-12 h-12 bg-[#1a1a1a] rounded-full absolute -right-3 -bottom-3 z-20 group-hover:bg-primary transition-colors duration-300 flex items-center justify-center">
                      <ArrowUpRight className="w-5 h-5 text-white" />
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
                              Book via Agent
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
                          </div>

                          <motion.button
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.4,
                              duration: 0.35,
                              ease: [0.23, 1, 0.32, 1],
                            }}
                            onClick={() => navigate("/shortlet-booking")}
                            className="mt-1 h-10 px-6 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-medium hover:bg-white hover:text-primary-dark transition-all duration-300 inline-flex items-center gap-2"
                          >
                            <Calendar className="w-4 h-4" />
                            Book Now
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
                  Load more shortlets
                </button>
              </div>
            </div>
          </div>

          {/* ─── Trust banner ─── */}
          <div className="mb-20 bg-white/60 backdrop-blur-sm border border-border-light rounded-[20px] px-8 py-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-heading font-bold text-primary-dark text-lg">
                Every stay is Paystack-protected
              </h3>
              <p className="text-text-secondary text-sm mt-1">
                All shortlet bookings are processed through Paystack with escrow
                protection. Your payment is held securely until check-in is
                confirmed — giving you peace of mind on every booking.
              </p>
            </div>
            <Link
              to="/onboarding"
              className="shrink-0 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors duration-300 inline-flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              List your shortlet
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shortlet;
