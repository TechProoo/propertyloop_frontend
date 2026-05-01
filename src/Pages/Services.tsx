import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  MapPin,
  ChevronDown,
  Star,
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
import { useVendors } from "../api/hooks";
import vendorsService from "../api/services/vendors";
import BookmarkButton from "../components/ui/BookmarkButton";

/* ─── Data ─── */

const categoryIcons: Record<string, React.ReactNode> = {
  Building: <HardHat className="w-5 h-5" />,
  Carpentry: <Hammer className="w-5 h-5" />,
  Cleaning: <Sparkles className="w-5 h-5" />,
  Electrical: <Zap className="w-5 h-5" />,
  HVAC: <Wind className="w-5 h-5" />,
  Landscaping: <Leaf className="w-5 h-5" />,
  Painting: <Paintbrush className="w-5 h-5" />,
  Plaster: <PipetteIcon className="w-5 h-5" />,
  Plumbing: <Wrench className="w-5 h-5" />,
};

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
  const [showFilters, setShowFilters] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [stats, setStats] = useState<any>(null);

  const minRating =
    activeRating === "Any Rating"
      ? undefined
      : parseFloat(activeRating.replace("+", ""));

  const {
    items: apiVendors,
    loading,
    updateParams,
  } = useVendors({
    category: activeCategory === "All Services" ? undefined : activeCategory,
    location: activeLocation === "All Locations" ? undefined : activeLocation,
    search: searchQuery || undefined,
    minRating,
    limit: 50,
  });

  // Fetch vendor stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await vendorsService.getPublicStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch vendor stats:", err);
      }
    };
    fetchStats();
  }, []);

  // Build categories from stats
  const categories = stats
    ? [
        {
          icon: <LayoutGrid className="w-5 h-5" />,
          label: "All Services",
          count: stats.total || 0,
        },
        ...Object.entries(stats.byCategory || {}).map(([category, count]) => ({
          icon: categoryIcons[category as keyof typeof categoryIcons] || (
            <Wrench className="w-5 h-5" />
          ),
          label: category,
          count: count as number,
        })),
      ]
    : [
        {
          icon: <LayoutGrid className="w-5 h-5" />,
          label: "All Services",
          count: 0,
        },
      ];

  useEffect(() => {
    updateParams({
      category: activeCategory === "All Services" ? undefined : activeCategory,
      location: activeLocation === "All Locations" ? undefined : activeLocation,
      search: searchQuery || undefined,
      minRating,
      limit: 50,
    });
  }, [
    activeCategory,
    activeLocation,
    searchQuery,
    activeRating,
    updateParams,
    minRating,
  ]);

  const filtered = apiVendors.map((v) => ({
    id: v.id,
    image:
      v.bannerImage ||
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
    avatar:
      v.avatarUrl ||
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face",
    name: v.name,
    category: v.category || "",
    rating: v.rating,
    jobs: v.jobsCount,
    location: v.location || "",
    price: v.priceLabel || "From ₦15,000",
    priceNum: Math.max(v.priceNum || 0, 15000),
    verified: v.verified,
    phone: v.phone || "",
    bio: v.bio || "",
  }));

  return (
    <div className="min-h-screen bg-[#f5f0eb] flex flex-col">
      <Navbar />
      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-16 flex-1">
        <div className="max-w-7xl mx-auto">
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
                Browse verified plumbers, electricians, builders, cleaners, and
                more — all KYC-verified and rated by real customers.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  { value: "1,840+", label: "Verified Vendors" },
                  { value: "100%", label: "KYC Checked" },
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
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-8 bg-white/10 backdrop-blur-md border border-white/15 rounded-[18px] p-3 flex flex-col sm:flex-row gap-3"
              >
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
                <button
                  type="button"
                  onClick={() => setShowFilters((prev) => !prev)}
                  className={`shrink-0 h-12 px-6 rounded-full backdrop-blur-sm border text-sm font-medium transition-all duration-300 inline-flex items-center gap-2 ${
                    showFilters
                      ? "bg-white text-primary-dark border-white"
                      : "bg-white/10 border-white/15 text-white hover:bg-white/20"
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>
                <button
                  type="submit"
                  className="shrink-0 h-12 px-8 rounded-full bg-white text-primary-dark text-sm font-bold hover:bg-white/90 transition-colors duration-300 inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
                >
                  <Search className="w-4 h-4" /> Search
                </button>
              </form>

              {showFilters && (
                <div className="mt-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-[18px] p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="text-white/60 text-[11px] font-medium mb-1.5 block">
                      Category
                    </label>
                    <select
                      value={activeCategory}
                      onChange={(e) => setActiveCategory(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                    >
                      {categories.map((cat) => (
                        <option
                          key={cat.label}
                          value={cat.label}
                          className="text-primary-dark"
                        >
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-[11px] font-medium mb-1.5 block">
                      Location
                    </label>
                    <select
                      value={activeLocation}
                      onChange={(e) => setActiveLocation(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                    >
                      {locations.map((loc) => (
                        <option key={loc} value={loc} className="text-primary-dark">
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-[11px] font-medium mb-1.5 block">
                      Rating
                    </label>
                    <select
                      value={activeRating}
                      onChange={(e) => setActiveRating(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                    >
                      {ratingFilters.map((rf) => (
                        <option key={rf} value={rf} className="text-primary-dark">
                          {rf}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
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

          {/* ─── Sidebar + Grid ─── */}
          <div className="flex flex-col lg:flex-row gap-8 mb-10">
            <div className="hidden lg:block lg:w-70 shrink-0 lg:sticky lg:top-8 lg:self-start">
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="px-5 py-4 border-b border-border-light">
                  <h3 className="font-heading font-bold text-primary-dark text-sm">
                    Services
                  </h3>
                </div>
                <div className="px-3 pt-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-subtle" />
                    <input
                      type="text"
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      placeholder="Search services..."
                      className="w-full h-9 pl-9 pr-3 rounded-full bg-white/60 border border-border-light text-primary-dark text-xs placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div className="p-2 max-h-105 overflow-y-auto">
                  {categories
                    .filter(
                      (cat) =>
                        cat.label === "All Services" ||
                        cat.label
                          .toLowerCase()
                          .includes(categorySearch.toLowerCase()),
                    )
                    .map((cat) => (
                      <button
                        key={cat.label}
                        onClick={() => setActiveCategory(cat.label)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200 ${activeCategory === cat.label ? "bg-primary/10 text-primary" : "text-primary-dark hover:bg-bg-accent"}`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${activeCategory === cat.label ? "bg-primary text-white" : "bg-white/80 border border-border-light text-text-secondary"}`}
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
                          className={`w-4 h-4 shrink-0 -rotate-90 ${activeCategory === cat.label ? "text-primary" : "text-text-subtle"}`}
                        />
                      </button>
                    ))}
                </div>
              </div>

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
                      className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-all duration-200 ${activeLocation === loc ? "bg-primary text-white border-primary" : "bg-white/60 text-primary-dark border-border-light hover:border-primary hover:text-primary"}`}
                    >
                      {loc === "All Locations" ? "All" : loc}
                    </button>
                  ))}
                </div>
              </div>

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
                      className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-all duration-200 inline-flex items-center gap-1.5 ${activeRating === rf ? "bg-primary text-white border-primary" : "bg-white/60 text-primary-dark border-border-light hover:border-primary hover:text-primary"}`}
                    >
                      {rf !== "Any Rating" && (
                        <Star
                          className={`w-3 h-3 ${activeRating === rf ? "text-white fill-white" : "text-[#F5A623] fill-[#F5A623]"}`}
                        />
                      )}
                      {rf}
                    </button>
                  ))}
                </div>
              </div>

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
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                {loading
                  ? // Skeleton loaders
                    Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] animate-pulse"
                      >
                        {/* Banner skeleton */}
                        <div className="h-44 bg-gray-300/50 rounded-t-[20px]" />

                        {/* Card content skeleton */}
                        <div className="mx-3 mb-3 -mt-6 relative z-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-5 pt-4 pb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                          <div className="flex items-center gap-3 mb-3">
                            {/* Avatar skeleton */}
                            <div className="w-10 h-10 rounded-full bg-gray-300/50 shrink-0" />
                            <div className="flex-1 min-w-0">
                              {/* Name skeleton */}
                              <div className="h-4 bg-gray-300/50 rounded-md mb-2 w-3/4" />
                              {/* Location skeleton */}
                              <div className="h-3 bg-gray-300/50 rounded-md w-1/2" />
                            </div>
                          </div>
                          <div className="h-px bg-gray-300/50 mb-3" />
                          {/* Stats skeleton */}
                          <div className="flex gap-4 mb-3">
                            <div className="h-3 bg-gray-300/50 rounded-md w-12" />
                            <div className="h-3 bg-gray-300/50 rounded-md w-12" />
                          </div>
                          {/* Price skeleton */}
                          <div className="h-4 bg-gray-300/50 rounded-md w-24" />
                        </div>
                      </div>
                    ))
                  : // Real vendor cards
                    filtered.map((vendor) => (
                      <div
                        key={vendor.id}
                        className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
                      >
                        <Link
                          to={`/vendor/${vendor.id}`}
                          className="flex-1 flex flex-col"
                        >
                          <div className="h-44 overflow-hidden rounded-t-[20px] relative">
                            <img
                              src={vendor.image}
                              alt={vendor.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-primary-dark text-xs font-medium">
                              {vendor.category}
                            </span>
                            <div className="absolute top-3 right-3 flex items-center gap-2">
                              <BookmarkButton
                                id={vendor.id}
                                type="service"
                                size="sm"
                              />
                              <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                                <ArrowUpRight className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          </div>

                          <div className="mx-3 mb-3 -mt-6 relative z-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-5 pt-4 pb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
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
                                  <MapPin className="w-3 h-3" />{" "}
                                  {vendor.location}
                                </p>
                              </div>
                            </div>
                            <div className="h-px bg-border-light mb-3" />
                            <div className="flex items-center justify-between text-xs pr-10">
                              <div className="flex items-center gap-4 text-text-secondary">
                                <span className="flex items-center gap-1">
                                  <Star className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" />{" "}
                                  {vendor.rating}
                                </span>
                                <span>{vendor.jobs} jobs</span>
                                <span className="flex items-center gap-1 text-primary font-medium">
                                  <Shield className="w-3.5 h-3.5" /> Verified
                                </span>
                              </div>
                            </div>
                            <p className="font-heading font-bold text-primary-dark text-sm mt-2.5">
                              {vendor.price}
                            </p>
                          </div>
                        </Link>

                        {/* Book Now button */}
                        <Link
                          to={`/book-service/${vendor.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="mx-3 mb-3 px-4 py-2.5 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors text-center"
                        >
                          Book Now
                        </Link>
                      </div>
                    ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-bg-accent border border-border-light flex items-center justify-center mx-auto mb-4">
                    <Wrench className="w-7 h-7 text-text-subtle" />
                  </div>
                  <h3 className="font-heading font-bold text-primary-dark text-lg">
                    No vendors found
                  </h3>
                  <p className="text-text-secondary text-sm mt-2">
                    Try adjusting your filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("All Services");
                      setActiveLocation("All Locations");
                      setActiveRating("Any Rating");
                    }}
                    className="mt-4 h-10 px-6 rounded-full border border-border-light bg-white/80 text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {filtered.length > 0 && (
                <div className="mt-10 text-center">
                  <button className="h-11 px-8 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                    Load more vendors
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ─── Trust Banner ─── */}
          <div className="mb-20 bg-white/60 backdrop-blur-sm border border-border-light rounded-[20px] px-8 py-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-heading font-bold text-primary-dark text-lg">
                Every vendor is KYC-verified
              </h3>
              <p className="text-text-secondary text-sm mt-1">
                Identity-checked, rated, and reviewed. Browse profiles, message
                vendors directly, and book with confidence.
              </p>
            </div>
            <Link
              to="/onboarding"
              className="shrink-0 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors duration-300 inline-flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Become a vendor
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
