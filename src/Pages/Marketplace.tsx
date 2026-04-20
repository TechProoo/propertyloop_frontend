import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  MapPin,
  ChevronDown,
  Star,
  ShieldCheck,
  CheckCircle,
  Package,
  LayoutGrid,
  Boxes,
  Pipette,
  Paintbrush,
  Zap,
  Hammer,
  DoorOpen,
  Sparkles,
  CircleDot,
  Layers,
  TreePine,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { useProducts } from "../api/hooks";
import BookmarkButton from "../components/ui/BookmarkButton";

/* ─── Data ─── */

const categories = [
  {
    icon: <LayoutGrid className="w-5 h-5" />,
    label: "All Materials",
    count: 2450,
  },
  {
    icon: <Boxes className="w-5 h-5" />,
    label: "Cement & Concrete",
    count: 380,
  },
  { icon: <Layers className="w-5 h-5" />, label: "Roofing", count: 290 },
  {
    icon: <CircleDot className="w-5 h-5" />,
    label: "Tiles & Flooring",
    count: 345,
  },
  {
    icon: <Pipette className="w-5 h-5" />,
    label: "Plumbing Materials",
    count: 210,
  },
  {
    icon: <Zap className="w-5 h-5" />,
    label: "Electrical Materials",
    count: 265,
  },
  {
    icon: <Paintbrush className="w-5 h-5" />,
    label: "Paint & Finishes",
    count: 195,
  },
  { icon: <Hammer className="w-5 h-5" />, label: "Steel & Iron", count: 180 },
  {
    icon: <TreePine className="w-5 h-5" />,
    label: "Wood & Timber",
    count: 155,
  },
  {
    icon: <DoorOpen className="w-5 h-5" />,
    label: "Doors & Windows",
    count: 170,
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    label: "Sanitary Ware",
    count: 160,
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
];

/* ─── Component ─── */

const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState("All Materials");
  const [activeLocation, setActiveLocation] = useState("All Locations");
  const [searchQuery, setSearchQuery] = useState("");

  const { items: apiProducts, updateParams } = useProducts({
    category: activeCategory === "All Materials" ? undefined : activeCategory,
    location: activeLocation === "All Locations" ? undefined : activeLocation,
    search: searchQuery || undefined,
    limit: 50,
  });

  useEffect(() => {
    updateParams({
      category: activeCategory === "All Materials" ? undefined : activeCategory,
      location: activeLocation === "All Locations" ? undefined : activeLocation,
      search: searchQuery || undefined,
      limit: 50,
    });
  }, [activeCategory, activeLocation, searchQuery, updateParams]);

  const filtered = apiProducts.map((p) => ({
    id: p.id,
    image: p.coverImage,
    name: p.name,
    supplier: p.supplier,
    category: p.category,
    price: p.priceNaira,
    priceLabel: p.priceLabel,
    unit: p.unit,
    minOrder: p.minOrder,
    location: p.location,
    rating: p.rating,
    reviews: p.reviewsCount,
    verified: p.verified,
    phone: p.phone,
    description: p.description,
    inStock: p.inStock,
  }));

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />

      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">
              Building Materials
            </span>
          </div>

          {/* ─── Hero ─── */}
          <div className="relative overflow-hidden rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-10">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&h=600&fit=crop)",
              }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-primary-dark/90 via-primary-dark/75 to-primary-dark/40" />
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5" />

            <div className="relative z-10 p-8 sm:p-10 lg:p-14">
              <h1 className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3.5rem] leading-[1.1] font-bold text-white tracking-tight">
                Building <span className="text-white/70">Materials</span>
              </h1>
              <p className="text-white/60 text-sm leading-relaxed mt-3 max-w-xl">
                Source quality building materials from verified Nigerian
                suppliers. Compare prices, check reviews, and order directly —
                all within the PropertyLoop ecosystem.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  { value: "500+", label: "Suppliers" },
                  { value: "12", label: "Categories" },
                  { value: "Verified", label: "Sellers" },
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
                    placeholder="Search by material, product, or supplier..."
                    className="w-full h-12 pl-11 pr-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
                <button className="shrink-0 h-12 px-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white text-sm font-medium hover:bg-white/20 transition-all duration-300 inline-flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>
                <button className="shrink-0 h-12 px-8 rounded-full bg-white text-primary-dark text-sm font-bold hover:bg-white/90 transition-colors duration-300 inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
                  <Search className="w-4 h-4" /> Search
                </button>
              </div>
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
                    Categories
                  </h3>
                </div>
                <div className="p-2 max-h-115 overflow-y-auto">
                  {categories.map((cat) => (
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
                          {cat.count} products
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

              <div className="mt-5 bg-white/60 backdrop-blur-sm border border-border-light rounded-[20px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <h4 className="font-heading font-bold text-primary-dark text-sm mb-3">
                  Marketplace Stats
                </h4>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Total suppliers", value: "500+" },
                    { label: "Avg. delivery", value: "2–5 days" },
                    { label: "Verified sellers", value: "98%" },
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

            {/* Right grid */}
            <div className="flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
                <p className="text-text-secondary text-sm">
                  Showing{" "}
                  <span className="font-bold text-primary-dark">
                    {filtered.length}
                  </span>{" "}
                  products in{" "}
                  <span className="font-bold text-primary-dark">
                    {activeCategory}
                  </span>
                </p>
                <select className="h-9 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-xs focus:outline-none focus:border-primary transition-colors appearance-none pr-8">
                  <option>Most popular</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Top rated</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                {filtered.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 block"
                  >
                    <div className="h-44 overflow-hidden rounded-t-[20px] relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-primary-dark text-xs font-medium">
                        {product.category}
                      </span>
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <BookmarkButton
                          id={product.id}
                          type="product"
                          size="sm"
                        />
                        <span className="px-2.5 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-white text-xs font-bold">
                          {product.priceLabel} /{product.unit}
                        </span>
                      </div>
                    </div>

                    <div className="mx-3 mb-3 -mt-6 relative z-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-5 pt-4 pb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                      <h3 className="font-heading font-bold text-primary-dark text-[15px] leading-snug truncate">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-text-secondary text-xs">
                          {product.supplier}
                        </span>
                        {product.verified && (
                          <CheckCircle className="w-3.5 h-3.5 text-primary" />
                        )}
                      </div>
                      <p className="text-text-secondary text-xs mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {product.location}
                      </p>
                      <div className="h-px bg-border-light mt-3 mb-3" />
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3 text-text-secondary">
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" />{" "}
                            {product.rating}
                          </span>
                          <span>{product.reviews} reviews</span>
                        </div>
                        <span className="text-text-subtle">
                          {product.minOrder}
                        </span>
                      </div>
                    </div>

                    <div className="w-12 h-12 bg-[#1a1a1a] rounded-full absolute -right-3 -bottom-3 z-20 group-hover:bg-primary transition-colors duration-300 flex items-center justify-center">
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    </div>
                  </Link>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-bg-accent border border-border-light flex items-center justify-center mx-auto mb-4">
                    <Package className="w-7 h-7 text-text-subtle" />
                  </div>
                  <h3 className="font-heading font-bold text-primary-dark text-lg">
                    No products found
                  </h3>
                  <p className="text-text-secondary text-sm mt-2">
                    Try adjusting your filters or search query.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("All Materials");
                      setActiveLocation("All Locations");
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
                    Load more products
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ─── Trust Banner ─── */}
          <div className="mb-20 bg-white/60 backdrop-blur-sm border border-border-light rounded-[20px] px-8 py-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-heading font-bold text-primary-dark text-lg">
                All suppliers are verified
              </h3>
              <p className="text-text-secondary text-sm mt-1">
                Every supplier on PropertyLoop Marketplace is verified before
                listing. We check business registration, product quality, and
                delivery reliability.
              </p>
            </div>
            <Link
              to="/onboarding"
              className="shrink-0 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors duration-300 inline-flex items-center gap-2"
            >
              <Package className="w-4 h-4" /> Become a supplier
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
