import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useListings } from "../api/hooks";
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
  X,
  Zap,
  Droplets,
  ShieldCheck,
  GraduationCap,
  Car,
  TrendingDown,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
// listings now fetched from API via useListings hook
import PropertyMap from "../components/ui/PropertyMap";
import type { MapListing } from "../components/ui/PropertyMap";
import BookmarkButton from "../components/ui/BookmarkButton";
import EmptyState from "../components/ui/EmptyState";

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

const rentPropertyTypeMap: Record<string, string> = {
  "Flats & Apartments": "Flat / Apartment",
  Houses: "House",
  "All Property": "",
};

const Rent = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All Property");
  const [searchQuery, setSearchQuery] = useState("");
  const [contactCard, setContactCard] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [priceRange, setPriceRange] = useState("any");
  const [bedsFilter, setBedsFilter] = useState("any");
  const [bathsFilter, setBathsFilter] = useState("any");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const {
    items: apiListings,
    loading: listingsLoading,
    updateParams,
  } = useListings({
    type: "RENT",
    limit: 50,
  });

  useEffect(() => {
    const p: Record<string, unknown> = { type: "RENT" as const, limit: 50 };
    if (
      activeCategory !== "All Property" &&
      rentPropertyTypeMap[activeCategory]
    ) {
      p.propertyType = rentPropertyTypeMap[activeCategory];
    }
    if (searchQuery.trim()) p.search = searchQuery;
    if (bedsFilter !== "any") p.minBeds = parseInt(bedsFilter);
    if (bathsFilter !== "any") p.minBaths = parseInt(bathsFilter);
    if (priceRange !== "any") {
      const [min, max] = priceRange.split("-").map(Number);
      if (min) p.minPrice = min;
      if (max) p.maxPrice = max;
    }
    updateParams(p as any);
  }, [
    activeCategory,
    searchQuery,
    priceRange,
    bedsFilter,
    bathsFilter,
    updateParams,
  ]);

  const currentListings = apiListings.map((l) => ({
    id: l.id,
    image: l.coverImage,
    price: l.priceLabel,
    title: l.title,
    address: l.address,
    beds: l.beds,
    baths: l.baths,
    sqft: l.sqft,
    rating: l.rating,
    agent: l.agent?.name || l.agent?.agency || "Agent",
    period: l.period || "/year",
    lat: 6.45 + Math.random() * 0.03,
    lng: 3.4 + Math.random() * 0.08,
  }));

  const getPropertyLink = (title: string) => {
    const match = apiListings.find((l) => l.title === title);
    return match ? `/property/${match.id}` : "#";
  };

  const mapListings: MapListing[] = currentListings.map((l, i) => ({
    lat: l.lat,
    lng: l.lng,
    price: l.price,
    title: l.title,
    address: l.address,
    beds: l.beds,
    baths: l.baths,
    sqft: l.sqft,
    index: i,
  }));

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
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`shrink-0 h-12 px-6 rounded-full backdrop-blur-sm border text-sm font-medium transition-all duration-300 inline-flex items-center gap-2 ${
                    showFilters
                      ? "bg-white text-primary-dark border-white"
                      : "bg-white/10 border-white/15 text-white hover:bg-white/20"
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
                <button className="shrink-0 h-12 px-8 rounded-full bg-white text-primary-dark text-sm font-bold hover:bg-white/90 transition-colors duration-300 inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>

              {/* ─── Advanced Filters ─── */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-[18px] p-4 flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <label className="text-white/50 text-[11px] font-medium mb-1.5 block">
                          Rent Range (Annual)
                        </label>
                        <select
                          value={priceRange}
                          onChange={(e) => setPriceRange(e.target.value)}
                          className="w-full h-10 px-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white text-sm focus:outline-none focus:border-white/30 transition-colors appearance-none"
                        >
                          <option value="any" className="text-primary-dark">
                            Any Price
                          </option>
                          <option
                            value="0-3000000"
                            className="text-primary-dark"
                          >
                            Under ₦3M/yr
                          </option>
                          <option
                            value="3000000-8000000"
                            className="text-primary-dark"
                          >
                            ₦3M – ₦8M/yr
                          </option>
                          <option
                            value="8000000-15000000"
                            className="text-primary-dark"
                          >
                            ₦8M – ₦15M/yr
                          </option>
                          <option
                            value="15000000-0"
                            className="text-primary-dark"
                          >
                            ₦15M+/yr
                          </option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="text-white/50 text-[11px] font-medium mb-1.5 block">
                          Bedrooms
                        </label>
                        <select
                          value={bedsFilter}
                          onChange={(e) => setBedsFilter(e.target.value)}
                          className="w-full h-10 px-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white text-sm focus:outline-none focus:border-white/30 transition-colors appearance-none"
                        >
                          <option value="any" className="text-primary-dark">
                            Any
                          </option>
                          <option value="1" className="text-primary-dark">
                            1+
                          </option>
                          <option value="2" className="text-primary-dark">
                            2+
                          </option>
                          <option value="3" className="text-primary-dark">
                            3+
                          </option>
                          <option value="4" className="text-primary-dark">
                            4+
                          </option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="text-white/50 text-[11px] font-medium mb-1.5 block">
                          Bathrooms
                        </label>
                        <select
                          value={bathsFilter}
                          onChange={(e) => setBathsFilter(e.target.value)}
                          className="w-full h-10 px-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white text-sm focus:outline-none focus:border-white/30 transition-colors appearance-none"
                        >
                          <option value="any" className="text-primary-dark">
                            Any
                          </option>
                          <option value="1" className="text-primary-dark">
                            1+
                          </option>
                          <option value="2" className="text-primary-dark">
                            2+
                          </option>
                          <option value="3" className="text-primary-dark">
                            3+
                          </option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => {
                            setPriceRange("any");
                            setBedsFilter("any");
                            setBathsFilter("any");
                          }}
                          className="h-10 px-5 rounded-full bg-white/10 border border-white/15 text-white/70 text-xs font-medium hover:bg-white/20 transition-all"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ─── Map Section ─── */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <h3 className="font-heading font-bold text-primary-dark text-sm">
                  Map View
                </h3>
                <span className="text-text-subtle text-xs">
                  — {currentListings.length} rentals
                </span>
              </div>
              <button
                onClick={() => setShowMap(!showMap)}
                className="h-8 px-4 rounded-full bg-white/80 border border-border-light text-primary-dark text-xs font-medium hover:bg-primary hover:text-white hover:border-primary transition-all"
              >
                {showMap ? "Hide Map" : "Show Map"}
              </button>
            </div>
            <AnimatePresence>
              {showMap && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <PropertyMap
                    listings={mapListings}
                    activeIndex={hoveredCard}
                    onMarkerClick={(i) =>
                      setContactCard(contactCard === i ? null : i)
                    }
                    className="h-100"
                  />
                </motion.div>
              )}
            </AnimatePresence>
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

          {/* Category sidebar + listings */}
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
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
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
              {listingsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden animate-pulse"
                    >
                      <div className="h-44 bg-border-light/60" />
                      <div className="p-5 space-y-3">
                        <div className="h-5 bg-border-light/60 rounded-full w-1/3" />
                        <div className="h-4 bg-border-light/60 rounded-full w-2/3" />
                        <div className="h-3 bg-border-light/60 rounded-full w-1/2" />
                        <div className="h-px bg-border-light my-2" />
                        <div className="flex gap-4">
                          <div className="h-3 bg-border-light/60 rounded-full w-16" />
                          <div className="h-3 bg-border-light/60 rounded-full w-16" />
                          <div className="h-3 bg-border-light/60 rounded-full w-16" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : currentListings.length === 0 ? (
                <EmptyState
                  icon={<Search className="w-10 h-10" />}
                  title="No Properties Found"
                  description={
                    searchQuery
                      ? `No rental properties match "${searchQuery}". Try adjusting your search criteria.`
                      : "No rental properties available for your current filters. Try adjusting your search criteria or browse our featured categories."
                  }
                  actions={[
                    {
                      label: "Clear All Filters",
                      icon: <LayoutGrid className="w-4 h-4" />,
                      onClick: () => {
                        setSearchQuery("");
                        setActiveCategory("All Property");
                        setPriceRange("any");
                        setBedsFilter("any");
                        setBathsFilter("any");
                      },
                      variant: "primary",
                    },
                    {
                      label: "Browse All",
                      onClick: () => setActiveCategory("All Property"),
                      variant: "secondary",
                    },
                  ]}
                  suggestions={categories.slice(0, 4).map((cat) => ({
                    icon: cat.icon,
                    label: cat.label,
                    onClick: () => setActiveCategory(cat.label),
                  }))}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                  {currentListings.map((listing, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        if (!isLoggedIn) {
                          navigate("/onboarding");
                          return;
                        }
                        setContactCard(contactCard === i ? null : i);
                      }}
                      onMouseEnter={() => setHoveredCard(i)}
                      onMouseLeave={() => setHoveredCard(null)}
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
                        <div className="absolute top-3 right-3 flex items-center gap-2">
                          <BookmarkButton
                            id={`rent-${listing.title.replace(/\s/g, "-").toLowerCase()}`}
                            type="property"
                            size="sm"
                          />
                          <span className="px-2.5 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-white text-xs font-medium">
                            For Rent
                          </span>
                        </div>
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
                            </div>

                            <motion.button
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                delay: 0.4,
                                duration: 0.35,
                                ease: [0.23, 1, 0.32, 1],
                              }}
                              onClick={() =>
                                navigate(getPropertyLink(listing.title))
                              }
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
              )}

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
              <a
                href="/reductions"
                className="shrink-0 h-10 px-6 rounded-full border border-border bg-white/80 backdrop-blur-sm text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 inline-flex items-center"
              >
                View all reductions
              </a>
            </div>

            {/* Empty state for rent reductions */}
            <div className="flex flex-col items-center justify-center py-24 text-center rounded-[28px] bg-white/30 border border-border-light">
              <div className="w-20 h-20 rounded-full bg-[#e74c3c]/10 flex items-center justify-center mb-4">
                <TrendingDown className="w-8 h-8 text-[#e74c3c]/50" />
              </div>
              <h3 className="font-heading font-bold text-primary-dark text-lg">
                Rent Reductions Coming Soon
              </h3>
              <p className="text-text-secondary text-sm mt-2 max-w-sm">
                Track rentals with price drops and full rent history. See exactly how prices have changed over time.
              </p>
              <a
                href="/reductions"
                className="mt-6 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors inline-flex items-center"
              >
                Browse Reductions
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Rent;
