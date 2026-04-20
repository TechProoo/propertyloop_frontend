import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Phone,
  Mail,
  Globe,
  MapPin,
  CheckCircle,
  Wrench,
  Clock,
  TrendingUp,
  Flag,
  Send,
  X,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import vendorsService from "../api/services/vendors";

const ease = [0.23, 1, 0.32, 1] as const;

const ReviewDisputeSection = ({
  targetName,
}: {
  targetName: string;
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
          <Flag className="w-4 h-4" /> Report Vendor
        </button>
      </div>

      {showReviewForm && (
        <motion.div
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
    </motion.div>
  );
};

const VendorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [vendor, setVendor] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingVendor, setLoadingVendor] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoadingVendor(false);
      return;
    }
    setLoadingVendor(true);
    Promise.all([
      vendorsService.getById(id).catch(() => null),
      vendorsService.listReviews(id).catch(() => []),
    ]).then(([vendorData, reviewsData]) => {
      if (vendorData) {
        setVendor({
          id: vendorData.id,
          photo:
            vendorData.avatarUrl ||
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
          banner: vendorData.bannerImage || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop",
          name: vendorData.name,
          category: vendorData.category || "Service Provider",
          location: vendorData.location || "",
          rating: vendorData.rating,
          jobsCount: vendorData.jobsCount,
          verified: vendorData.verified,
          phone: vendorData.phone || "",
          website: vendorData.website,
          bio: vendorData.bio || "",
          yearsExperience: vendorData.yearsExperience || "0",
          email: vendorData.email,
          portfolioImages: vendorData.portfolioImages || [],
          serviceArea: vendorData.serviceArea || "",
          availableForHire: vendorData.availableForHire,
        });
      }
      setReviews(reviewsData || []);
      setLoadingVendor(false);
    });
  }, [id]);

  if (loadingVendor) {
    return (
      <div className="min-h-screen bg-[#f5f0eb]">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-[#f5f0eb]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-6">
          <div className="w-20 h-20 rounded-full bg-bg-accent border border-border-light flex items-center justify-center mb-6">
            <Wrench className="w-8 h-8 text-text-subtle" />
          </div>
          <h1 className="font-heading font-bold text-primary-dark text-2xl mb-2">
            Vendor not found
          </h1>
          <p className="text-text-secondary text-sm mb-6">
            The vendor you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/services"
            className="h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Service Loop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

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
              to="/services"
              className="hover:text-primary transition-colors"
            >
              Service Loop
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">{vendor.name}</span>
          </div>

          {/* ─── Hero / Vendor Header ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="relative overflow-hidden rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-10"
          >
            {/* Banner background */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${vendor.banner})`,
              }}
            />
            <div className="absolute inset-0 bg-primary-dark/60" />
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5" />

            <div className="relative z-10 p-8 sm:p-10 lg:p-14">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Photo + badge */}
                <div className="relative shrink-0">
                  <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-3xl overflow-hidden border-4 border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    <img
                      src={vendor.photo}
                      alt={vendor.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  {vendor.verified && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-primary text-xs font-medium shadow-lg whitespace-nowrap">
                      <CheckCircle className="w-3.5 h-3.5" />
                      KYC Verified
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h1 className="font-heading text-[1.8rem] sm:text-[2.2rem] lg:text-[2.8rem] leading-[1.1] font-bold text-white tracking-tight">
                    {vendor.name}
                  </h1>
                  <p className="text-white/60 text-sm mt-1.5 flex items-center gap-2">
                    <Wrench className="w-4 h-4" />
                    {vendor.category}
                  </p>
                  <p className="text-white/50 text-sm mt-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {vendor.location || "Service area available"}
                  </p>

                  {/* Stats pills */}
                  <div className="flex flex-wrap gap-3 mt-5">
                    {[
                      {
                        icon: (
                          <Star className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" />
                        ),
                        value: vendor.rating.toString(),
                        label: "Rating",
                      },
                      {
                        icon: <TrendingUp className="w-3.5 h-3.5" />,
                        value: vendor.jobsCount.toString(),
                        label: "Jobs Completed",
                      },
                      {
                        icon: <Clock className="w-3.5 h-3.5" />,
                        value: `${vendor.yearsExperience} yrs`,
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
                  <Link
                    to={`/book-service/${vendor.id}`}
                    className="h-11 px-6 rounded-full bg-white text-primary-dark text-sm font-bold hover:bg-white/90 transition-colors inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
                  >
                    <Wrench className="w-4 h-4" />
                    Book Now
                  </Link>
                  <a
                    href={`tel:+${vendor.phone}`}
                    className="h-11 px-6 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-medium hover:bg-white hover:text-primary-dark transition-all inline-flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile contact buttons */}
          <div className="lg:hidden flex gap-3 mb-8 -mt-4">
            <Link
              to={`/book-service/${vendor.id}`}
              className="flex-1 h-11 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              Book Now
            </Link>
            <a
              href={`tel:+${vendor.phone}`}
              className="flex-1 h-11 rounded-full bg-white/80 border border-border-light text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all inline-flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call
            </a>
          </div>

          {/* ─── Main content grid ─── */}
          <div className="flex flex-col lg:flex-row gap-8 mb-20">
            {/* Left — About + Portfolio + Reviews */}
            <div className="flex-1">
              {/* About */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4, ease }}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8 mb-6"
              >
                <h2 className="font-heading font-bold text-primary-dark text-lg mb-4">
                  About {vendor.name.split(" ")[0]}
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {vendor.bio || "Professional service provider dedicated to delivering quality work."}
                </p>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-text-subtle text-[11px]">Service Area</p>
                      <p className="text-primary-dark text-sm font-medium">
                        {vendor.serviceArea || vendor.location || "Available"}
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
                        {vendor.yearsExperience} years
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-text-subtle text-[11px]">Category</p>
                      <p className="text-primary-dark text-sm font-medium">
                        {vendor.category}
                      </p>
                    </div>
                  </div>
                  {vendor.website && (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-text-subtle text-[11px]">Website</p>
                        <a
                          href={vendor.website}
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

              {/* Portfolio */}
              {vendor.portfolioImages && vendor.portfolioImages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4, ease }}
                  className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8 mb-6"
                >
                  <h2 className="font-heading font-bold text-primary-dark text-lg mb-4">
                    Portfolio
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {vendor.portfolioImages.map((img: string, i: number) => (
                      <div
                        key={i}
                        className="h-32 rounded-xl overflow-hidden border border-border-light shadow-sm hover:shadow-md transition-shadow"
                      >
                        <img
                          src={img}
                          alt={`Portfolio ${i + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

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
                    {vendor.rating} / 5.0
                  </div>
                </div>

                {reviews.length === 0 ? (
                  <p className="text-text-secondary text-sm text-center py-8">
                    No reviews yet. Be the first to review!
                  </p>
                ) : (
                  <div className="flex flex-col gap-5">
                    {reviews.map((review: any, i: number) => (
                      <div
                        key={i}
                        className="bg-white/60 backdrop-blur-sm border border-border-light rounded-2xl p-5"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                              {review.clientName?.charAt(0) || "U"}
                            </div>
                            <div>
                              <p className="font-heading font-semibold text-primary-dark text-sm">
                                {review.clientName}
                              </p>
                              <p className="text-text-subtle text-[11px]">
                                {new Date(review.createdAt).toLocaleDateString()}
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
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right sidebar — Contact + CTA */}
            <div className="lg:w-80 shrink-0">
              <div className="sticky top-8">
                {/* Contact card */}
                <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden mb-4">
                  <div className="h-24 bg-linear-to-r from-primary-dark to-primary/60" />
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-5 -mt-12 relative z-10">
                      <img
                        src={vendor.photo}
                        alt={vendor.name}
                        className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md"
                      />
                      <div>
                        <p className="font-heading font-bold text-primary-dark text-sm">
                          {vendor.name}
                        </p>
                        <p className="text-text-secondary text-xs">
                          {vendor.category}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-5">
                      <a
                        href={`tel:+${vendor.phone}`}
                        className="w-full h-10 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </a>
                      <a
                        href={`mailto:${vendor.email}`}
                        className="w-full h-10 rounded-full bg-white/80 border border-border-light text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all inline-flex items-center justify-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </a>
                    </div>

                    <div className="h-px bg-border-light mb-4" />

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Wrench className="w-3.5 h-3.5 text-primary" />
                        <span>{vendor.jobsCount} jobs completed</span>
                      </div>
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Star className="w-3.5 h-3.5 text-[#F5A623]" />
                        <span>{vendor.rating} rating ({reviews.length} reviews)</span>
                      </div>
                      {vendor.availableForHire && (
                        <div className="flex items-center gap-2 text-primary">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Available for hire</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Review section */}
                <ReviewDisputeSection targetName={vendor.name.split(" ")[0]} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VendorProfile;
