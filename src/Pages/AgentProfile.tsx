import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowLeft,
  Star,
  Phone,
  MessageCircle,
  Mail,
  Globe,
  MapPin,
  CheckCircle,
  Home,
  Briefcase,
  Clock,
  ShieldCheck,
  Bed,
  Bath,
  Maximize,
  TrendingUp,
  Users,
  Flag,
  Send,
  X,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { getAgentById, agents } from "../data/agents";

/* ─── Sample listings per agent (keyed by agent id) ─── */

const agentListings: Record<
  string,
  {
    image: string;
    price: string;
    title: string;
    address: string;
    beds: number;
    baths: number;
    sqft: string;
    type: string;
  }[]
> = {
  "adebayo-johnson": [
    {
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
      price: "₦185,000,000",
      title: "Contemporary Villa with Garden",
      address: "Lekki Phase 1, Lagos",
      beds: 4,
      baths: 3,
      sqft: "6,800",
      type: "For Sale",
    },
    {
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
      price: "₦65,000,000",
      title: "Luxury 3-Bed Flat in Lekki",
      address: "Lekki Phase 1, Lagos",
      beds: 3,
      baths: 3,
      sqft: "2,400",
      type: "For Sale",
    },
    {
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
      price: "₦3,200,000 /yr",
      title: "Modern Terrace in Gated Estate",
      address: "Lekki Phase 1, Lagos",
      beds: 3,
      baths: 2,
      sqft: "2,100",
      type: "For Rent",
    },
  ],
  "chioma-okafor": [
    {
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
      price: "₦120,000,000",
      title: "Penthouse with Ocean View",
      address: "Victoria Island, Lagos",
      beds: 4,
      baths: 3,
      sqft: "3,800",
      type: "For Sale",
    },
    {
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
      price: "₦85,000 /night",
      title: "Luxury Shortlet Apartment",
      address: "Victoria Island, Lagos",
      beds: 2,
      baths: 2,
      sqft: "1,600",
      type: "Shortlet",
    },
  ],
  "emeka-nwosu": [
    {
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
      price: "₦450,000,000",
      title: "Waterfront Mansion with Pool",
      address: "Ikoyi, Lagos",
      beds: 6,
      baths: 5,
      sqft: "12,000",
      type: "For Sale",
    },
    {
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
      price: "₦220,000,000",
      title: "Premium Office Space",
      address: "Ikoyi, Lagos",
      beds: 0,
      baths: 2,
      sqft: "4,200",
      type: "Commercial",
    },
    {
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
      price: "₦95,000,000",
      title: "Semi-Detached Duplex with BQ",
      address: "Ikoyi, Lagos",
      beds: 4,
      baths: 3,
      sqft: "5,200",
      type: "For Sale",
    },
  ],
};

/* Default listings for agents without specific ones */
const defaultListings = [
  {
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    price: "₦75,000,000",
    title: "Modern Family Home",
    address: "Lagos",
    beds: 4,
    baths: 3,
    sqft: "4,500",
    type: "For Sale",
  },
  {
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
    price: "₦2,800,000 /yr",
    title: "Spacious 3-Bed Apartment",
    address: "Lagos",
    beds: 3,
    baths: 2,
    sqft: "2,000",
    type: "For Rent",
  },
];

/* ─── Reviews ─── */

const reviews = [
  {
    name: "Olumide A.",
    date: "2 weeks ago",
    rating: 5,
    text: "Incredibly professional and responsive. Found us the perfect home within our budget in just 3 weeks. Highly recommend!",
  },
  {
    name: "Sandra E.",
    date: "1 month ago",
    rating: 5,
    text: "Transparent throughout the entire process. No hidden fees, no inflated prices. A rare find in Lagos real estate.",
  },
  {
    name: "Tayo O.",
    date: "2 months ago",
    rating: 4,
    text: "Very knowledgeable about the area. Helped us understand the neighbourhood scores and made sure everything was verified before we committed.",
  },
];

const ease = [0.23, 1, 0.32, 1] as const;

/* ─── Review / Dispute Section ─── */
const ReviewDisputeSection = ({
  targetName,
  targetType,
}: {
  targetName: string;
  targetType: "agent" | "vendor";
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [disputeText, setDisputeText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  const handleReviewSubmit = () => {
    if (reviewRating > 0 && reviewText.trim()) {
      setReviewSubmitted(true);
      setTimeout(() => {
        setShowReviewForm(false);
        setReviewSubmitted(false);
        setReviewRating(0);
        setReviewText("");
      }, 2000);
    }
  };

  const handleDisputeSubmit = () => {
    if (disputeText.trim()) {
      setDisputeSubmitted(true);
      setTimeout(() => {
        setShowDisputeForm(false);
        setDisputeSubmitted(false);
        setDisputeText("");
      }, 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.4, ease }}
      className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8 mt-6"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => {
            setShowReviewForm(!showReviewForm);
            setShowDisputeForm(false);
          }}
          className="flex-1 h-11 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2"
        >
          <Star className="w-4 h-4" /> Write a Review
        </button>
        <button
          onClick={() => {
            setShowDisputeForm(!showDisputeForm);
            setShowReviewForm(false);
          }}
          className="flex-1 h-11 rounded-full bg-white/60 border border-border-light text-text-secondary text-sm font-medium hover:border-red-300 hover:text-red-500 transition-all inline-flex items-center justify-center gap-2"
        >
          <Flag className="w-4 h-4" /> Report{" "}
          {targetType === "agent" ? "Agent" : "Vendor"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {showReviewForm && (
          <motion.div
            key="review"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-5 overflow-hidden"
          >
            {reviewSubmitted ? (
              <div className="text-center py-6">
                <CheckCircle className="w-10 h-10 text-primary mx-auto mb-2" />
                <p className="font-heading font-bold text-primary-dark">
                  Review submitted!
                </p>
                <p className="text-text-secondary text-xs mt-1">
                  Thank you for your feedback.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-heading font-semibold text-primary-dark text-sm">
                    Rate {targetName}
                  </p>
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className="text-text-subtle hover:text-primary-dark"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= reviewRating ? "text-[#F5A623] fill-[#F5A623]" : "text-border-light"}`}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors resize-none"
                />
                <button
                  onClick={handleReviewSubmit}
                  disabled={reviewRating === 0 || !reviewText.trim()}
                  className="mt-3 h-10 px-6 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Review
                </button>
              </>
            )}
          </motion.div>
        )}

        {showDisputeForm && (
          <motion.div
            key="dispute"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-5 overflow-hidden"
          >
            {disputeSubmitted ? (
              <div className="text-center py-6">
                <CheckCircle className="w-10 h-10 text-primary mx-auto mb-2" />
                <p className="font-heading font-bold text-primary-dark">
                  Report submitted!
                </p>
                <p className="text-text-secondary text-xs mt-1">
                  Our team will review your report within 24-48 hours.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-heading font-semibold text-primary-dark text-sm">
                    Report {targetName}
                  </p>
                  <button
                    onClick={() => setShowDisputeForm(false)}
                    className="text-text-subtle hover:text-primary-dark"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={disputeText}
                  onChange={(e) => setDisputeText(e.target.value)}
                  placeholder="Describe the issue..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors resize-none"
                />
                <button
                  onClick={handleDisputeSubmit}
                  disabled={!disputeText.trim()}
                  className="mt-3 h-10 px-6 rounded-full bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Flag className="w-3.5 h-3.5" /> Submit Report
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── Component ─── */

const AgentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const agent = getAgentById(id || "");

  if (!agent) {
    return (
      <div className="min-h-screen bg-[#f5f0eb]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-6">
          <div className="w-20 h-20 rounded-full bg-bg-accent border border-border-light flex items-center justify-center mb-6">
            <Users className="w-8 h-8 text-text-subtle" />
          </div>
          <h1 className="font-heading font-bold text-primary-dark text-2xl mb-2">
            Agent not found
          </h1>
          <p className="text-text-secondary text-sm mb-6">
            The agent you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/find-agent"
            className="h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Find Agent
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const listings = agentListings[agent.id] || defaultListings;

  /* Pick 3 similar agents (same specialty, exclude self) */
  const similarAgents = agents
    .filter(
      (a) =>
        a.id !== agent.id &&
        a.specialty.some((s) => agent.specialty.includes(s)),
    )
    .slice(0, 3);

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
            <Link
              to="/find-agent"
              className="hover:text-primary transition-colors"
            >
              Find Agent
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">{agent.name}</span>
          </div>

          {/* ─── Hero / Agent Header ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="relative overflow-hidden rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-10"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-primary-dark" />
            <div
              className="absolute inset-0 opacity-20 bg-cover bg-center"
              style={{
                backgroundImage: `url(${agent.photo})`,
                filter: "blur(40px) saturate(1.5)",
              }}
            />
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5" />

            <div className="relative z-10 p-8 sm:p-10 lg:p-14">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Photo + badge */}
                <div className="relative shrink-0">
                  <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-[24px] overflow-hidden border-4 border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    <img
                      src={agent.photo}
                      alt={agent.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  {agent.verified && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-primary text-xs font-medium shadow-lg whitespace-nowrap">
                      <CheckCircle className="w-3.5 h-3.5" />
                      KYC Verified
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h1 className="font-heading text-[1.8rem] sm:text-[2.2rem] lg:text-[2.8rem] leading-[1.1] font-bold text-white tracking-tight">
                    {agent.name}
                  </h1>
                  <p className="text-white/60 text-sm mt-1.5 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {agent.agency}
                  </p>
                  <p className="text-white/50 text-sm mt-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {agent.location}
                  </p>

                  {/* Specialty pills */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {agent.specialty.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white text-xs font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Stats pills */}
                  <div className="flex flex-wrap gap-3 mt-5">
                    {[
                      {
                        icon: (
                          <Star className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" />
                        ),
                        value: agent.rating.toString(),
                        label: "Rating",
                      },
                      {
                        icon: <Home className="w-3.5 h-3.5" />,
                        value: agent.listings.toString(),
                        label: "Active Listings",
                      },
                      {
                        icon: <TrendingUp className="w-3.5 h-3.5" />,
                        value: agent.soldRented.toString(),
                        label: "Deals Closed",
                      },
                      {
                        icon: <Clock className="w-3.5 h-3.5" />,
                        value: `${agent.yearsExperience} yrs`,
                        label: "Experience",
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-sm"
                      >
                        <span className="text-white">{s.icon}</span>
                        <span className="font-heading font-bold text-white">
                          {s.value}
                        </span>
                        <span className="text-white/50">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact buttons — desktop */}
                <div className="hidden lg:flex flex-col gap-3 shrink-0">
                  <a
                    href={`tel:+${agent.phone}`}
                    className="h-11 px-6 rounded-full bg-white text-primary-dark text-sm font-bold hover:bg-white/90 transition-colors inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
                  >
                    <Phone className="w-4 h-4" />
                    Call Agent
                  </a>
                  <a
                    href={`mailto:${agent.email}`}
                    className="h-11 px-6 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-medium hover:bg-white hover:text-primary-dark transition-all inline-flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile contact buttons */}
          <div className="lg:hidden flex gap-3 mb-8 -mt-4">
            <a
              href={`tel:+${agent.phone}`}
              className="flex-1 h-11 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call
            </a>
            <a
              href={`mailto:${agent.email}`}
              className="flex-1 h-11 rounded-full bg-white/80 border border-border-light text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all inline-flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Email
            </a>
          </div>

          {/* ─── Main content grid ─── */}
          <div className="flex flex-col lg:flex-row gap-8 mb-20">
            {/* Left — About + Reviews */}
            <div className="flex-1">
              {/* About */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4, ease }}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8 mb-6"
              >
                <h2 className="font-heading font-bold text-primary-dark text-lg mb-4">
                  About {agent.name.split(" ")[0]}
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {agent.bio}
                </p>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-text-subtle text-[11px]">Location</p>
                      <p className="text-primary-dark text-sm font-medium">
                        {agent.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-text-subtle text-[11px]">Experience</p>
                      <p className="text-primary-dark text-sm font-medium">
                        {agent.yearsExperience} years
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-text-subtle text-[11px]">Agency</p>
                      <p className="text-primary-dark text-sm font-medium">
                        {agent.agency}
                      </p>
                    </div>
                  </div>
                  {agent.website && (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-text-subtle text-[11px]">Website</p>
                        <a
                          href={agent.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary text-sm font-medium hover:underline"
                        >
                          Visit site
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Reviews */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease }}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading font-bold text-primary-dark text-lg">
                    Client Reviews
                  </h2>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    <Star className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" />
                    {agent.rating} / 5.0
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  {reviews.map((review, i) => (
                    <div
                      key={i}
                      className="bg-white/60 backdrop-blur-sm border border-border-light rounded-2xl p-5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-heading font-semibold text-primary-dark text-sm">
                              {review.name}
                            </p>
                            <p className="text-text-subtle text-[11px]">
                              {review.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: review.rating }).map((_, j) => (
                            <Star
                              key={j}
                              className="w-3 h-3 text-[#F5A623] fill-[#F5A623]"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {review.text}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Write Review / Report */}
              <ReviewDisputeSection
                targetName={agent.name}
                targetType="agent"
              />
            </div>

            {/* Right — Listings + Similar agents */}
            <div className="lg:w-105 shrink-0">
              {/* Active Listings */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4, ease }}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden mb-6"
              >
                <div className="px-6 py-5 border-b border-border-light flex items-center justify-between">
                  <h2 className="font-heading font-bold text-primary-dark text-lg">
                    Active Listings
                  </h2>
                  <span className="text-xs text-text-secondary">
                    {listings.length} properties
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-4">
                  {listings.map((listing, i) => (
                    <div
                      key={i}
                      className="group flex gap-4 bg-white/60 backdrop-blur-sm border border-border-light rounded-2xl p-3 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative">
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-full bg-primary/90 text-white text-[10px] font-medium">
                          {listing.type}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 py-0.5">
                        <p className="font-heading font-bold text-primary-dark text-[15px]">
                          {listing.price}
                        </p>
                        <p className="font-heading font-semibold text-primary-dark text-sm leading-snug mt-0.5 truncate">
                          {listing.title}
                        </p>
                        <p className="text-text-secondary text-xs mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {listing.address}
                        </p>
                        {listing.beds > 0 && (
                          <div className="flex items-center gap-3 text-text-secondary text-[11px] mt-2">
                            <span className="flex items-center gap-1">
                              <Bed className="w-3 h-3" />
                              {listing.beds}
                            </span>
                            <span className="flex items-center gap-1">
                              <Bath className="w-3 h-3" />
                              {listing.baths}
                            </span>
                            <span className="flex items-center gap-1">
                              <Maximize className="w-3 h-3" />
                              {listing.sqft}m²
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 pb-4">
                  <button className="w-full h-10 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                    View all {agent.listings} listings
                  </button>
                </div>
              </motion.div>

              {/* Similar Agents */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4, ease }}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden"
              >
                <div className="px-6 py-5 border-b border-border-light">
                  <h2 className="font-heading font-bold text-primary-dark text-lg">
                    Similar Agents
                  </h2>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  {similarAgents.map((sa) => (
                    <button
                      key={sa.id}
                      onClick={() => navigate(`/agent/${sa.id}`)}
                      className="flex items-center gap-4 bg-white/60 backdrop-blur-sm border border-border-light rounded-2xl p-3 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer text-left w-full"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                        <img
                          src={sa.photo}
                          alt={sa.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-semibold text-primary-dark text-sm">
                          {sa.name}
                        </p>
                        <p className="text-text-secondary text-xs truncate">
                          {sa.agency} · {sa.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-text-secondary shrink-0">
                        <Star className="w-3 h-3 text-[#F5A623] fill-[#F5A623]" />
                        {sa.rating}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="px-4 pb-4">
                  <Link
                    to="/find-agent"
                    className="w-full h-10 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 inline-flex items-center justify-center gap-2"
                  >
                    Browse all agents
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
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
                {agent.name} has been verified through Smile Identity. Every
                agent on PropertyLoop passes identity verification before they
                can list properties.
              </p>
            </div>
            <a
              href={`tel:+${agent.phone}`}
              className="shrink-0 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors duration-300 inline-flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Contact {agent.name.split(" ")[0]}
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AgentProfile;
