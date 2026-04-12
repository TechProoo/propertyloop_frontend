import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bed,
  Bath,
  Maximize,
  MapPin,
  Star,
  Phone,
  MessageCircle,
  Mail,
  CheckCircle,
  ShieldCheck,
  Calendar,
  Home,
  Building2,
  Zap,
  Droplets,
  Car,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Share2,
  ClipboardList,
  TrendingDown,
  Wrench,
  Paintbrush,
  ThermometerSun,
  FileCheck,
  Clock,
  FileText,
  Download,
  Eye,
  Handshake,
  Send,
  DollarSign,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { getListingById, listings } from "../data/listings";
import BookmarkButton from "../components/ui/BookmarkButton";
import { getAgentById } from "../data/agents";

const ease = [0.23, 1, 0.32, 1] as const;

/* ─── Price History Data ─── */
const priceHistory = [
  {
    date: "Mar 2026",
    price: "₦65,000,000",
    change: null,
    event: "Current listing price",
  },
  {
    date: "Jan 2026",
    price: "₦68,000,000",
    change: -4.4,
    event: "Price reduced",
  },
  {
    date: "Oct 2025",
    price: "₦68,000,000",
    change: null,
    event: "Re-listed by new agent",
  },
  {
    date: "Jul 2025",
    price: "₦72,000,000",
    change: null,
    event: "Listed for sale",
  },
  { date: "Mar 2025", price: "₦58,000,000", change: null, event: "Last sold" },
  {
    date: "Sep 2023",
    price: "₦52,000,000",
    change: null,
    event: "Previous sale",
  },
];

/* ─── Property Logbook Data ─── */
const logbookEntries = [
  {
    date: "Mar 2026",
    icon: <Wrench className="w-4 h-4" />,
    title: "Plumbing Repair",
    vendor: "Adewale Plumbing Co.",
    description: "Kitchen sink replacement and pipe rerouting",
    cost: "₦45,000",
  },
  {
    date: "Jan 2026",
    icon: <Zap className="w-4 h-4" />,
    title: "Electrical Rewiring",
    vendor: "BrightSpark Electricals",
    description: "Full rewiring of second floor bedrooms",
    cost: "₦120,000",
  },
  {
    date: "Nov 2025",
    icon: <Paintbrush className="w-4 h-4" />,
    title: "Interior Painting",
    vendor: "ProFinish Painters",
    description: "Complete repaint of living room and hallway",
    cost: "₦85,000",
  },
  {
    date: "Sep 2025",
    icon: <Droplets className="w-4 h-4" />,
    title: "Waterproofing",
    vendor: "SealTight Solutions",
    description: "Roof and terrace waterproofing with warranty",
    cost: "₦200,000",
  },
  {
    date: "Jun 2025",
    icon: <ThermometerSun className="w-4 h-4" />,
    title: "AC Installation",
    vendor: "CoolBreeze HVAC",
    description: "3 split-unit ACs across main living areas",
    cost: "₦350,000",
  },
  {
    date: "Mar 2025",
    icon: <FileCheck className="w-4 h-4" />,
    title: "Property Inspection",
    vendor: "PropertyLoop Verified",
    description: "Initial inspection and logbook creation",
    cost: "—",
  },
];

type OfferStatus = "idle" | "form" | "submitted" | "countered" | "accepted";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const listing = getListingById(id || "");
  const [activeImage, setActiveImage] = useState(0);
  const [offerStatus, setOfferStatus] = useState<OfferStatus>("idle");
  const [offerAmount, setOfferAmount] = useState("");
  const [offerNote, setOfferNote] = useState("");

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#f5f0eb]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-6">
          <div className="w-20 h-20 rounded-full bg-bg-accent border border-border-light flex items-center justify-center mb-6">
            <Home className="w-8 h-8 text-text-subtle" />
          </div>
          <h1 className="font-heading font-bold text-primary-dark text-2xl mb-2">
            Property not found
          </h1>
          <p className="text-text-secondary text-sm mb-6">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/buy"
            className="h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Properties
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const agent = getAgentById(listing.agentId);
  const similar = listings
    .filter((l) => l.id !== listing.id && l.type === listing.type)
    .slice(0, 3);

  const nextImage = () =>
    setActiveImage((p) => (p + 1) % listing.images.length);
  const prevImage = () =>
    setActiveImage(
      (p) => (p - 1 + listing.images.length) % listing.images.length,
    );

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />

      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              to={
                listing.type === "rent"
                  ? "/rent"
                  : listing.type === "shortlet"
                    ? "/shortlet"
                    : "/buy"
              }
              className="hover:text-primary transition-colors"
            >
              {listing.type === "rent"
                ? "Rent"
                : listing.type === "shortlet"
                  ? "Shortlet"
                  : "Buy"}
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium truncate max-w-50">
              {listing.title}
            </span>
          </div>

          {/* ─── Image Gallery ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="relative overflow-hidden rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-8"
          >
            <div className="relative h-75 sm:h-100 lg:h-125">
              <img
                src={listing.images[activeImage]}
                alt={listing.title}
                className="w-full h-full object-cover transition-all duration-500"
              />
              {/* Gradient overlay bottom */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/50 to-transparent" />

              {/* Nav arrows */}
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Top badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-white text-xs font-medium">
                  {listing.type === "sale"
                    ? "For Sale"
                    : listing.type === "rent"
                      ? "For Rent"
                      : "Shortlet"}
                </span>
                {listing.verified && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-primary text-xs font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </div>

              {/* Top right actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-all">
                  <Share2 className="w-4 h-4" />
                </button>
                <BookmarkButton id={listing.id} type="property" />
              </div>

              {/* Image counter */}
              <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-medium">
                {activeImage + 1} / {listing.images.length}
              </div>

              {/* Bottom info overlay */}
              <div className="absolute bottom-4 left-4">
                <p className="font-heading font-bold text-white text-[1.5rem] sm:text-[2rem] leading-tight drop-shadow-lg">
                  {listing.price}
                  {listing.period && (
                    <span className="text-white/60 text-lg font-normal">
                      {" "}
                      /{listing.period}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Thumbnail strip */}
            {listing.images.length > 1 && (
              <div className="flex gap-2 p-3 bg-white/70 backdrop-blur-md">
                {listing.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`h-16 w-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImage === i
                        ? "border-primary shadow-lg shadow-glow/30"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ─── Main content grid ─── */}
          <div className="flex flex-col lg:flex-row gap-8 mb-20">
            {/* Left — details */}
            <div className="flex-1">
              {/* Title + specs */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4, ease }}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8 mb-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="font-heading font-bold text-primary-dark text-xl sm:text-2xl leading-tight">
                      {listing.title}
                    </h1>
                    <p className="text-text-secondary text-sm mt-1.5 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" />
                      {listing.address}, {listing.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium shrink-0">
                    <Star className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" />
                    {listing.rating}
                  </div>
                </div>

                {/* Spec pills */}
                <div className="flex flex-wrap gap-3 mt-5">
                  {listing.beds > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-border-light text-sm">
                      <Bed className="w-4 h-4 text-primary" />
                      <span className="font-heading font-bold text-primary-dark">
                        {listing.beds}
                      </span>
                      <span className="text-text-secondary">Bedrooms</span>
                    </div>
                  )}
                  {listing.baths > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-border-light text-sm">
                      <Bath className="w-4 h-4 text-primary" />
                      <span className="font-heading font-bold text-primary-dark">
                        {listing.baths}
                      </span>
                      <span className="text-text-secondary">Bathrooms</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-border-light text-sm">
                    <Maximize className="w-4 h-4 text-primary" />
                    <span className="font-heading font-bold text-primary-dark">
                      {listing.sqft}
                    </span>
                    <span className="text-text-secondary">m²</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-border-light text-sm">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span className="text-text-secondary">
                      {listing.propertyType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-border-light text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-text-secondary">
                      Built {listing.yearBuilt}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4, ease }}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8 mb-6"
              >
                <h2 className="font-heading font-bold text-primary-dark text-lg mb-4">
                  About This Property
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {listing.description}
                </p>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease }}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8 mb-6"
              >
                <h2 className="font-heading font-bold text-primary-dark text-lg mb-4">
                  Features & Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {listing.features.map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/60 border border-border-light"
                    >
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-primary-dark text-sm">{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ─── Verified Documents (C of O) ─── */}
              {listing.documents && listing.documents.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.21, duration: 0.4, ease }}
                  className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8 mb-6"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-heading font-bold text-primary-dark text-lg">
                      Verified Documents
                    </h2>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {listing.documents.length} verified
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {listing.documents.map((doc, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 bg-white/60 backdrop-blur-sm border border-border-light rounded-2xl p-4 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 group"
                      >
                        {/* Doc icon */}
                        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>

                        {/* Doc info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-heading font-semibold text-primary-dark text-sm truncate">
                              {doc.name}
                            </p>
                            {doc.verified && (
                              <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-text-secondary text-xs mt-0.5">
                            <span className="px-2 py-0.5 rounded-full bg-bg-accent border border-border-light text-[11px] font-medium">
                              {doc.type}
                            </span>
                            <span>Uploaded {doc.date}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                            title="Preview"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                            title="Download"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-text-subtle text-[11px] mt-4 leading-relaxed">
                    All documents are verified by PropertyLoop before listing.
                    Original copies can be requested through the listing agent.
                  </p>
                </motion.div>
              )}

              {/* ─── Price History Timeline ─── */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.4, ease }}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8 mb-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-heading font-bold text-primary-dark text-lg">
                    Price History
                  </h2>
                  <span className="text-text-subtle text-xs">
                    {priceHistory.length} records
                  </span>
                </div>

                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-3.75 top-3 bottom-3 w-px bg-border-light" />

                  <div className="flex flex-col gap-4">
                    {priceHistory.map((entry, i) => (
                      <div key={i} className="flex items-start gap-4 relative">
                        {/* Dot */}
                        <div
                          className={`w-7.75 h-7.75 rounded-full flex items-center justify-center shrink-0 relative z-10 border-2 border-[#f5f0eb] ${
                            i === 0
                              ? "bg-primary text-white"
                              : entry.change !== null
                                ? "bg-[#FFF8ED] text-[#F5A623]"
                                : "bg-white/80 border-border-light text-text-subtle"
                          }`}
                        >
                          {i === 0 ? (
                            <Home className="w-3.5 h-3.5" />
                          ) : entry.change !== null ? (
                            <TrendingDown className="w-3.5 h-3.5" />
                          ) : (
                            <Clock className="w-3.5 h-3.5" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pb-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-heading font-bold text-primary-dark text-sm">
                                {entry.price}
                              </span>
                              {entry.change !== null && (
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                    entry.change < 0
                                      ? "bg-[#FFF8ED] text-[#F5A623]"
                                      : "bg-primary/10 text-primary"
                                  }`}
                                >
                                  {entry.change > 0 ? "+" : ""}
                                  {entry.change}%
                                </span>
                              )}
                            </div>
                            <span className="text-text-subtle text-xs shrink-0">
                              {entry.date}
                            </span>
                          </div>
                          <p className="text-text-secondary text-xs mt-0.5">
                            {entry.event}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Neighbourhood Intelligence */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4, ease }}
                className="bg-white/60 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8 mb-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-text-subtle text-[10px] uppercase tracking-widest">
                      Neighbourhood Intelligence
                    </p>
                    <h3 className="font-heading font-bold text-primary-dark text-base">
                      {listing.location}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    {
                      icon: <Zap className="w-4 h-4" />,
                      label: "Power",
                      score: 7.8,
                      color: "#F5A623",
                      bg: "bg-[#FFF8ED]",
                      desc: "16-20hrs daily",
                    },
                    {
                      icon: <Droplets className="w-4 h-4" />,
                      label: "Flood Risk",
                      score: 2.1,
                      color: "#1f6f43",
                      bg: "bg-primary/5",
                      desc: "Very low",
                    },
                    {
                      icon: <Car className="w-4 h-4" />,
                      label: "Roads",
                      score: 8.4,
                      color: "#1f6f43",
                      bg: "bg-primary/5",
                      desc: "Well-maintained",
                    },
                    {
                      icon: <ShieldCheck className="w-4 h-4" />,
                      label: "Safety",
                      score: 8.0,
                      color: "#1f6f43",
                      bg: "bg-primary/5",
                      desc: "24hr security",
                    },
                    {
                      icon: <GraduationCap className="w-4 h-4" />,
                      label: "Schools",
                      score: 9.2,
                      color: "#1f6f43",
                      bg: "bg-primary/5",
                      desc: "12 within 3km",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div
                          className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center`}
                          style={{ color: item.color }}
                        >
                          {item.icon}
                        </div>
                        <span
                          className="font-heading font-bold text-lg"
                          style={{ color: item.color }}
                        >
                          {item.score}
                        </span>
                      </div>
                      <p className="font-heading font-semibold text-primary-dark text-[12px]">
                        {item.label}
                      </p>
                      <div className="w-full h-1 rounded-full bg-border-light overflow-hidden mt-2 mb-1.5">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(item.score / 10) * 100}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                      <p className="text-text-subtle text-[10px]">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ─── Property Logbook ─── */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.4, ease }}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-primary-dark text-lg">
                        Property Logbook
                      </h2>
                      <p className="text-text-subtle text-[11px]">
                        Property ID: PL-{listing.id.slice(0, 5).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {logbookEntries.length} verified records
                  </span>
                </div>
                <p className="text-text-secondary text-xs mb-5 leading-relaxed">
                  Every maintenance, repair, and service performed on this
                  property is permanently recorded with verified vendor details.
                </p>

                {/* Timeline */}
                <div className="relative">
                  <div className="absolute left-4.5 top-3 bottom-3 w-px bg-border-light" />

                  <div className="flex flex-col gap-4">
                    {logbookEntries.map((entry, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 relative group"
                      >
                        {/* Dot */}
                        <div className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-border-light shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center text-primary shrink-0 relative z-10 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors duration-300">
                          {entry.icon}
                        </div>

                        {/* Card */}
                        <div className="flex-1 bg-white/60 backdrop-blur-sm border border-border-light rounded-2xl p-4 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                              {entry.date}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-primary">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Verified
                            </span>
                          </div>
                          <h4 className="font-heading font-bold text-primary-dark text-sm">
                            {entry.title}
                          </h4>
                          <p className="text-text-secondary text-xs mt-0.5">
                            by {entry.vendor}
                          </p>
                          <p className="text-text-subtle text-xs mt-1.5 leading-relaxed">
                            {entry.description}
                          </p>
                          <div className="h-px bg-border-light mt-3 mb-2" />
                          <div className="flex items-center justify-between">
                            <span className="font-heading font-bold text-primary-dark text-sm">
                              {entry.cost}
                            </span>
                            <span className="text-text-subtle text-[11px]">
                              Auto-logged via Service Loop
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right — agent + similar */}
            <div className="lg:w-95 shrink-0">
              {/* Agent card */}
              {agent && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4, ease }}
                  className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 mb-6"
                >
                  <h3 className="font-heading font-bold text-primary-dark text-sm mb-4">
                    Listed by
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={agent.photo}
                      alt={agent.name}
                      className="w-14 h-14 rounded-full object-cover object-top border-2 border-white shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-heading font-bold text-primary-dark text-sm truncate">
                          {agent.name}
                        </p>
                        {agent.verified && (
                          <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-text-secondary text-xs">
                        {agent.agency}
                      </p>
                      <div className="flex items-center gap-3 text-text-secondary text-xs mt-1">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-[#F5A623] fill-[#F5A623]" />
                          {agent.rating}
                        </span>
                        <span>{agent.listings} listings</span>
                        <span>{agent.soldRented} closed</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact buttons */}
                  <div className="flex flex-col gap-2.5">
                    <a
                      href={`tel:+${agent.phone}`}
                      className="h-11 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2 shadow-lg shadow-glow/40"
                    >
                      <Phone className="w-4 h-4" />
                      Call Agent
                    </a>
                    <a
                      href={`mailto:${agent.email}?subject=Enquiry: ${listing.title}`}
                      className="h-11 rounded-full bg-white/80 border border-border-light text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all inline-flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </a>
                  </div>

                  {/* Make an Offer button */}
                  {listing.type === "sale" && offerStatus === "idle" && (
                    <button
                      onClick={() => setOfferStatus("form")}
                      className="mt-2 h-11 w-full rounded-full bg-primary-dark text-white text-sm font-bold hover:bg-primary transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <Handshake className="w-4 h-4" />
                      Make an Offer
                    </button>
                  )}

                  <Link
                    to={`/agent/${agent.id}`}
                    className="block text-center text-primary text-xs font-medium mt-3 hover:underline"
                  >
                    View full agent profile
                  </Link>
                </motion.div>
              )}

              {/* ─── Offer Panel ─── */}
              <AnimatePresence>
                {offerStatus !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4, ease }}
                    className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 mb-6"
                  >
                    {/* Offer Form */}
                    {offerStatus === "form" && (
                      <>
                        <h3 className="font-heading font-bold text-primary-dark text-sm mb-4 flex items-center gap-2">
                          <Handshake className="w-4 h-4 text-primary" />
                          Submit Your Offer
                        </h3>
                        <div className="flex flex-col gap-3">
                          <div>
                            <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                              Offer Amount (₦)
                            </label>
                            <div className="relative">
                              <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                              <input
                                type="text"
                                value={offerAmount}
                                onChange={(e) => setOfferAmount(e.target.value)}
                                placeholder="e.g. 60,000,000"
                                className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                              />
                            </div>
                            <p className="text-text-subtle text-[11px] mt-1">
                              Asking price: {listing.price}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                              Note to Agent (optional)
                            </label>
                            <textarea
                              value={offerNote}
                              onChange={(e) => setOfferNote(e.target.value)}
                              placeholder="Any conditions or message for the agent..."
                              className="w-full h-20 px-4 py-3 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors resize-none"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <button
                            onClick={() => setOfferStatus("idle")}
                            className="flex-1 h-10 rounded-full bg-white/80 border border-border-light text-primary-dark text-sm font-medium hover:bg-bg-accent transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              setOfferStatus("submitted");
                              setTimeout(
                                () => setOfferStatus("countered"),
                                2500,
                              );
                            }}
                            className="flex-1 h-10 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Submit Offer
                          </button>
                        </div>
                      </>
                    )}

                    {/* Submitted — waiting */}
                    {offerStatus === "submitted" && (
                      <div className="text-center py-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 animate-pulse">
                          <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <p className="font-heading font-bold text-primary-dark text-sm">
                          Offer Submitted
                        </p>
                        <p className="text-text-secondary text-xs mt-1">
                          Waiting for agent response...
                        </p>
                      </div>
                    )}

                    {/* Counter offer */}
                    {offerStatus === "countered" && (
                      <>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-full bg-[#FFF8ED] flex items-center justify-center">
                            <Handshake className="w-4 h-4 text-[#F5A623]" />
                          </div>
                          <p className="font-heading font-bold text-primary-dark text-sm">
                            Counter Offer Received
                          </p>
                        </div>
                        <div className="bg-[#FFF8ED] border border-[#F5A623]/20 rounded-2xl p-4 mb-4">
                          <p className="text-primary-dark text-sm">
                            {agent?.name} has responded with a counter offer:
                          </p>
                          <p className="font-heading font-bold text-primary-dark text-xl mt-2">
                            ₦62,000,000
                          </p>
                          <p className="text-text-secondary text-xs mt-1">
                            "Thank you for your offer. The owner is willing to
                            come down to ₦62M. This is the best price we can do
                            given the property's features and recent
                            renovations."
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setOfferStatus("idle");
                              setOfferAmount("");
                              setOfferNote("");
                            }}
                            className="flex-1 h-10 rounded-full bg-white/80 border border-border-light text-primary-dark text-sm font-medium hover:bg-bg-accent transition-all"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => setOfferStatus("form")}
                            className="flex-1 h-10 rounded-full bg-white/80 border border-[#F5A623] text-[#F5A623] text-sm font-medium hover:bg-[#FFF8ED] transition-all"
                          >
                            Counter Again
                          </button>
                          <button
                            onClick={() => setOfferStatus("accepted")}
                            className="flex-1 h-10 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors"
                          >
                            Accept
                          </button>
                        </div>
                      </>
                    )}

                    {/* Accepted */}
                    {offerStatus === "accepted" && (
                      <div className="text-center py-4">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                          className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-3"
                        >
                          <CheckCircle className="w-6 h-6 text-white" />
                        </motion.div>
                        <p className="font-heading font-bold text-primary-dark text-sm">
                          Offer Accepted!
                        </p>
                        <p className="text-text-secondary text-xs mt-1 max-w-xs mx-auto">
                          Congratulations! Your offer of ₦62,000,000 has been
                          accepted. The agent will contact you to proceed with
                          e-signing and escrow payment.
                        </p>
                        <Link
                          to="/rental-escrow"
                          className="mt-4 inline-flex items-center gap-2 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
                        >
                          Proceed to Payment
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Price card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease }}
                className="bg-primary rounded-[20px] p-6 text-white mb-6"
              >
                <p className="text-white/60 text-xs">
                  {listing.type === "sale"
                    ? "Asking Price"
                    : listing.type === "rent"
                      ? "Annual Rent"
                      : "Per Night"}
                </p>
                <p className="font-heading font-bold text-[1.8rem] leading-tight mt-1">
                  {listing.price}
                  {listing.period && (
                    <span className="text-white/60 text-lg font-normal">
                      /{listing.period}
                    </span>
                  )}
                </p>
                <div className="h-px bg-white/20 my-4" />
                <div className="flex items-center gap-2 text-white/70 text-xs mb-4">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Escrow-protected transaction via Paystack</span>
                </div>
                {listing.type === "rent" && (
                  <Link
                    to="/rental-escrow"
                    className="w-full h-10 rounded-full bg-white text-primary-dark text-sm font-bold hover:bg-white/90 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    Start Rental Process
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
                {listing.type === "shortlet" && (
                  <Link
                    to="/shortlet-booking"
                    className="w-full h-10 rounded-full bg-white text-primary-dark text-sm font-bold hover:bg-white/90 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </motion.div>

              {/* Similar properties */}
              {similar.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4, ease }}
                  className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden"
                >
                  <div className="px-6 py-5 border-b border-border-light">
                    <h2 className="font-heading font-bold text-primary-dark text-lg">
                      Similar Properties
                    </h2>
                  </div>
                  <div className="p-4 flex flex-col gap-4">
                    {similar.map((s) => (
                      <Link
                        key={s.id}
                        to={`/property/${s.id}`}
                        className="group flex gap-4 bg-white/60 backdrop-blur-sm border border-border-light rounded-2xl p-3 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative">
                          <img
                            src={s.image}
                            alt={s.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-full bg-primary/90 text-white text-[10px] font-medium">
                            {s.type === "sale"
                              ? "Sale"
                              : s.type === "rent"
                                ? "Rent"
                                : "Shortlet"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 py-0.5">
                          <p className="font-heading font-bold text-primary-dark text-[15px]">
                            {s.price}
                          </p>
                          <p className="font-heading font-semibold text-primary-dark text-sm leading-snug mt-0.5 truncate">
                            {s.title}
                          </p>
                          <p className="text-text-secondary text-xs mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {s.location}
                          </p>
                          {s.beds > 0 && (
                            <div className="flex items-center gap-3 text-text-secondary text-[11px] mt-2">
                              <span className="flex items-center gap-1">
                                <Bed className="w-3 h-3" />
                                {s.beds}
                              </span>
                              <span className="flex items-center gap-1">
                                <Bath className="w-3 h-3" />
                                {s.baths}
                              </span>
                              <span className="flex items-center gap-1">
                                <Maximize className="w-3 h-3" />
                                {s.sqft}m²
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="px-4 pb-4">
                    <Link
                      to={listing.type === "rent" ? "/rent" : "/buy"}
                      className="w-full h-10 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 inline-flex items-center justify-center gap-2"
                    >
                      Browse all properties
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
