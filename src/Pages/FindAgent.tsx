import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Star,
  Phone,
  MessageCircle,
  X,
  CheckCircle,
  Home,
  Users,
  Building2,
  Key,
  CalendarDays,
  ShieldCheck,
  Award,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { agents } from "../data/agents";

/* ─── Data ─── */

const specialties = [
  { label: "All", icon: <Users className="w-5 h-5" /> },
  { label: "Buy", icon: <Home className="w-5 h-5" /> },
  { label: "Rent", icon: <Key className="w-5 h-5" /> },
  { label: "Shortlet", icon: <CalendarDays className="w-5 h-5" /> },
  { label: "Commercial", icon: <Building2 className="w-5 h-5" /> },
];

const locations = [
  "All Locations",
  "Lekki",
  "Victoria Island",
  "Ikoyi",
  "Banana Island",
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

const FindAgent = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSpecialty, setActiveSpecialty] = useState("All");
  const [activeLocation, setActiveLocation] = useState("All Locations");
  const [activeRating, setActiveRating] = useState("Any Rating");
  const [contactCard, setContactCard] = useState<number | null>(null);

  const getFilteredAgents = () => {
    return agents.filter((agent) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        agent.name.toLowerCase().includes(q) ||
        agent.agency.toLowerCase().includes(q) ||
        agent.location.toLowerCase().includes(q);
      const matchesLocation =
        activeLocation === "All Locations" ||
        agent.location.includes(activeLocation);
      const matchesSpecialty =
        activeSpecialty === "All" || agent.specialty.includes(activeSpecialty);
      const matchesRating =
        activeRating === "Any Rating" ||
        agent.rating >= parseFloat(activeRating.replace("+", ""));
      return matchesSearch && matchesLocation && matchesSpecialty && matchesRating;
    });
  };

  const filteredAgents = getFilteredAgents();

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
            <span className="text-primary-dark font-medium">Find Agent</span>
          </div>

          {/* ─── Hero ─── */}
          <div className="relative overflow-hidden rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-10">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1400&h=600&fit=crop)",
              }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-primary-dark/90 via-primary-dark/75 to-primary-dark/40" />
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5" />

            <div className="relative z-10 p-8 sm:p-10 lg:p-14">
              <h1 className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3.5rem] leading-[1.1] font-bold text-white tracking-tight">
                Find Your{" "}
                <span className="text-white/70">Trusted Agent</span>
              </h1>
              <p className="text-white/60 text-sm leading-relaxed mt-3 max-w-xl">
                Every agent on PropertyLoop is KYC-verified through Smile
                Identity. Search by name, location, or specialty to find the
                right professional for your property journey.
              </p>

              {/* Stats pills */}
              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  { value: "1,200+", label: "Verified Agents" },
                  { value: "4.8", label: "Avg. Rating" },
                  { value: "15,000+", label: "Deals Closed" },
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
                    placeholder="Search by agent name, agency, or location..."
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
            {/* Left — filters */}
            <div className="lg:w-70 shrink-0 lg:sticky lg:top-8 lg:self-start">
              {/* Specialty filter */}
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="px-5 py-4 border-b border-border-light">
                  <h3 className="font-heading font-bold text-primary-dark text-sm">
                    Specialty
                  </h3>
                </div>
                <div className="p-2">
                  {specialties.map((spec) => (
                    <button
                      key={spec.label}
                      onClick={() => setActiveSpecialty(spec.label)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all duration-200 ${
                        activeSpecialty === spec.label
                          ? "bg-primary/10 text-primary"
                          : "text-primary-dark hover:bg-bg-accent"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          activeSpecialty === spec.label
                            ? "bg-primary text-white"
                            : "bg-white/80 border border-border-light text-text-secondary"
                        }`}
                      >
                        {spec.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold text-[14px] leading-tight">
                          {spec.label === "All" ? "All Specialties" : spec.label}
                        </p>
                        <p className="text-text-secondary text-xs mt-0.5">
                          {
                            agents.filter(
                              (a) =>
                                spec.label === "All" ||
                                a.specialty.includes(spec.label)
                            ).length
                          }{" "}
                          agents
                        </p>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 -rotate-90 ${
                          activeSpecialty === spec.label
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
                  Agent Network
                </h4>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Total agents", value: "1,200+" },
                    { label: "Joined this month", value: "48" },
                    { label: "Avg. response time", value: "< 2hrs" },
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

            {/* Right — agent cards */}
            <div className="flex-1">
              {/* Results header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-text-secondary text-sm">
                  Showing{" "}
                  <span className="font-bold text-primary-dark">
                    {filteredAgents.length}
                  </span>{" "}
                  agents in{" "}
                  <span className="font-bold text-primary-dark">
                    {activeLocation === "All Locations"
                      ? "All Locations"
                      : activeLocation}
                  </span>
                </p>
                <select className="h-9 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-xs focus:outline-none focus:border-primary transition-colors appearance-none pr-8">
                  <option>Top rated</option>
                  <option>Most listings</option>
                  <option>Most deals closed</option>
                  <option>Newest</option>
                </select>
              </div>

              {/* Agent grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                {filteredAgents.map((agent, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      setContactCard(contactCard === i ? null : i)
                    }
                    className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    {/* Photo */}
                    <div className="h-52 overflow-hidden rounded-t-[20px] relative">
                      <img
                        src={agent.photo}
                        alt={agent.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Verified badge */}
                      {agent.verified && (
                        <span className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-primary text-xs font-medium">
                          <CheckCircle className="w-3.5 h-3.5" />
                          KYC Verified
                        </span>
                      )}
                      {/* Specialty badge */}
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-white text-xs font-medium">
                        {agent.specialty.join(" · ")}
                      </span>
                    </div>

                    {/* Glass content panel */}
                    <div className="mx-3 mb-3 -mt-6 relative z-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-5 pt-4 pb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                      <h3 className="font-heading font-bold text-primary-dark text-[16px] leading-snug">
                        {agent.name}
                      </h3>
                      <p className="text-text-secondary text-xs mt-0.5 truncate">
                        {agent.agency} · {agent.location}
                      </p>

                      <div className="h-px bg-border-light mt-3 mb-3" />

                      <div className="flex items-center justify-between text-xs pr-8">
                        <div className="flex items-center gap-4 text-text-secondary">
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" />
                            {agent.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Home className="w-3.5 h-3.5" />
                            {agent.listings} active
                          </span>
                          <span>{agent.soldRented} closed</span>
                        </div>
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
                          {/* Close */}
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

                          {/* Agent name */}
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
                              {agent.name}
                            </p>
                          </motion.div>

                          {/* Buttons */}
                          <div className="flex gap-4">
                            <motion.a
                              initial={{ opacity: 0, scale: 0.5, y: 20 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{
                                delay: 0.2,
                                duration: 0.4,
                                ease: [0.23, 1, 0.32, 1],
                              }}
                              href={`tel:+${agent.phone}`}
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
                              href={`https://wa.me/${agent.phone}?text=Hi ${agent.name}, I found your profile on PropertyLoop and would like to discuss my property needs.`}
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

                          {/* View profile button */}
                          <motion.button
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.4,
                              duration: 0.35,
                              ease: [0.23, 1, 0.32, 1],
                            }}
                            onClick={() => navigate(`/agent/${agent.id}`)}
                            className="mt-1 h-10 px-6 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-medium hover:bg-white hover:text-primary-dark transition-all duration-300 inline-flex items-center gap-2"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                            View profile
                          </motion.button>

                          {/* Agency name */}
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.3 }}
                            className="text-white/40 text-xs text-center px-6 mt-1 truncate max-w-full"
                          >
                            {agent.agency} · {agent.location}
                          </motion.p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Empty state */}
              {filteredAgents.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-bg-accent border border-border-light flex items-center justify-center mx-auto mb-4">
                    <Users className="w-7 h-7 text-text-subtle" />
                  </div>
                  <h3 className="font-heading font-bold text-primary-dark text-lg">
                    No agents found
                  </h3>
                  <p className="text-text-secondary text-sm mt-2 max-w-sm mx-auto">
                    Try adjusting your filters or search query to find more
                    agents in your area.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveSpecialty("All");
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
              {filteredAgents.length > 0 && (
                <div className="mt-10 text-center">
                  <button className="h-11 px-8 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                    Load more agents
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ─── Trust banner ─── */}
          <div className="mb-20 bg-white/60 backdrop-blur-sm border border-border-light rounded-[20px] px-8 py-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-heading font-bold text-primary-dark text-lg">
                All agents are KYC-verified
              </h3>
              <p className="text-text-secondary text-sm mt-1">
                Every agent on PropertyLoop passes identity verification via
                Smile Identity before they can list properties. This is how we
                keep listings trustworthy and protect buyers and tenants.
              </p>
            </div>
            <a
              href="/onboarding"
              className="shrink-0 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors duration-300 inline-flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              Become an agent
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FindAgent;
