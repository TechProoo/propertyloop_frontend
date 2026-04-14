import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  Search,
  SlidersHorizontal,
  MapPin,
  ChevronDown,
  Phone,
  X,
  ShieldCheck,
  Building2,
  Home,
  Layers,
  Fence,
  LayoutGrid,
  Calendar,
  Users,
  Landmark,
  ClipboardCheck,
  TrendingUp,
  KeyRound,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";

/* ─── Data ─── */

interface Development {
  image: string;
  title: string;
  developer: string;
  address: string;
  priceFrom: string;
  totalUnits: number;
  soldPercentage: number;
  completionDate: string;
  type: string;
  status: "Pre-Launch" | "Selling" | "Almost Sold Out";
}

const categories = [
  { icon: <Home className="w-5 h-5" />, label: "Estate", count: 124 },
  {
    icon: <Building2 className="w-5 h-5" />,
    label: "Apartment Complex",
    count: 98,
  },
  { icon: <Layers className="w-5 h-5" />, label: "Mixed-Use", count: 45 },
  {
    icon: <Fence className="w-5 h-5" />,
    label: "Gated Community",
    count: 53,
  },
  {
    icon: <LayoutGrid className="w-5 h-5" />,
    label: "All Developments",
    count: 320,
  },
];

const developments: Development[] = [
  {
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
    title: "Emerald Bay Estate",
    developer: "Prime Realty Lagos",
    address: "Lekki Phase 2, Lagos",
    priceFrom: "₦45,000,000",
    totalUnits: 120,
    soldPercentage: 72,
    completionDate: "Q4 2026",
    type: "Estate",
    status: "Selling",
  },
  {
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    title: "The Pinnacle Towers",
    developer: "Island Properties",
    address: "Victoria Island, Lagos",
    priceFrom: "₦185,000,000",
    totalUnits: 64,
    soldPercentage: 45,
    completionDate: "Q2 2027",
    type: "Apartment Complex",
    status: "Selling",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
    title: "Lekki Gardens Phase 3",
    developer: "Prestige Homes",
    address: "Lekki, Lagos",
    priceFrom: "₦38,000,000",
    totalUnits: 200,
    soldPercentage: 88,
    completionDate: "Q1 2026",
    type: "Gated Community",
    status: "Almost Sold Out",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    title: "Oceanview Terraces",
    developer: "Royal Estate Advisors",
    address: "Banana Island, Lagos",
    priceFrom: "₦320,000,000",
    totalUnits: 32,
    soldPercentage: 28,
    completionDate: "Q3 2027",
    type: "Apartment Complex",
    status: "Pre-Launch",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
    title: "Heritage Park Estate",
    developer: "Cityscape Properties",
    address: "Gbagada, Lagos",
    priceFrom: "₦28,000,000",
    totalUnits: 180,
    soldPercentage: 65,
    completionDate: "Q2 2026",
    type: "Estate",
    status: "Selling",
  },
  {
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
    title: "The Axis Hub",
    developer: "Horizon Properties",
    address: "Ikeja, Lagos",
    priceFrom: "₦55,000,000",
    totalUnits: 96,
    soldPercentage: 52,
    completionDate: "Q4 2026",
    type: "Mixed-Use",
    status: "Selling",
  },
  {
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    title: "Sapphire Court Residences",
    developer: "Sapphire Homes",
    address: "Yaba, Lagos",
    priceFrom: "₦22,000,000",
    totalUnits: 150,
    soldPercentage: 91,
    completionDate: "Q1 2026",
    type: "Apartment Complex",
    status: "Almost Sold Out",
  },
  {
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop",
    title: "Greenfield Villas",
    developer: "Metro Living Realty",
    address: "Ajah, Lagos",
    priceFrom: "₦32,000,000",
    totalUnits: 80,
    soldPercentage: 15,
    completionDate: "Q1 2028",
    type: "Gated Community",
    status: "Pre-Launch",
  },
];

const steps = [
  {
    icon: <Search className="w-6 h-6" />,
    title: "Browse Developments",
    description:
      "Explore verified new builds and off-plan properties from trusted developers across Lagos.",
  },
  {
    icon: <ClipboardCheck className="w-6 h-6" />,
    title: "Reserve Your Unit",
    description:
      "Secure your preferred unit with an escrow-protected deposit via Paystack. No risk.",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Track Progress",
    description:
      "Get regular construction updates, photos, and milestone notifications from your developer.",
  },
  {
    icon: <KeyRound className="w-6 h-6" />,
    title: "Complete Purchase",
    description:
      "Sign your agreement via DocuSeal, complete payment, and collect your keys on handover day.",
  },
];

const statusColors = {
  "Pre-Launch": { bg: "bg-blue-500/90", text: "text-white" },
  Selling: { bg: "bg-primary/90", text: "text-white" },
  "Almost Sold Out": { bg: "bg-[#F5A623]/90", text: "text-white" },
};

/* ─── Component ─── */

const NewDevelopments = () => {
  const [activeCategory, setActiveCategory] = useState("All Developments");
  const [activeStatus, setActiveStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [contactCard, setContactCard] = useState<number | null>(null);

  const getFiltered = () => {
    return developments.filter((d) => {
      const matchesCategory =
        activeCategory === "All Developments" || d.type === activeCategory;
      const matchesStatus = activeStatus === "All" || d.status === activeStatus;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        d.title.toLowerCase().includes(q) ||
        d.address.toLowerCase().includes(q) ||
        d.developer.toLowerCase().includes(q);
      return matchesCategory && matchesStatus && matchesSearch;
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
            <span className="text-primary-dark font-medium">
              New Developments
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
                New <span className="text-white/70">Developments</span>
              </h1>
              <p className="text-white/60 text-sm leading-relaxed mt-3 max-w-xl">
                Explore off-plan properties and new estates from verified
                developers. Secure your unit early with escrow-protected
                deposits via Paystack.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  { value: "320+", label: "Developments" },
                  { value: "45+", label: "Developers" },
                  { value: "Escrow", label: "Protected" },
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
                    placeholder="Search by development name, location, or developer..."
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
            {/* Left — sidebar */}
            <div className="hidden lg:block lg:w-70 shrink-0 lg:sticky lg:top-8 lg:self-start">
              {/* Categories */}
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
                          {cat.count} projects
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
                  Development Snapshot
                </h4>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Avg. starting price", value: "₦45M" },
                    { label: "Launching this month", value: "12" },
                    { label: "Completing in 2026", value: "87" },
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

              {/* Status filter */}
              <div className="mt-5 bg-white/60 backdrop-blur-sm border border-border-light rounded-[20px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <h4 className="font-heading font-bold text-primary-dark text-sm mb-3">
                  Status
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["All", "Pre-Launch", "Selling", "Almost Sold Out"].map(
                    (s) => (
                      <button
                        key={s}
                        onClick={() => setActiveStatus(s)}
                        className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-all duration-200 ${
                          activeStatus === s
                            ? "bg-primary text-white border-primary"
                            : "bg-white/60 text-primary-dark border-border-light hover:border-primary hover:text-primary"
                        }`}
                      >
                        {s}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Right — development cards */}
            <div className="flex-1">
              {/* Results header */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
                <p className="text-text-secondary text-sm">
                  Showing{" "}
                  <span className="font-bold text-primary-dark">
                    {filtered.length}
                  </span>{" "}
                  developments
                </p>
                <select className="h-9 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-xs focus:outline-none focus:border-primary transition-colors appearance-none pr-8">
                  <option>Newest first</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Most sold</option>
                </select>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                {filtered.map((dev, i) => (
                  <div
                    key={i}
                    onClick={() => setContactCard(contactCard === i ? null : i)}
                    className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    {/* Image */}
                    <div className="h-48 overflow-hidden rounded-t-[20px] relative">
                      <img
                        src={dev.image}
                        alt={dev.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Status badge */}
                      <span
                        className={`absolute top-3 left-3 px-2.5 py-1 rounded-full backdrop-blur-sm text-xs font-medium ${statusColors[dev.status].bg} ${statusColors[dev.status].text}`}
                      >
                        {dev.status}
                      </span>
                      {/* Units badge */}
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-white text-xs font-medium">
                        {dev.totalUnits} Units
                      </span>
                    </div>

                    {/* Glass content */}
                    <div className="mx-3 mb-3 -mt-6 relative z-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-5 pt-4 pb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                      <p className="font-heading font-bold text-primary-dark text-[18px]">
                        From {dev.priceFrom}
                      </p>
                      <h3 className="font-heading font-bold text-primary-dark text-[15px] leading-snug mt-1 truncate">
                        {dev.title}
                      </h3>
                      <p className="text-text-secondary text-xs mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {dev.address}
                      </p>

                      <div className="h-px bg-border-light mt-3 mb-3" />

                      {/* Stats row */}
                      <div className="flex items-center gap-4 text-text-secondary text-xs pr-10">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          {dev.totalUnits} units
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {dev.completionDate}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[11px] mb-1.5">
                          <span className="text-text-secondary">
                            {dev.soldPercentage}% sold
                          </span>
                          <span className="text-text-subtle">
                            {Math.round(
                              dev.totalUnits * (1 - dev.soldPercentage / 100),
                            )}{" "}
                            remaining
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-border-light overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${dev.soldPercentage}%` }}
                          />
                        </div>
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
                            <p className="text-white/60 text-xs">Developer</p>
                            <p className="font-heading font-bold text-white text-base mt-1">
                              {dev.developer}
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
                            className="mt-1 h-10 px-6 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-medium hover:bg-white hover:text-primary-dark transition-all duration-300 inline-flex items-center gap-2"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                            View development
                          </motion.button>

                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.3 }}
                            className="text-white/40 text-xs text-center px-6 mt-1 truncate max-w-full"
                          >
                            {dev.title} · {dev.totalUnits} units from{" "}
                            {dev.priceFrom}
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
                  Load more developments
                </button>
              </div>
            </div>
          </div>

          {/* ─── How It Works ─── */}
          <section className="mb-20">
            <div className="text-center mb-10">
              <p className="text-primary text-sm font-medium tracking-wide uppercase mb-2">
                How It Works
              </p>
              <h2 className="font-heading text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
                Buying <span className="text-primary">Off-Plan</span>
              </h2>
              <p className="text-text-secondary text-sm mt-3 max-w-md mx-auto">
                A simple, secure process from browsing to key handover
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 p-6"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full absolute -right-3 -top-3">
                    <span className="absolute bottom-4 left-5 font-heading font-bold text-primary text-lg">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                      {step.icon}
                    </div>
                    <h3 className="font-heading font-bold text-primary-dark text-lg mb-2">
                      {step.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {i < 3 && (
                    <ArrowRight className="hidden lg:block absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-5 h-5 text-border z-20" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ─── Trust banner ─── */}
          <div className="mb-20 bg-white/60 backdrop-blur-sm border border-border-light rounded-[20px] px-8 py-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-heading font-bold text-primary-dark text-lg">
                All developers are verified
              </h3>
              <p className="text-text-secondary text-sm mt-1">
                Every developer on PropertyLoop is KYC-verified and their
                projects are reviewed before listing. Deposits are held in
                Paystack escrow for your protection.
              </p>
            </div>
            <Link
              to="/onboarding"
              className="shrink-0 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors duration-300 inline-flex items-center gap-2"
            >
              <Landmark className="w-4 h-4" />
              List a development
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NewDevelopments;
