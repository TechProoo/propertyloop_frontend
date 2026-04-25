import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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
  Clock,
  FileText,
  Handshake,
  Send,
  DollarSign,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import listingsService from "../api/services/listings";
import messagesService from "../api/services/messages";
import type { Listing as ApiListing } from "../api/types";
import BookmarkButton from "../components/ui/BookmarkButton";
import { DetailSkeleton } from "../components/ui/Skeleton";
import { useAuth } from "../context/AuthContext";
// Agent data now comes embedded in the listing response

const ease = [0.23, 1, 0.32, 1] as const;

type OfferStatus = "idle" | "form" | "sending" | "sent";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [listing, setListing] = useState<ApiListing | null>(null);
  const [similar, setSimilar] = useState<ApiListing[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [offerStatus, setOfferStatus] = useState<OfferStatus>("idle");
  const [offerAmount, setOfferAmount] = useState("");
  const [offerNote, setOfferNote] = useState("");
  const [offerError, setOfferError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoadingPage(true);
    listingsService
      .getById(id)
      .then((data) => {
        setListing(data);
        // Fetch similar listings of the same type
        listingsService
          .list({ type: data.type, limit: 4 })
          .then((res) =>
            setSimilar(res.items.filter((l) => l.id !== data.id).slice(0, 3)),
          )
          .catch(() => {});
      })
      .catch(() => setListing(null))
      .finally(() => setLoadingPage(false));
  }, [id]);

  if (loadingPage) {
    return (
      <div className="min-h-screen bg-[#f5f0eb]">
        <Navbar />
        <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
          <div className="max-w-7xl mx-auto py-8">
            <DetailSkeleton />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

  const agent = listing.agent
    ? {
        id: listing.agent.id,
        photo:
          listing.agent.avatarUrl ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
        name: listing.agent.name || "Agent",
        agency: listing.agent.agency || "",
        rating: listing.agent.rating ?? 0,
        listings: listing.agent.listingsCount ?? 0,
        soldRented: listing.agent.soldRentedCount ?? 0,
        verified: listing.agent.verified ?? false,
        phone: listing.agent.phone || "",
        email: listing.agent.email || "",
      }
    : null;

  const nextImage = () =>
    setActiveImage((p) => (p + 1) % listing.images.length);
  const prevImage = () =>
    setActiveImage(
      (p) => (p - 1 + listing.images.length) % listing.images.length,
    );

  const buildOfferMessage = () => {
    const cleanAmount = offerAmount.replace(/[^\d]/g, "");
    const formattedAmount = cleanAmount
      ? `₦${Number(cleanAmount).toLocaleString()}`
      : "(amount not specified)";
    const buyerName = user?.name || "A prospective buyer";
    const lines = [
      `Hello ${agent?.name || "there"},`,
      "",
      `I'd like to make an offer on the property listed below.`,
      "",
      `Property:    ${listing.title}`,
      `Location:    ${listing.address}`,
      `Listing ID:  ${listing.id}`,
      `Asking:      ${listing.priceLabel}`,
      `My offer:    ${formattedAmount}`,
    ];
    if (offerNote.trim()) {
      lines.push("", "Additional notes:", offerNote.trim());
    }
    lines.push(
      "",
      "Please let me know if this works, or share a counter-offer.",
      "",
      `Thanks,`,
      buyerName,
    );
    return lines.join("\n");
  };

  const handleSubmitOffer = async () => {
    if (!isLoggedIn || !user) {
      navigate("/onboarding");
      return;
    }
    if (!agent?.id) {
      setOfferError("Agent details unavailable for this listing.");
      return;
    }
    if (!offerAmount.replace(/[^\d]/g, "")) {
      setOfferError("Please enter your offer amount.");
      return;
    }
    setOfferError("");
    setOfferStatus("sending");
    try {
      const text = buildOfferMessage();
      const { conversationId } = await messagesService.createOrFind({
        recipientId: agent.id,
        recipientRole: "AGENT",
        senderRole: (user.role as "BUYER" | "AGENT" | "VENDOR") || "BUYER",
        listingId: listing.id,
      });
      await messagesService.sendMessage(conversationId, text);
      setOfferStatus("sent");
      setTimeout(() => navigate(`/messages?with=${conversationId}`), 1800);
    } catch (err: any) {
      setOfferError(
        err?.response?.data?.message ||
          "Could not send your offer. Please try again.",
      );
      setOfferStatus("form");
    }
  };

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
                listing.type === "RENT"
                  ? "/rent"
                  : listing.type === "SHORTLET"
                    ? "/shortlet"
                    : "/buy"
              }
              className="hover:text-primary transition-colors"
            >
              {listing.type === "RENT"
                ? "Rent"
                : listing.type === "SHORTLET"
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
            <div className="relative h-75 sm:h-100 lg:h-125 bg-black">
              {/* Blurred backdrop so sub-resolution images don't get upscaled.
                  The main image then sits centered at its native size via
                  object-contain — sharp, no stretching artifacts. */}
              <img
                src={listing.images[activeImage]}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60"
              />
              <img
                key={listing.images[activeImage]}
                src={listing.images[activeImage]}
                alt={listing.title}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="relative w-full h-full object-contain"
              />
              {/* Gradient overlay bottom */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />

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
                  {listing.type === "SALE"
                    ? "For Sale"
                    : listing.type === "RENT"
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
                  {listing.priceLabel}
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
                    {listing.documents.map((doc, i) => {
                      const docTypeLabel: Record<string, string> = {
                        C_OF_O: "Certificate of Occupancy",
                        SURVEY_PLAN: "Survey Plan",
                        BUILDING_PERMIT: "Building Permit",
                        RECEIPT: "Purchase Receipt",
                      };
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-4 bg-white/60 backdrop-blur-sm border border-border-light rounded-2xl p-4"
                        >
                          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-heading font-semibold text-primary-dark text-sm">
                              {docTypeLabel[doc.type] || doc.type}
                            </p>
                            <p className="text-text-secondary text-xs mt-0.5">
                              Verified Apr 2026
                            </p>
                          </div>

                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium shrink-0">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-text-subtle text-[11px] mt-4 leading-relaxed">
                    Documents are verified by PropertyLoop. For your safety,
                    original copies are not displayed publicly — request them
                    directly from the listing agent.
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
                <h2 className="font-heading font-bold text-primary-dark text-lg mb-5">
                  Price History
                </h2>
                <div className="text-center py-6">
                  <Clock className="w-8 h-8 text-text-subtle mx-auto mb-2" />
                  <p className="text-text-secondary text-sm">
                    No price history available yet.
                  </p>
                  <p className="text-text-subtle text-xs mt-1">
                    Price changes will appear here once tracked.
                  </p>
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-heading font-bold text-primary-dark text-lg">
                        Property Logbook
                      </h2>
                      <p className="text-text-subtle text-[11px] truncate">
                        Property ID: PL-{listing.id.slice(0, 5).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />0 records
                  </span>
                </div>
                <p className="text-text-secondary text-xs mb-5 leading-relaxed">
                  Every maintenance, repair, and service performed on this
                  property is permanently recorded with verified vendor details.
                </p>

                <div className="text-center py-6">
                  <ClipboardList className="w-8 h-8 text-text-subtle mx-auto mb-2" />
                  <p className="text-text-secondary text-sm">
                    No logbook entries yet.
                  </p>
                  <p className="text-text-subtle text-xs mt-1">
                    Service records will appear here once vendors complete jobs.
                  </p>
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
                  {listing.type === "SALE" && offerStatus === "idle" && (
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
                              Asking price: {listing.priceLabel}
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
                        {offerError && (
                          <p className="mt-3 text-xs text-red-600">
                            {offerError}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-4">
                          <button
                            onClick={() => {
                              setOfferStatus("idle");
                              setOfferError("");
                            }}
                            className="flex-1 h-10 rounded-full bg-white/80 border border-border-light text-primary-dark text-sm font-medium hover:bg-bg-accent transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSubmitOffer}
                            className="flex-1 h-10 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Send Offer
                          </button>
                        </div>
                      </>
                    )}

                    {/* Sending — in flight */}
                    {offerStatus === "sending" && (
                      <div className="text-center py-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 animate-pulse">
                          <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <p className="font-heading font-bold text-primary-dark text-sm">
                          Sending your offer…
                        </p>
                        <p className="text-text-secondary text-xs mt-1">
                          Delivering it to {agent?.name || "the agent"}.
                        </p>
                      </div>
                    )}

                    {/* Sent */}
                    {offerStatus === "sent" && (
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
                          Offer sent!
                        </p>
                        <p className="text-text-secondary text-xs mt-1 max-w-xs mx-auto">
                          Your offer is now in {agent?.name || "the agent"}'s
                          inbox. Opening the conversation…
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Price card */}
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
                            src={s.coverImage}
                            alt={s.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-full bg-primary/90 text-white text-[10px] font-medium">
                            {s.type === "SALE"
                              ? "Sale"
                              : s.type === "RENT"
                                ? "Rent"
                                : "Shortlet"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 py-0.5">
                          <p className="font-heading font-bold text-primary-dark text-[15px]">
                            {s.priceLabel}
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
                      to={listing.type === "RENT" ? "/rent" : "/buy"}
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
