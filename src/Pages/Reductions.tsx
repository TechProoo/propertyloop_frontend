import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  TrendingDown,
  MapPin,
  Search,
  Bed,
  Bath,
  Maximize,
  Star,
  Calendar,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";

/* ─── Data ─── */

const reductions = [
  {
    id: "villa-lekki-reduced",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    title: "4-Bed Villa, Lekki Phase 1",
    address: "Lekki Phase 1, Lagos",
    current: "₦165,000,000",
    original: "₦185,000,000",
    drop: "11%",
    beds: 4,
    baths: 3,
    sqft: "6,800",
    rating: 4.9,
    type: "sale" as const,
    agent: "Prime Realty Lagos",
    lastReduced: "Mar 2026",
    history: [
      { price: "₦185M", date: "Jan 2026" },
      { price: "₦175M", date: "Feb 2026" },
      { price: "₦165M", date: "Mar 2026" },
    ],
  },
  {
    id: "penthouse-vi-reduced",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
    title: "Penthouse, Victoria Island",
    address: "Victoria Island, Lagos",
    current: "₦290,000,000",
    original: "₦320,000,000",
    drop: "9%",
    beds: 4,
    baths: 3,
    sqft: "3,800",
    rating: 4.9,
    type: "sale" as const,
    agent: "Island Properties",
    lastReduced: "Mar 2026",
    history: [
      { price: "₦320M", date: "Dec 2025" },
      { price: "₦305M", date: "Feb 2026" },
      { price: "₦290M", date: "Mar 2026" },
    ],
  },
  {
    id: "duplex-ikoyi-reduced",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
    title: "Waterfront Duplex, Ikoyi",
    address: "Ikoyi, Lagos",
    current: "₦410,000,000",
    original: "₦450,000,000",
    drop: "9%",
    beds: 6,
    baths: 5,
    sqft: "12,000",
    rating: 4.9,
    type: "sale" as const,
    agent: "Prestige Homes",
    lastReduced: "Mar 2026",
    history: [
      { price: "₦450M", date: "Nov 2025" },
      { price: "₦430M", date: "Jan 2026" },
      { price: "₦410M", date: "Mar 2026" },
    ],
  },
  {
    id: "terrace-ajah-reduced",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    title: "Terrace House, Ajah",
    address: "Ajah, Lagos",
    current: "₦62,000,000",
    original: "₦75,000,000",
    drop: "17%",
    beds: 3,
    baths: 2,
    sqft: "2,100",
    rating: 4.7,
    type: "sale" as const,
    agent: "Metro Living Realty",
    lastReduced: "Mar 2026",
    history: [
      { price: "₦75M", date: "Oct 2025" },
      { price: "₦68M", date: "Jan 2026" },
      { price: "₦62M", date: "Mar 2026" },
    ],
  },
  {
    id: "flat-gbagada-reduced",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
    title: "3-Bed Flat, Gbagada",
    address: "Gbagada, Lagos",
    current: "₦48,000,000",
    original: "₦55,000,000",
    drop: "13%",
    beds: 3,
    baths: 2,
    sqft: "1,800",
    rating: 4.6,
    type: "sale" as const,
    agent: "Cityscape Properties",
    lastReduced: "Feb 2026",
    history: [
      { price: "₦55M", date: "Nov 2025" },
      { price: "₦52M", date: "Jan 2026" },
      { price: "₦48M", date: "Feb 2026" },
    ],
  },
  {
    id: "serviced-lekki-rent-reduced",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
    title: "Serviced 2-Bed, Lekki",
    address: "Lekki Phase 1, Lagos",
    current: "₦2,800,000/yr",
    original: "₦3,500,000/yr",
    drop: "20%",
    beds: 2,
    baths: 2,
    sqft: "1,600",
    rating: 4.8,
    type: "rent" as const,
    agent: "Prime Realty Lagos",
    lastReduced: "Mar 2026",
    history: [
      { price: "₦3.5M", date: "Dec 2025" },
      { price: "₦3.0M", date: "Feb 2026" },
      { price: "₦2.8M", date: "Mar 2026" },
    ],
  },
  {
    id: "office-ikeja-reduced",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    title: "Office Space, Allen Avenue",
    address: "Ikeja, Lagos",
    current: "₦280,000,000",
    original: "₦350,000,000",
    drop: "20%",
    beds: 0,
    baths: 4,
    sqft: "8,500",
    rating: 4.7,
    type: "sale" as const,
    agent: "Cityscape Properties",
    lastReduced: "Mar 2026",
    history: [
      { price: "₦350M", date: "Sep 2025" },
      { price: "₦310M", date: "Jan 2026" },
      { price: "₦280M", date: "Mar 2026" },
    ],
  },
  {
    id: "mansion-banana-reduced",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop",
    title: "Mansion, Banana Island",
    address: "Banana Island, Lagos",
    current: "₦680,000,000",
    original: "₦750,000,000",
    drop: "9%",
    beds: 7,
    baths: 6,
    sqft: "15,000",
    rating: 4.9,
    type: "sale" as const,
    agent: "Royal Estate Advisors",
    lastReduced: "Feb 2026",
    history: [
      { price: "₦750M", date: "Oct 2025" },
      { price: "₦720M", date: "Jan 2026" },
      { price: "₦680M", date: "Feb 2026" },
    ],
  },
];

const filters = ["All", "Sale", "Rent"];

const Reductions = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = reductions.filter((r) => {
    const matchesType =
      activeFilter === "All" || r.type === activeFilter.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

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
              Price Reductions
            </span>
          </div>

          {/* ─── Hero ─── */}
          <div className="relative overflow-hidden rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-10">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&h=600&fit=crop)",
              }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-[#e74c3c]/80 via-primary-dark/75 to-primary-dark/40" />
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5" />

            <div className="relative z-10 p-8 sm:p-10 lg:p-14">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
                <p className="text-white/70 text-sm font-medium tracking-wide uppercase">
                  Price Drops
                </p>
              </div>
              <h1 className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3.5rem] leading-[1.1] font-bold text-white tracking-tight">
                Recently <span className="text-white/70">Reduced</span>
              </h1>
              <p className="text-white/60 text-sm leading-relaxed mt-3 max-w-xl">
                Properties and rentals with verified price reductions. Full
                price history on every listing — no hidden inflation, just
                transparent pricing.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  { value: String(reductions.length), label: "Reductions" },
                  { value: "Up to 20%", label: "Off" },
                  { value: "Verified", label: "History" },
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

              {/* Search */}
              <div className="mt-8 bg-white/10 backdrop-blur-md border border-white/15 rounded-[18px] p-3 flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by property name or location..."
                    className="w-full h-12 pl-11 pr-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
                <button className="shrink-0 h-12 px-8 rounded-full bg-white text-primary-dark text-sm font-bold hover:bg-white/90 transition-colors duration-300 inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
                  <Search className="w-4 h-4" /> Search
                </button>
              </div>
            </div>
          </div>

          {/* Filters + results */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${activeFilter === f ? "bg-primary text-white border-primary" : "bg-white/80 text-primary-dark border-border-light hover:border-primary hover:text-primary"}`}
                >
                  {f}
                </button>
              ))}
              <span className="text-text-secondary text-sm ml-2">
                <span className="font-bold text-primary-dark">
                  {filtered.length}
                </span>{" "}
                properties
              </span>
            </div>
            <select className="h-9 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-xs focus:outline-none focus:border-primary transition-colors appearance-none pr-8">
              <option>Biggest drop</option>
              <option>Newest first</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          {/* ─── Cards Grid ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 mb-20">
            {filtered.map((prop) => (
              <div
                key={prop.id}
                className="group bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-52 h-48 sm:h-auto shrink-0 overflow-hidden relative">
                    <img
                      src={prop.image}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#e74c3c]/90 backdrop-blur-sm text-white text-xs font-bold">
                      <ArrowDown className="w-3 h-3" /> {prop.drop}
                    </span>
                    <span className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-primary-dark text-xs font-medium">
                      <Star className="w-3 h-3 text-[#F5A623] fill-[#F5A623]" />{" "}
                      {prop.rating}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5">
                    {/* Prices */}
                    <div className="flex items-baseline gap-3 mb-1">
                      <p className="font-heading font-bold text-primary-dark text-xl">
                        {prop.current}
                      </p>
                      <p className="text-text-subtle text-sm line-through">
                        {prop.original}
                      </p>
                    </div>

                    <h3 className="font-heading font-bold text-primary-dark text-[15px] leading-snug">
                      {prop.title}
                    </h3>
                    <p className="text-text-secondary text-xs mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {prop.address}
                    </p>

                    {/* Specs */}
                    {prop.beds > 0 && (
                      <div className="flex items-center gap-4 text-text-secondary text-xs mt-3">
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5" /> {prop.beds}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5" /> {prop.baths}
                        </span>
                        <span className="flex items-center gap-1">
                          <Maximize className="w-3.5 h-3.5" /> {prop.sqft}m²
                        </span>
                      </div>
                    )}

                    <div className="h-px bg-border-light mt-3 mb-3" />

                    {/* Price timeline */}
                    <p className="text-text-subtle text-[10px] uppercase tracking-wide mb-2">
                      Price History
                    </p>
                    <div className="flex items-center gap-1">
                      {prop.history.map((h, j) => (
                        <div key={j} className="flex items-center gap-1">
                          <div
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium ${
                              j === prop.history.length - 1
                                ? "bg-primary/10 text-primary"
                                : "bg-bg-accent text-text-secondary"
                            }`}
                          >
                            <span>{h.price}</span>
                          </div>
                          {j < prop.history.length - 1 && (
                            <TrendingDown className="w-3 h-3 text-[#e74c3c]" />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-text-subtle text-[11px] flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Reduced{" "}
                        {prop.lastReduced}
                      </span>
                      <span className="text-text-secondary text-[11px]">
                        {prop.agent}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reductions;
